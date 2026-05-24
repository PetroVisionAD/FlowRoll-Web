// Demo Mode — pre-seeds realistic sample data for client previews.
// All data lives in localStorage; reset wipes and re-seeds.

const DEMO_FLAG_KEY = "flowroll.demo_mode.v1";
const TOUR_KEY = "flowroll.demo_tour.v1";

// localStorage keys owned by the app (must stay in sync with storage.js
// and friends). Reset clears all of these.
const APP_KEYS = [
  "flowroll.rounds.v1",
  "flowroll.sessions.v1",
  "flowroll.weakness_history.v1",
  "flowroll.streak.v1",
  "flowroll.lesson_progress.v1",
  "flowroll.mock_user.v1",
];

const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const daysAgo = (n, hours = 18) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
};

// Training data tells a story: Mount used to be the weakness (90% loss rate),
// then recent rolls show a clean turnaround — perfect for showcasing the
// Weakness Alert / improvement detection features.
const DEMO_ROUNDS = [
  { pos: "Mount", result: "Loss", days: 12, belt: "Purple", sub: "None" },
  { pos: "Mount", result: "Loss", days: 12, belt: "Purple", sub: "None" },
  { pos: "Mount", result: "Loss", days: 11, belt: "Brown", sub: "None" },
  { pos: "Closed Guard", result: "Win", days: 11, belt: "White", sub: "Triangle" },
  { pos: "Mount", result: "Loss", days: 9, belt: "Blue", sub: "None" },
  { pos: "Half Guard", result: "Loss", days: 9, belt: "Blue", sub: "None" },
  { pos: "Closed Guard", result: "Win", days: 8, belt: "Blue", sub: "Arm-bar" },
  { pos: "Side Control", result: "Loss", days: 5, belt: "Purple", sub: "None" },
  { pos: "Mount", result: "Win", days: 4, belt: "Blue", sub: "None" },
  { pos: "Mount", result: "Win", days: 3, belt: "White", sub: "Cross Collar Choke" },
  { pos: "Half Guard", result: "Win", days: 2, belt: "Blue", sub: "None" },
  { pos: "Mount", result: "Win", days: 1, belt: "Purple", sub: "Arm-bar" },
  { pos: "Back Control", result: "Win", days: 0, belt: "Blue", sub: "Rear Naked Choke" },
  { pos: "Closed Guard", result: "Draw", days: 0, belt: "Black", sub: "None" },
];

const DEMO_USER = {
  id: "u_demo",
  email: "alex@flowroll.demo",
  name: "Alex Reyes",
  belt: "Blue",
  stripes: 2,
  homeGym: "Gracie Barra — Downtown",
  createdAt: daysAgo(120, 9),
};

const DEMO_LESSON_PROGRESS = {
  "closed-guard:posture-broken": {
    learned: true,
    saved: false,
    learnedAt: daysAgo(3),
    viewedAt: daysAgo(0),
  },
  "mount:high-mount-arm-trap": {
    learned: true,
    saved: true,
    learnedAt: daysAgo(4),
    savedAt: daysAgo(4),
    viewedAt: daysAgo(1),
  },
  "back-control:seatbelt-tight-hooks-in": {
    learned: true,
    saved: false,
    learnedAt: daysAgo(2),
    viewedAt: daysAgo(0),
  },
  "half-guard:underhook-secured": {
    learned: false,
    saved: true,
    savedAt: daysAgo(5),
    viewedAt: daysAgo(5),
  },
  "side-control:opponent-turning-in": {
    learned: false,
    saved: true,
    savedAt: daysAgo(6),
    viewedAt: daysAgo(6),
  },
};

// Weakness history seeded so the "You are improving in Mount" banner fires:
// older snapshot 90%, recent snapshot (pre-wins) 75% → current will be ~45%.
const DEMO_WEAKNESS_HISTORY = [
  { position: "Mount", lossRate: 90, at: daysAgo(10) },
  { position: "Mount", lossRate: 75, at: daysAgo(6) },
];

const DEMO_STREAK = () => ({
  streak: 4,
  bestStreak: 9,
  lastLogDate: dayKey(new Date()),
});

