import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { History, Flame, Trophy, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  loadRounds,
  loadSessions,
  loadStreakData,
  computeStats,
} from "@/lib/storage";

const dayLabel = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Group rounds by YYYY-MM-DD
const groupByDay = (rounds) => {
  const map = new Map();
  rounds.forEach((r) => {
    const d = new Date(r.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!map.has(key))
      map.set(key, { key, date: d, rounds: [] });
    map.get(key).rounds.push(r);
  });
  return [...map.values()].sort((a, b) => b.date - a.date);
};

export default function TrainingHistory() {
  const [rounds, setRounds] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setRounds(loadRounds());
    setSessions(loadSessions());
  }, []);

  const grouped = useMemo(() => groupByDay(rounds), [rounds]);
  const stats = useMemo(() => computeStats(rounds), [rounds]);
  const streak = useMemo(() => loadStreakData(), []);

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-history"
    >
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <History className="w-3.5 h-3.5" />
          Training History
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-3">
          Every Day On The Mat.
        </h1>
        <p className="max-w-xl text-base text-white/60 leading-relaxed">
          Chronological log of rounds grouped by training day.
        </p>
      </div>

      <div className="fr-hairline mb-8" />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Chip label="Training Days" value={grouped.length} />
        <Chip label="Rounds" value={rounds.length} />
        <Chip label="Current Streak" value={streak.streak} />
        <Chip
          label="Best Streak"
          value={streak.bestStreak}
          color="text-[#FF3B30]"
        />
      </section>

      {grouped.length === 0 ? (
        <div
          className="fr-card p-10 text-center"
          data-testid="history-empty"
        >
          <p className="text-sm text-white/60 mb-5">
            Your training history will fill in as you log rounds.
          </p>
          <Link to="/logger">
            <Button className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold">
              Log a Round
            </Button>
          </Link>
        </div>
      ) : (
        <ol className="space-y-5" data-testid="history-timeline">
          {grouped.map((day, i) => {
            const wins = day.rounds.filter((r) => r.result === "Win").length;
            const losses = day.rounds.filter(
              (r) => r.result === "Loss",
            ).length;
            return (
              <li
                key={day.key}
                className="fr-card p-5 sm:p-6 fr-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
                data-testid={`history-day-${day.key}`}
              >
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <div className="label-eyebrow text-white/40">
                      {dayLabel(day.date.toISOString())}
                    </div>
                    <div className="font-display text-xl text-white mt-1 tracking-tight">
                      {day.rounds.length}{" "}
                      {day.rounds.length === 1 ? "round" : "rounds"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-ui">
                    <span className="flex items-center gap-1 text-white/70">
                      <Trophy className="w-3.5 h-3.5" />
                      {wins}W
                    </span>
                    <span className="flex items-center gap-1 text-[#FF3B30]">
                      <Flag className="w-3.5 h-3.5" />
                      {losses}L
                    </span>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {day.rounds.map((r) => {
                    const color =
                      r.result === "Win"
                        ? "#FF3B30"
                        : r.result === "Loss"
                          ? "#007AFF"
                          : "#A1A1AA";
                    return (
                      <li
                        key={r.id}
                        className="flex items-center gap-3 text-sm font-ui py-1.5"
                      >
                        <div
                          className="w-1 h-4 rounded-sm"
                          style={{ background: color }}
                        />
                        <span className="text-white">
                          {r.startingPosition}
                        </span>
                        <span className="text-white/30">·</span>
                        <span className="text-white/60">
                          vs {r.opponentBelt}
                        </span>
                        {r.submission && r.submission !== "None" && (
                          <>
                            <span className="text-white/30">·</span>
                            <span className="text-white/50 italic">
                              {r.submission}
                            </span>
                          </>
                        )}
                        <span
                          className="ml-auto label-eyebrow"
                          style={{ color }}
                        >
                          {r.result}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      )}

      <p className="text-[11px] text-white/40 font-ui mt-8">
        Stored locally. Cloud history & multi-device sync via Supabase planned.
      </p>
    </div>
  );
}

function Chip({ label, value, color = "text-white" }) {
  return (
    <div className="fr-card p-4">
      <div className="label-eyebrow text-white/40 mb-2">{label}</div>
      <div className={`font-display text-2xl leading-none ${color}`}>
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );
}
