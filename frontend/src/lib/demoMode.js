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
