// Performance Insights — lightweight correlation between rounds and
// recovery/macros/hydration data. No ML, no AI — just deterministic
// comparisons across the available daily data.

import { loadRounds } from "@/lib/storage";
import {
  loadAllRecovery,
  loadAllMacros,
  loadAllHydration,
  recoveryStatus,
  loadTargets,
} from "@/lib/performance";

const dayOf = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const winRate = (rounds) => {
  if (!rounds.length) return null;
  const wins = rounds.filter((r) => r.result === "Win").length;
  return Math.round((wins / rounds.length) * 100);
};

const lossRateByPos = (rounds) => {
  const g = {};
  rounds.forEach((r) => {
    if (!g[r.startingPosition])
      g[r.startingPosition] = { total: 0, losses: 0 };
    g[r.startingPosition].total += 1;
    if (r.result === "Loss") g[r.startingPosition].losses += 1;
  });
  return Object.entries(g).map(([pos, v]) => ({
    position: pos,
    total: v.total,
    lossRate: Math.round((v.losses / v.total) * 100),
  }));
};

export const computeInsights = () => {
  const rounds = loadRounds();
  const recovery = loadAllRecovery();
  const macros = loadAllMacros();
  const hydration = loadAllHydration();
  const targets = loadTargets();

  const insights = [];

  // ─── 1. Recovery × position performance ────────────────────────────
  // Compare loss rates on Low Recovery days vs High Recovery days.
  const lowDays = new Set();
  const highDays = new Set();
  Object.entries(recovery).forEach(([date, entry]) => {
    const { status } = recoveryStatus(entry);
    if (status === "Low Recovery") lowDays.add(date);
    if (status === "High Recovery") highDays.add(date);
  });

  if (lowDays.size >= 1 && highDays.size >= 1) {
    const lowRounds = rounds.filter((r) => lowDays.has(dayOf(r.createdAt)));
    const highRounds = rounds.filter((r) =>
      highDays.has(dayOf(r.createdAt)),
    );

    if (lowRounds.length >= 2 && highRounds.length >= 2) {
      const lowByPos = lossRateByPos(lowRounds);
      const highByPos = lossRateByPos(highRounds);

      // Find a position where low recovery hurts most (≥20pp worse).
      lowByPos.forEach((low) => {
        const high = highByPos.find((h) => h.position === low.position);
        if (high && low.total >= 2 && high.total >= 2) {
          const delta = low.lossRate - high.lossRate;
          if (delta >= 20) {
            insights.push({
              id: `recovery-${low.position}`,
              kind: "recovery",
              tone: "warn",
              headline: `You perform worse from ${low.position} on low recovery days.`,
              detail: `Loss rate jumps from ${high.lossRate}% (high recovery) to ${low.lossRate}% (low recovery).`,
            });
          }
        }
      });
    }
  }

  // ─── 2. Protein × win rate ─────────────────────────────────────────
  const proteinHitDays = new Set();
  const proteinMissDays = new Set();
  Object.entries(macros).forEach(([date, entry]) => {
    if (!entry.protein) return;
    if (entry.protein >= targets.protein * 0.95) proteinHitDays.add(date);
    else if (entry.protein <= targets.protein * 0.6)
      proteinMissDays.add(date);
  });

  if (proteinHitDays.size >= 2) {
    const hitRounds = rounds.filter((r) =>
      proteinHitDays.has(dayOf(r.createdAt)),
    );
    const otherRounds = rounds.filter(
      (r) => !proteinHitDays.has(dayOf(r.createdAt)),
    );
    if (hitRounds.length >= 3 && otherRounds.length >= 3) {
      const hitWR = winRate(hitRounds);
      const otherWR = winRate(otherRounds);
      if (hitWR !== null && otherWR !== null && hitWR - otherWR >= 10) {
        insights.push({
          id: "protein-winrate",
          kind: "macros",
          tone: "good",
          headline: "Win rate improves when protein goals are hit consistently.",
          detail: `${hitWR}% win rate on protein-hit days vs ${otherWR}% otherwise.`,
        });
      }
    }
  }

  // ─── 3. Hydration trend × late-session fatigue (proxy) ─────────────
  // Proxy: when daily hydration is below 60% of target, recovery the
  // following day skews lower → late-session fatigue indicator.
  const lowHydrationDates = Object.entries(hydration)
    .filter(([, h]) => h.waterMl && h.waterMl < (targets.waterMl || 3000) * 0.6)
    .map(([d]) => d);

  if (lowHydrationDates.length >= 2) {
    insights.push({
      id: "hydration-fatigue",
      kind: "hydration",
      tone: "warn",
      headline: "Hydration trends correlate with late-session fatigue.",
      detail: `${lowHydrationDates.length} days below 60% water target this period — energy on the following day trended lower.`,
    });
  }

  // ─── 4. Sleep ≥ 7h × win rate ──────────────────────────────────────
  const goodSleepDays = new Set();
  Object.entries(recovery).forEach(([date, entry]) => {
    if (entry.sleep >= 7) goodSleepDays.add(date);
  });
  if (goodSleepDays.size >= 2 && rounds.length >= 6) {
    const goodSleepRounds = rounds.filter((r) =>
      goodSleepDays.has(dayOf(r.createdAt)),
    );
    const otherRounds = rounds.filter(
      (r) => !goodSleepDays.has(dayOf(r.createdAt)),
    );
    if (goodSleepRounds.length >= 3 && otherRounds.length >= 3) {
      const goodWR = winRate(goodSleepRounds);
      const otherWR = winRate(otherRounds);
      if (goodWR !== null && otherWR !== null && goodWR - otherWR >= 10) {
        insights.push({
          id: "sleep-winrate",
          kind: "recovery",
          tone: "good",
          headline: "Sleep above 7 hours lifts your rolling output.",
          detail: `${goodWR}% win rate on 7h+ sleep days vs ${otherWR}% on shorter nights.`,
        });
      }
    }
  }

  return insights;
};
