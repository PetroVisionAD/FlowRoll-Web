const ROUNDS_KEY = "flowroll.rounds.v1";
const SESSIONS_KEY = "flowroll.sessions.v1";

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
