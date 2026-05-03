import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Target,
  AlertTriangle,
  ArrowRight,
  Play,
  BookOpen,
  TrendingUp,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { POSITIONS, SCENARIOS, getPosition } from "@/data/library";
import {
  loadRounds,
  computeStats,
  getStreak,
  computeWeaknessImprovement,
} from "@/lib/storage";

// Pick a "Today's Focus" scenario — use weakest position if data exists,
// otherwise pick closed-guard/posture-broken as default.
const pickTodaysFocus = (stats) => {
  if (stats.weakest) {
    const positionId = POSITIONS.find(
      (p) => p.name === stats.weakest.position,
    )?.id;
    const scenarios = SCENARIOS[positionId];
    if (scenarios?.length) {
      return { positionId, scenarioId: scenarios[0].id };
    }
  }
  return { positionId: "closed-guard", scenarioId: "posture-broken" };
};

export default function Dashboard() {
  const [rounds, setRounds] = useState([]);
  useEffect(() => {
    setRounds(loadRounds());
  }, []);

  const stats = useMemo(() => computeStats(rounds), [rounds]);
  const focus = useMemo(() => pickTodaysFocus(stats), [stats]);
  const streakData = useMemo(() => getStreak(), [rounds]);
  const improvement = useMemo(
    () => computeWeaknessImprovement(stats),
    [stats],
  );

  const focusPosition = getPosition(focus.positionId);
  const focusScenario = SCENARIOS[focus.positionId].find(
    (s) => s.id === focus.scenarioId,
  );

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-dashboard"
    >
      {/* HERO */}
      <section className="fr-fade-up mb-12">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-4">
          <Flame className="w-3.5 h-3.5" />
          Training Session · {new Date().toLocaleDateString(undefined, { weekday: "long" })}
        </div>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.9] uppercase text-white">
          Train with <span className="text-[#FF3B30]">intent.</span>
          <br />
          Roll with <span className="text-white/40">purpose.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-white/60 leading-relaxed">
          Structured, scenario-based jiu-jitsu learning. Study the situation, drill
          the response, log the round, expose your weaknesses.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/lesson/${focus.positionId}/${focus.scenarioId}`}
            data-testid="cta-continue-training"
          >
            <Button className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold tracking-wide h-12 px-6 fr-pressable">
              <Play className="w-4 h-4 mr-2" fill="currentColor" />
              Continue Training
            </Button>
          </Link>
          <Link to="/library" data-testid="cta-browse-library">
            <Button
              variant="outline"
              className="rounded-sm bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white font-ui font-semibold tracking-wide h-12 px-6 fr-pressable"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Library
            </Button>
          </Link>
        </div>

        {(streakData.streak > 0 || improvement) && (
          <div
            className="mt-7 flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-3 text-sm"
            data-testid="feedback-strip"
          >
            {streakData.streak > 0 && (
              <div
                className="flex items-center gap-3 font-ui"
                data-testid="streak-banner"
              >
                <Flame
                  className="w-4 h-4 text-[#FF3B30]"
                  fill="currentColor"
                />
                <span data-testid="streak-current">
                  <span className="text-white font-semibold">
                    {streakData.streak} Day
                  </span>
                  <span className="text-white/60"> Streak</span>
                </span>
                {streakData.bestStreak > 0 && (
                  <>
                    <span className="text-white/20">·</span>
                    <span
                      className="text-white/50 label-eyebrow"
                      data-testid="streak-best"
                    >
                      Best: {streakData.bestStreak}{" "}
                      {streakData.bestStreak === 1 ? "Day" : "Days"}
                    </span>
                  </>
                )}
              </div>
            )}
            {improvement && (
              <div
                className="flex items-center gap-2 font-ui"
                data-testid="improvement-banner"
              >
                <TrendingUp className="w-4 h-4 text-[#007AFF]" />
                <span className="text-white">{improvement.message}</span>
                <span className="label-eyebrow text-white/40">
                  {improvement.from}% → {improvement.to}%
                </span>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="fr-hairline mb-10" />

      {/* 3 CARDS: Focus / Weakness / Snapshot */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* TODAY'S FOCUS */}
        <div
          className="fr-card p-6 sm:p-8 lg:col-span-2 fr-fade-up"
          data-testid="card-todays-focus"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 label-eyebrow text-white/40">
              <Target className="w-3.5 h-3.5" />
              Today's Focus
            </div>
            <span className="label-eyebrow text-[#007AFF]">
              {focusPosition.category}
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight leading-none text-white mb-3">
            {focusPosition.name}
          </h2>
          <p className="font-ui text-white/80 text-lg mb-2">
            {focusScenario.title}
          </p>
          <p className="text-sm text-white/50 mb-6 leading-relaxed">
            {focusScenario.lesson.summary}
          </p>

          <div className="fr-hairline mb-5" />

          <div className="grid grid-cols-3 gap-4 mb-6">
            {focusScenario.lesson.keySteps.slice(0, 3).map((step, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-sm p-4 bg-black/40"
              >
                <div className="font-display text-2xl text-[#FF3B30] leading-none mb-2">
                  0{i + 1}
                </div>
                <div className="text-xs text-white/70 leading-relaxed">
                  {step}
                </div>
              </div>
            ))}
          </div>

          <Link
            to={`/lesson/${focus.positionId}/${focus.scenarioId}`}
            className="inline-flex items-center gap-2 text-white font-ui font-semibold group"
            data-testid="focus-open-lesson"
          >
            Open lesson
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* WEAKNESS ALERT */}
        <div
          className="fr-card p-6 sm:p-8 fr-fade-up"
          data-testid="card-weakness-alert"
          style={{
            animationDelay: "140ms",
            borderColor: stats.weakest ? "rgba(255,59,48,0.35)" : undefined,
          }}
        >
          <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Weakness Alert
          </div>

          {stats.weakest && stats.weakest.total >= 1 ? (
            <>
              <h3 className="font-display text-3xl tracking-tight leading-none text-white mb-2">
                {stats.weakest.position}
              </h3>
              <p className="text-sm text-white/60 mb-5">
                You're losing <span className="text-[#FF3B30] font-semibold">{stats.weakest.lossRate}%</span>{" "}
                of rounds started here.
              </p>

              <div className="space-y-3 mb-6">
                <Row label="Rounds" value={stats.weakest.total} />
                <Row label="Wins" value={stats.weakest.wins} />
                <Row label="Losses" value={stats.weakest.losses} accent />
              </div>

              <Link
                to="/progress"
                className="inline-flex items-center gap-2 text-[#FF3B30] font-ui font-semibold group"
                data-testid="weakness-view-progress"
              >
                View full breakdown
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </>
          ) : (
            <>
              <h3 className="font-display text-3xl tracking-tight leading-none text-white mb-2">
                No data yet
              </h3>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                Log a few rolling rounds and we'll surface your weakest position
                automatically.
              </p>
              <Link to="/logger" data-testid="weakness-log-round">
                <Button
                  variant="outline"
                  className="rounded-sm bg-transparent border-white/20 text-white hover:bg-white/5 font-ui w-full fr-pressable"
                >
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Log your first round
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* SNAPSHOT */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        <Stat label="Total rounds" value={stats.total} testid="stat-total" />
        <Stat label="Wins" value={stats.wins} valueColor="text-white" testid="stat-wins" />
        <Stat label="Losses" value={stats.losses} valueColor="text-[#FF3B30]" testid="stat-losses" />
        <Stat
          label="Positions studied"
          value={stats.lossRateByPosition.length}
          valueColor="text-[#007AFF]"
          testid="stat-positions"
        />
      </section>

      {/* QUICK LIBRARY */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="label-eyebrow text-white/40 mb-2">Jump In</div>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight leading-none text-white">
              Core Positions
            </h2>
          </div>
          <Link
            to="/library"
            className="hidden sm:inline-flex items-center gap-2 text-white/70 hover:text-white font-ui text-sm group"
            data-testid="link-view-library"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {POSITIONS.map((p, i) => (
            <Link
              key={p.id}
              to={`/library/${p.id}`}
              data-testid={`dashboard-quick-${p.id}`}
              className="fr-card fr-pressable p-4 group fr-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="label-eyebrow text-white/30 mb-2">
                {p.category}
              </div>
              <div className="font-display text-lg tracking-tight leading-tight text-white group-hover:text-[#FF3B30] transition-colors">
                {p.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="fr-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="label-eyebrow text-[#007AFF] mb-2">Performance</div>
          <div className="font-display text-2xl tracking-tight text-white">
            Track every round. Find every hole.
          </div>
        </div>
        <Link to="/progress" data-testid="dashboard-view-progress">
          <Button
            variant="outline"
            className="rounded-sm bg-transparent border-white/20 text-white hover:bg-white/5 font-ui"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Progress
          </Button>
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value, valueColor = "text-white", testid }) {
  return (
    <div className="fr-card p-5" data-testid={testid}>
      <div className="label-eyebrow text-white/40 mb-3">{label}</div>
      <div className={`font-display text-4xl leading-none ${valueColor}`}>
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );
}

function Row({ label, value, accent = false }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/50 font-ui">{label}</span>
      <span
        className={`font-display text-xl leading-none ${
          accent ? "text-[#FF3B30]" : "text-white"
        }`}
      >
        {String(value).padStart(2, "0")}
      </span>
    </div>
  );
}
