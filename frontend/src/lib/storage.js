const ROUNDS_KEY = "flowroll.rounds.v1";
const SESSIONS_KEY = "flowroll.sessions.v1";
const WEAKNESS_HISTORY_KEY = "flowroll.weakness_history.v1";
const STREAK_KEY = "flowroll.streak.v1";

export const loadRounds = () => {
  try {
    const raw = localStorage.getItem(ROUNDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRounds = (rounds) => {
  localStorage.setItem(ROUNDS_KEY, JSON.stringify(rounds));
};

export const addRound = (round) => {
  const rounds = loadRounds();
  const next = [
    ...rounds,
    { ...round, id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString() },
  ];
  saveRounds(next);
  updateStreakOnLog();
  return next;
};

export const clearRounds = () => {
  localStorage.removeItem(ROUNDS_KEY);
};

export const loadSessions = () => {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addSession = (session) => {
  const sessions = loadSessions();
  const next = [
    ...sessions,
    { ...session, id: `s_${Date.now()}`, createdAt: new Date().toISOString() },
  ];
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
  return next;
};

// Stats helpers
export const computeStats = (rounds) => {
  const total = rounds.length;
  const wins = rounds.filter((r) => r.result === "Win").length;
  const losses = rounds.filter((r) => r.result === "Loss").length;
  const draws = rounds.filter((r) => r.result === "Draw").length;

  const byPos = {};
  rounds.forEach((r) => {
    if (!byPos[r.startingPosition]) {
      byPos[r.startingPosition] = { total: 0, wins: 0, losses: 0, draws: 0 };
    }
    byPos[r.startingPosition].total += 1;
    if (r.result === "Win") byPos[r.startingPosition].wins += 1;
    if (r.result === "Loss") byPos[r.startingPosition].losses += 1;
    if (r.result === "Draw") byPos[r.startingPosition].draws += 1;
  });

  const lossRateByPosition = Object.entries(byPos).map(([pos, v]) => ({
    position: pos,
    total: v.total,
    wins: v.wins,
    losses: v.losses,
    lossRate: v.total ? Math.round((v.losses / v.total) * 100) : 0,
  }));

  lossRateByPosition.sort((a, b) => b.lossRate - a.lossRate);

  const weakest =
    lossRateByPosition.find((p) => p.total >= 2) || lossRateByPosition[0] || null;

  return { total, wins, losses, draws, lossRateByPosition, weakest };
};

// ─── Streak ────────────────────────────────────────────────────────────
// Persisted state: { streak, bestStreak, lastLogDate } in localStorage.
// - Log on same day as lastLogDate → no change.
// - Log on consecutive day → streak += 1, update bestStreak if exceeded.
// - Gap > 1 day (or first log) → streak = 1.
const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const daysBetween = (aKey, bKey) => {
  const [ay, am, ad] = aKey.split("-").map(Number);
  const [by, bm, bd] = bKey.split("-").map(Number);
  const a = new Date(ay, am - 1, ad);
  const b = new Date(by, bm - 1, bd);
  return Math.round((b - a) / 86400000);
};

export const loadStreakData = () => {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { streak: 0, bestStreak: 0, lastLogDate: null };
    const parsed = JSON.parse(raw);
    return {
      streak: parsed.streak || 0,
      bestStreak: parsed.bestStreak || 0,
      lastLogDate: parsed.lastLogDate || null,
    };
  } catch {
    return { streak: 0, bestStreak: 0, lastLogDate: null };
  }
};

const saveStreakData = (data) => {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
};

// Called whenever a round is logged. Returns the updated streak state.
export const updateStreakOnLog = (now = new Date()) => {
  const today = dayKey(now);
  const { streak, bestStreak, lastLogDate } = loadStreakData();

  let nextStreak;
  if (!lastLogDate) {
    nextStreak = 1;
  } else if (lastLogDate === today) {
    nextStreak = streak || 1;
  } else {
    const gap = daysBetween(lastLogDate, today);
    nextStreak = gap === 1 ? streak + 1 : 1;
  }

  const nextBest = Math.max(bestStreak, nextStreak);
  const data = {
    streak: nextStreak,
    bestStreak: nextBest,
    lastLogDate: today,
  };
  saveStreakData(data);
  return data;
};

// Read-time helper: if the user hasn't logged today OR yesterday, the
// current streak has effectively broken. Persist the reset so the UI
// reflects it immediately (without requiring a new log).
export const getStreak = (now = new Date()) => {
  const data = loadStreakData();
  if (!data.lastLogDate || data.streak === 0) return data;
  const today = dayKey(now);
  const gap = daysBetween(data.lastLogDate, today);
  if (gap > 1) {
    const reset = {
      streak: 0,
      bestStreak: data.bestStreak,
      lastLogDate: data.lastLogDate,
    };
    saveStreakData(reset);
    return reset;
  }
  return data;
};

// ─── Session feedback ─────────────────────────────────────────────────
// Compares a finished session to the rounds that existed BEFORE this
// session. For each position with ≥2 session rounds and ≥2 prior rounds,
// emits an "improved" message when loss-rate drops by ≥15 percentage
// points in this session vs. the prior baseline.
export const computeSessionFeedback = (sessionRounds, priorRounds) => {
  const feedbacks = [];
  if (!sessionRounds?.length) return feedbacks;

  const groupBy = (arr) => {
    const g = {};
    arr.forEach((r) => {
      if (!g[r.startingPosition])
        g[r.startingPosition] = { total: 0, losses: 0, wins: 0 };
      g[r.startingPosition].total += 1;
      if (r.result === "Loss") g[r.startingPosition].losses += 1;
      if (r.result === "Win") g[r.startingPosition].wins += 1;
    });
    return g;
  };

  const sessG = groupBy(sessionRounds);
  const priorG = groupBy(priorRounds || []);

  Object.entries(sessG).forEach(([pos, s]) => {
    if (s.total < 2) return;
    const prior = priorG[pos];
    if (!prior || prior.total < 2) return;
    const sRate = s.losses / s.total;
    const pRate = prior.losses / prior.total;
    if (pRate - sRate >= 0.15) {
      feedbacks.push({
        type: "session-improvement",
        position: pos,
        message: `${pos} improved`,
      });
    }
  });
  return feedbacks;
};

// ─── Weakness improvement tracking ────────────────────────────────────
export const loadWeaknessHistory = () => {
  try {
    const raw = localStorage.getItem(WEAKNESS_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const recordWeaknessSnapshot = (weakest) => {
  if (!weakest) return;
  const hist = loadWeaknessHistory();
  const last = hist[hist.length - 1];
  // Avoid flooding: skip if same position + same loss rate within 1h.
  if (
    last &&
    last.position === weakest.position &&
    last.lossRate === weakest.lossRate
  ) {
    return;
  }
  const next = [
    ...hist,
    {
      position: weakest.position,
      lossRate: weakest.lossRate,
      at: new Date().toISOString(),
    },
  ].slice(-10);
  localStorage.setItem(WEAKNESS_HISTORY_KEY, JSON.stringify(next));
};

// Returns an improvement note if a previously-weak position now has a
// lower loss rate than when it was flagged (≥10 percentage-point drop).
export const computeWeaknessImprovement = (currentStats) => {
  const hist = loadWeaknessHistory();
  if (hist.length < 2) return null;

  const prev = hist[hist.length - 2]; // older snapshot
  const currentEntry = currentStats.lossRateByPosition.find(
    (p) => p.position === prev.position,
  );
  if (!currentEntry) return null;

  if (prev.lossRate - currentEntry.lossRate >= 10) {
    return {
      type: "weakness-improvement",
      position: prev.position,
      message: `You are improving in ${prev.position}`,
      from: prev.lossRate,
      to: currentEntry.lossRate,
    };
  }
  return null;
};