const DEMO_SESSIONS = [
  {
    id: "s_demo_1",
    roundCount: 4,
    wins: 1,
    losses: 3,
    createdAt: daysAgo(9),
    feedbacks: [],
  },
  {
    id: "s_demo_2",
    roundCount: 3,
    wins: 3,
    losses: 0,
    createdAt: daysAgo(3),
    feedbacks: ["Mount improved"],
  },
];

export const isDemoEnabled = () => {
  // Default: enabled (this build is explicitly a client preview).
  // Explicitly set to "false" if someone wants to turn it off.
  const v = localStorage.getItem(DEMO_FLAG_KEY);
  return v !== "false";
};

export const setDemoEnabled = (enabled) => {
  localStorage.setItem(DEMO_FLAG_KEY, enabled ? "true" : "false");
};

const buildRounds = () =>
  DEMO_ROUNDS.map((r, i) => ({
    id: `r_demo_${i}`,
    opponentBelt: r.belt,
    startingPosition: r.pos,
    result: r.result,
    submission: r.sub,
    createdAt: daysAgo(r.days, 18 + (i % 3)),
  }));

export const seedDemoData = () => {
  localStorage.setItem("flowroll.rounds.v1", JSON.stringify(buildRounds()));
  localStorage.setItem(
    "flowroll.sessions.v1",
    JSON.stringify(DEMO_SESSIONS),
  );
  localStorage.setItem(
    "flowroll.weakness_history.v1",
    JSON.stringify(DEMO_WEAKNESS_HISTORY),
  );
  localStorage.setItem(
    "flowroll.streak.v1",
    JSON.stringify(DEMO_STREAK()),
  );
  localStorage.setItem(
    "flowroll.lesson_progress.v1",
    JSON.stringify(DEMO_LESSON_PROGRESS),
  );
  localStorage.setItem("flowroll.mock_user.v1", JSON.stringify(DEMO_USER));
  seedPerformanceData();
};

