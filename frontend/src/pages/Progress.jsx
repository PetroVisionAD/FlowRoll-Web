import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  AlertTriangle,
  Trophy,
  Flag,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { loadRounds, computeStats } from "@/lib/storage";

export default function Progress() {
  const [rounds, setRounds] = useState([]);
  useEffect(() => {
    setRounds(loadRounds());
  }, []);

  const stats = useMemo(() => computeStats(rounds), [rounds]);
  const winRate =
    stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
  const weakest = stats.weakest;

  const chartData = stats.lossRateByPosition.map((p) => ({
    name: p.position,
    lossRate: p.lossRate,
    total: p.total,
    wins: p.wins,
    losses: p.losses,
  }));

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-progress"
    >
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          Performance Dashboard
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-3">
          Your Signal.
          <br />
          <span className="text-white/40">The Mat Doesn't Lie.</span>
        </h1>
        <p className="max-w-2xl text-base text-white/60 leading-relaxed">
          Aggregated stats from every logged round. Loss rate reveals the
          position costing you the most.
        </p>
      </div>

      <div className="fr-hairline mb-8" />

      {stats.total === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* STAT CARDS */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Stat
              label="Total Rounds"
              value={stats.total}
              color="text-white"
              testid="progress-total"
            />
            <Stat
              label="Wins"
              value={stats.wins}
              color="text-white"
              testid="progress-wins"
              accent="Trophy"
            />
            <Stat
              label="Losses"
              value={stats.losses}
              color="text-[#FF3B30]"
              testid="progress-losses"
              accent="Flag"
            />
            <Stat
              label="Win Rate"
              value={`${winRate}%`}
              color="text-[#007AFF]"
              testid="progress-winrate"
            />
          </section>

          {/* WEAKNESS BANNER */}
          {weakest && (
            <section
              className="fr-card p-6 sm:p-8 mb-10 fr-fade-up relative overflow-hidden"
              data-testid="progress-weakest-banner"
              style={{ borderColor: "rgba(255,59,48,0.35)" }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.08] fr-grid-bg" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-sm bg-[#FF3B30]/10 border border-[#FF3B30]/30 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-7 h-7 text-[#FF3B30]" />
                  </div>
                  <div>
                    <div className="label-eyebrow text-[#FF3B30] mb-2">
                      Weakest Position
                    </div>
                    <h2 className="font-display text-4xl sm:text-5xl tracking-tight leading-none text-white mb-2">
                      {weakest.position}
                    </h2>
                    <p className="font-ui text-white/70 text-sm">
                      <span className="text-[#FF3B30] font-semibold">
                        {weakest.lossRate}%
                      </span>{" "}
                      loss rate across {weakest.total} rounds — drill this
                      position next session.
                    </p>
                  </div>
                </div>
                <Link
                  to="/library"
                  data-testid="weakest-drill-now"
                  className="shrink-0"
                >
                  <Button className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold tracking-wide h-12 px-6 fr-pressable">
                    Drill This Position
                  </Button>
                </Link>
              </div>
            </section>
          )}

          {/* CHART */}
          <section
            className="fr-card p-6 sm:p-8 mb-10"
            data-testid="progress-chart"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="label-eyebrow text-white/40 mb-1">
                  Loss Rate by Position
                </div>
                <div className="font-display text-2xl tracking-tight text-white uppercase">
                  Where You Get Beat
                </div>
              </div>
            </div>

            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 30 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#A1A1AA"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    angle={-18}
                    dy={12}
                    height={60}
                  />
                  <YAxis
                    stroke="#A1A1AA"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,59,48,0.08)" }}
                    contentStyle={{
                      background: "#141414",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "4px",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#fff", fontWeight: 700 }}
                    itemStyle={{ color: "#fff" }}
                    formatter={(v, _n, p) => [
                      `${v}%`,
                      `Loss Rate (${p.payload.losses}/${p.payload.total})`,
                    ]}
                  />
                  <Bar dataKey="lossRate" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          weakest && entry.name === weakest.position
                            ? "#FF3B30"
                            : "#FFFFFF"
                        }
                        fillOpacity={
                          weakest && entry.name === weakest.position
                            ? 1
                            : 0.5
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* POSITION BREAKDOWN */}
          <section className="mb-10">
            <div className="label-eyebrow text-white/40 mb-4">
              Position Breakdown
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-testid="position-breakdown"
            >
              {stats.lossRateByPosition.map((p) => {
                const isWeakest =
                  weakest && p.position === weakest.position;
                return (
                  <div
                    key={p.position}
                    className="fr-card p-5"
                    data-testid={`breakdown-${p.position.toLowerCase().replace(/\s+/g, "-")}`}
                    style={
                      isWeakest
                        ? { borderColor: "rgba(255,59,48,0.45)" }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-display text-2xl tracking-tight text-white">
                        {p.position}
                      </h4>
                      <span
                        className="label-eyebrow"
                        style={{ color: isWeakest ? "#FF3B30" : "#A1A1AA" }}
                      >
                        {p.lossRate}% loss
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-sm overflow-hidden mb-4">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${p.lossRate}%`,
                          background: isWeakest ? "#FF3B30" : "#FFFFFF",
                          opacity: isWeakest ? 1 : 0.4,
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <Mini label="Total" value={p.total} />
                      <Mini label="Wins" value={p.wins} color="#FFFFFF" />
                      <Mini label="Losses" value={p.losses} color="#FF3B30" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <section
      className="fr-card p-10 text-center"
      data-testid="progress-empty"
    >
      <div className="w-14 h-14 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
        <ClipboardList className="w-6 h-6 text-white/50" />
      </div>
      <h2 className="font-display text-3xl tracking-tight text-white mb-2">
        No rounds logged yet
      </h2>
      <p className="text-sm text-white/60 max-w-md mx-auto mb-6">
        Log your first few rolling rounds to see win/loss trends and your
        weakest position.
      </p>
      <Link to="/logger" data-testid="progress-empty-cta">
        <Button className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold h-11 px-6 fr-pressable">
          <ClipboardList className="w-4 h-4 mr-2" />
          Open Logger
        </Button>
      </Link>
    </section>
  );
}

function Stat({ label, value, color, testid, accent }) {
  const Icon = accent === "Trophy" ? Trophy : accent === "Flag" ? Flag : null;
  return (
    <div className="fr-card p-5" data-testid={testid}>
      <div className="flex items-center gap-2 label-eyebrow text-white/40 mb-3">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </div>
      <div className={`font-display text-4xl leading-none ${color}`}>
        {typeof value === "number" ? String(value).padStart(2, "0") : value}
      </div>
    </div>
  );
}

function Mini({ label, value, color = "#A1A1AA" }) {
  return (
    <div>
      <div
        className="label-eyebrow text-[9px] mb-1"
        style={{ color: "#A1A1AA" }}
      >
        {label}
      </div>
      <div className="font-display text-lg leading-none" style={{ color }}>
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );
}
