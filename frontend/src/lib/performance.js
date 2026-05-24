// Performance module — all CRUD for weight, macros, hydration, recovery.
// localStorage only. Daily data is keyed by YYYY-MM-DD (last write wins).

const TARGETS_KEY = "flowroll.perf.targets.v1";
const WEIGHT_KEY = "flowroll.perf.weight.v1";
const MACROS_KEY = "flowroll.perf.macros.v1";
const HYDRATION_KEY = "flowroll.perf.hydration.v1";
const RECOVERY_KEY = "flowroll.perf.recovery.v1";

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const safeRead = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

// ─── Targets ──────────────────────────────────────────────────────────
const DEFAULT_TARGETS = {
  targetWeight: null,
  weightClass: "",
  protein: 160,
  carbs: 220,
  fats: 70,
  calories: 2300,
  waterMl: 3000,
};

export const loadTargets = () => ({
  ...DEFAULT_TARGETS,
  ...safeRead(TARGETS_KEY, {}),
});

export const saveTargets = (patch) => {
  const next = { ...loadTargets(), ...patch };
  write(TARGETS_KEY, next);
  return next;
};

// ─── Weight ───────────────────────────────────────────────────────────
export const loadWeights = () => safeRead(WEIGHT_KEY, []);

export const logWeight = (weight, date = dayKey()) => {
  if (!weight || isNaN(weight)) return loadWeights();
  const entries = loadWeights();
  const existing = entries.findIndex((e) => e.date === date);
  const entry = { date, weight: Number(weight) };
  if (existing >= 0) entries[existing] = entry;
  else entries.push(entry);
  entries.sort((a, b) => (a.date < b.date ? -1 : 1));
  write(WEIGHT_KEY, entries);
  return entries;
};

export const recentWeights = (days = 7) => {
  const entries = loadWeights();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (days - 1));
  cutoff.setHours(0, 0, 0, 0);
  const cutoffKey = dayKey(cutoff);
  return entries.filter((e) => e.date >= cutoffKey);
};

export const latestWeight = () => {
  const entries = loadWeights();
  return entries.length ? entries[entries.length - 1] : null;
};

// ─── Daily-keyed maps (macros, hydration, recovery) ──────────────────
const upsertDaily = (key, date, patch) => {
  const data = safeRead(key, {});
  data[date] = { ...(data[date] || {}), ...patch };
  write(key, data);
  return data[date];
};

const getDaily = (key, date) => safeRead(key, {})[date] || null;

// Macros
export const loadMacros = (date = dayKey()) =>
  getDaily(MACROS_KEY, date) || {
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
  };

export const updateMacros = (patch, date = dayKey()) =>
  upsertDaily(MACROS_KEY, date, patch);

// Hydration
export const loadHydration = (date = dayKey()) =>
  getDaily(HYDRATION_KEY, date) || {
    waterMl: 0,
    electrolytes: false,
    sauna: false,
  };

export const updateHydration = (patch, date = dayKey()) =>
  upsertDaily(HYDRATION_KEY, date, patch);

// Recovery
export const loadRecovery = (date = dayKey()) =>
  getDaily(RECOVERY_KEY, date) || {
    sleep: 0,
    soreness: 0,
    energy: 0,
  };

export const updateRecovery = (patch, date = dayKey()) =>
  upsertDaily(RECOVERY_KEY, date, patch);

// Full daily maps (read-only convenience for insights)
export const loadAllMacros = () => safeRead(MACROS_KEY, {});
export const loadAllHydration = () => safeRead(HYDRATION_KEY, {});
export const loadAllRecovery = () => safeRead(RECOVERY_KEY, {});

// ─── Derived: recovery status ────────────────────────────────────────
// Weighted score: sleep contributes most, soreness (inverted) and energy
// contribute equally. Returns { score: 0–100, status, message }.
export const recoveryStatus = (entry) => {
  const sleep = Number(entry?.sleep || 0);
  const soreness = Number(entry?.soreness || 0);
  const energy = Number(entry?.energy || 0);

  if (!sleep && !soreness && !energy) {
    return {
      score: null,
      status: "Not logged",
      message: "Log today's recovery to get a status.",
    };
  }

  // Sleep: 0 → 0, 8h+ → 100. Score linear in between.
  const sleepScore = Math.min(100, (sleep / 8) * 100);
  // Soreness: 1 = perfect (100), 5 = wrecked (0).
  const sorenessScore = soreness ? ((5 - soreness) / 4) * 100 : 50;
  // Energy: 1 = empty (0), 5 = peak (100).
  const energyScore = energy ? ((energy - 1) / 4) * 100 : 50;

  const score = Math.round(
    sleepScore * 0.5 + sorenessScore * 0.25 + energyScore * 0.25,
  );

  if (score >= 75) {
    return {
      score,
      status: "High Recovery",
      message: "Good day for hard rounds.",
    };
  }
  if (score >= 50) {
    return {
      score,
      status: "Moderate Recovery",
      message: "Steady session — push selectively.",
    };
  }
  return {
    score,
    status: "Low Recovery",
    message: "Consider drilling-focused training.",
  };
};

// ─── Derived: macro feedback ─────────────────────────────────────────
export const macroFeedback = (today, targets) => {
  const out = [];
  if (!today.protein && !today.carbs && !today.fats && !today.calories) {
    return [{ tone: "muted", text: "Log today's macros to get feedback." }];
  }
  const pct = (a, b) => (b ? a / b : 0);

  const proteinPct = pct(today.protein, targets.protein);
  const caloriesPct = pct(today.calories, targets.calories);

  if (proteinPct < 0.7) {
    out.push({ tone: "warn", text: "Protein target missed." });
  } else if (proteinPct >= 0.95 && caloriesPct >= 0.9) {
    out.push({ tone: "good", text: "Good fuel day." });
  } else if (proteinPct >= 0.9) {
    out.push({ tone: "good", text: "Protein on point." });
  }

  if (caloriesPct < 0.6) {
    out.push({ tone: "warn", text: "Recovery intake low." });
  }
  if (caloriesPct > 1.2) {
    out.push({ tone: "muted", text: "Over calorie target." });
  }
  if (!out.length) {
    out.push({ tone: "muted", text: "Tracking on pace." });
  }
  return out;
};

// ─── Derived: hydration feedback ─────────────────────────────────────
export const hydrationFeedback = (today, targets) => {
  if (!today.waterMl) {
    return { tone: "muted", text: "Log water to get a status." };
  }
  const pct = today.waterMl / (targets.waterMl || 3000);
  const needsExtra = today.sauna;
  const requiredPct = needsExtra ? 1.2 : 1;
  if (pct < 0.5) {
    return { tone: "warn", text: "Hydration low." };
  }
  if (pct >= requiredPct && today.electrolytes) {
    return { tone: "good", text: "Good recovery hydration." };
  }
  if (pct >= 0.8) {
    return { tone: "good", text: "On pace — keep sipping." };
  }
  return { tone: "muted", text: "Hydration moderate." };
};
