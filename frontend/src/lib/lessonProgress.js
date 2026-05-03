// Lesson progress tracker — two independent flags per scenario:
//   learned  → "I know this one, I've drilled it"
//   saved    → "bookmark for later"
// Structured to be trivially replaced with a Supabase `lesson_progress` table.

const KEY = "flowroll.lesson_progress.v1";

const makeId = (positionId, scenarioId) => `${positionId}:${scenarioId}`;

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const getLessonState = (positionId, scenarioId) => {
  const data = load();
  return (
    data[makeId(positionId, scenarioId)] || {
      learned: false,
      saved: false,
      viewedAt: null,
    }
  );
};

export const toggleLearned = (positionId, scenarioId) => {
  const data = load();
  const id = makeId(positionId, scenarioId);
  const current = data[id] || { learned: false, saved: false };
  data[id] = {
    ...current,
    learned: !current.learned,
    learnedAt: !current.learned ? new Date().toISOString() : null,
  };
  save(data);
  return data[id];
};

export const toggleSaved = (positionId, scenarioId) => {
  const data = load();
  const id = makeId(positionId, scenarioId);
  const current = data[id] || { learned: false, saved: false };
  data[id] = {
    ...current,
    saved: !current.saved,
    savedAt: !current.saved ? new Date().toISOString() : null,
  };
  save(data);
  return data[id];
};

export const markViewed = (positionId, scenarioId) => {
  const data = load();
  const id = makeId(positionId, scenarioId);
  const current = data[id] || { learned: false, saved: false };
  data[id] = { ...current, viewedAt: new Date().toISOString() };
  save(data);
};

export const loadAllProgress = () => {
  const data = load();
  return Object.entries(data).map(([id, value]) => {
    const [positionId, scenarioId] = id.split(":");
    return { positionId, scenarioId, ...value };
  });
};