// ─── Performance demo data ─────────────────────────────────────────
const perfDayKey = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const seedPerformanceData = () => {
  // Targets — moderate values for a Blue Belt athlete.
  localStorage.setItem(
    "flowroll.perf.targets.v1",
    JSON.stringify({
      targetWeight: 76,
      weightClass: "Light Featherweight",
      protein: 170,
      carbs: 240,
      fats: 75,
      calories: 2400,
      waterMl: 3000,
    }),
  );

  // 8 days of weight, gently trending down ~0.8 kg.
  const weights = [
    { days: 7, weight: 78.4 },
    { days: 6, weight: 78.2 },
    { days: 5, weight: 78.0 },
    { days: 4, weight: 77.8 },
    { days: 3, weight: 77.5 },
    { days: 2, weight: 77.3 },
    { days: 1, weight: 77.1 },
    { days: 0, weight: 77.0 },
  ];
  localStorage.setItem(
    "flowroll.perf.weight.v1",
    JSON.stringify(
      weights.map(({ days, weight }) => ({
        date: perfDayKey(days),
        weight,
      })),
    ),
  );

  // Macros — 7 days, with hit/miss days that drive the protein × win rate
  // insight (protein-hit days line up with recent winning rounds).
  const macros = {};
  const macroDays = [
    { d: 7, p: 95, c: 180, f: 60, k: 1800 }, // miss
    { d: 6, p: 100, c: 200, f: 65, k: 1950 }, // miss
    { d: 5, p: 160, c: 230, f: 70, k: 2300 }, // hit
    { d: 4, p: 175, c: 260, f: 80, k: 2500 }, // hit
    { d: 3, p: 170, c: 250, f: 78, k: 2450 }, // hit
    { d: 2, p: 175, c: 245, f: 76, k: 2420 }, // hit
    { d: 1, p: 180, c: 250, f: 80, k: 2480 }, // hit
    { d: 0, p: 90, c: 160, f: 55, k: 1700 }, // today: in progress
  ];
  macroDays.forEach((m) => {
    macros[perfDayKey(m.d)] = {
      protein: m.p,
      carbs: m.c,
      fats: m.f,
      calories: m.k,
    };
  });
  localStorage.setItem("flowroll.perf.macros.v1", JSON.stringify(macros));

  // Hydration — a couple of low days to trigger the fatigue insight.
  const hydration = {};
  const hydroDays = [
    { d: 7, ml: 1400, e: false, s: false }, // low
    { d: 6, ml: 1600, e: false, s: false }, // low
    { d: 5, ml: 2600, e: true, s: false },
    { d: 4, ml: 3100, e: true, s: false },
    { d: 3, ml: 3300, e: true, s: true },
    { d: 2, ml: 3000, e: true, s: false },
    { d: 1, ml: 3200, e: true, s: false },
    { d: 0, ml: 1800, e: false, s: false }, // today: still drinking
  ];
  hydroDays.forEach((h) => {
    hydration[perfDayKey(h.d)] = {
      waterMl: h.ml,
      electrolytes: h.e,
      sauna: h.s,
    };
  });
  localStorage.setItem(
    "flowroll.perf.hydration.v1",
    JSON.stringify(hydration),
  );

  // Recovery — low recovery on days 7 & 6 (which align with Mount-loss
  // rounds in the round seed), high recovery on days 3-1 (aligns with wins).
  // This makes the Recovery × Mount-position insight fire.
  const recovery = {};
  const recoveryDays = [
    { d: 7, sleep: 5.5, sore: 4, energy: 2 }, // low
    { d: 6, sleep: 6, sore: 4, energy: 2 }, // low
    { d: 5, sleep: 7, sore: 3, energy: 3 }, // moderate
    { d: 4, sleep: 7.5, sore: 2, energy: 4 }, // high-ish
    { d: 3, sleep: 8, sore: 2, energy: 5 }, // high
    { d: 2, sleep: 8, sore: 2, energy: 4 }, // high
    { d: 1, sleep: 7.5, sore: 2, energy: 4 }, // high
    { d: 0, sleep: 7, sore: 2, energy: 4 }, // today
  ];
  recoveryDays.forEach((r) => {
    recovery[perfDayKey(r.d)] = {
      sleep: r.sleep,
      soreness: r.sore,
      energy: r.energy,
    };
  });
  localStorage.setItem(
    "flowroll.perf.recovery.v1",
    JSON.stringify(recovery),
  );
};

// True when no app data exists yet — lets us seed only on a brand-new install.
export const needsInitialSeed = () => {
  return !APP_KEYS.some((k) => localStorage.getItem(k) !== null);
};

export const resetDemoData = () => {
  APP_KEYS.forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem(TOUR_KEY);
  seedDemoData();
};

// ─── Guided Tour State ────────────────────────────────────────────────
export const TOUR_STEPS = [
  {
    id: "dashboard",
    title: "Start on the Dashboard",
    body: "Your training hub — today's focus, weakness alerts, and streak tracking all live here.",
    route: "/",
  },
  {
    id: "library",
    title: "Browse the Training Library",
    body: "Six core positions, each with real scenarios. Click Closed Guard to keep going.",
    route: "/library",
  },
  {
    id: "lesson",
    title: "Open a Lesson",
    body: "Video breakdown, key steps, when to use it, common mistakes, and a 3-stage drill progression.",
    route: "/lesson/closed-guard/posture-broken",
  },
  {
    id: "logger",
    title: "Log Your Rounds",
    body: "Capture every roll — belt, position, result. FlowRoll uses this to find your weaknesses.",
    route: "/logger",
  },
  {
    id: "progress",
    title: "Review Progress",
    body: "See your loss-rate by position, streak, and which position is costing you the most.",
    route: "/progress",
  },
];

export const loadTourState = () => {
  try {
    const raw = localStorage.getItem(TOUR_KEY);
    if (!raw) return { active: false, step: 0, seen: false };
    return JSON.parse(raw);
  } catch {
    return { active: false, step: 0, seen: false };
  }
};

export const saveTourState = (state) => {
  localStorage.setItem(TOUR_KEY, JSON.stringify(state));
};
