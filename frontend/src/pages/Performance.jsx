import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Apple,
  Droplet,
  Moon,
  Lightbulb,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  Check,
  Flame,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  loadTargets,
  saveTargets,
  loadWeights,
  logWeight,
  recentWeights,
  latestWeight,
  loadMacros,
  updateMacros,
  loadHydration,
  updateHydration,
  loadRecovery,
  updateRecovery,
  recoveryStatus,
  macroFeedback,
  hydrationFeedback,
} from "@/lib/performance";
import { computeInsights } from "@/lib/insights";

const ratingScale = [1, 2, 3, 4, 5];

export default function Performance() {
  const [targets, setTargets] = useState(loadTargets());
  const [weights, setWeights] = useState(loadWeights());
  const [macros, setMacros] = useState(loadMacros());
  const [hydration, setHydration] = useState(loadHydration());
  const [recovery, setRecovery] = useState(loadRecovery());
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    setInsights(computeInsights());
  }, [macros, hydration, recovery, weights]);

  const recovStatus = useMemo(() => recoveryStatus(recovery), [recovery]);
  const macroFB = useMemo(
    () => macroFeedback(macros, targets),
    [macros, targets],
  );
  const hydroFB = useMemo(
    () => hydrationFeedback(hydration, targets),
    [hydration, targets],
  );

  const refreshTargets = () => setTargets(loadTargets());

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-performance"
    >
      {/* HEADER */}
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <Activity className="w-3.5 h-3.5" />
          Performance Tracker
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-3">
          Recover. Fuel. Perform.
        </h1>
        <p className="max-w-2xl text-base text-white/60 leading-relaxed">
          A fast daily check-in for the inputs that actually move your rolling
          output — weight, macros, hydration, recovery. No food databases. No
          obsession. Three minutes a day.
        </p>
      </div>

      <div className="fr-hairline mb-8" />

      {/* SECTION 1 — WEIGHT */}
      <WeightSection
        weights={weights}
        setWeights={setWeights}
        targets={targets}
        refreshTargets={refreshTargets}
      />

      {/* SECTION 2 — MACROS */}
      <MacrosSection
        macros={macros}
        setMacros={setMacros}
        targets={targets}
        refreshTargets={refreshTargets}
        feedback={macroFB}
      />

      {/* SECTION 3 — HYDRATION */}
      <HydrationSection
        hydration={hydration}
        setHydration={setHydration}
        targets={targets}
        feedback={hydroFB}
      />

      {/* SECTION 4 — RECOVERY */}
      <RecoverySection
        recovery={recovery}
        setRecovery={setRecovery}
        status={recovStatus}
      />

      {/* SECTION 5 — INSIGHTS */}
      <InsightsSection insights={insights} />

      <p className="text-[11px] text-white/40 font-ui mt-10">
        All performance data is stored locally. Cloud sync will follow Supabase
        auth.
      </p>
    </div>
  );
}

// ─── 1. WEIGHT ──────────────────────────────────────────────────────
function WeightSection({ weights, setWeights, targets, refreshTargets }) {
  const [input, setInput] = useState("");
  const latest = latestWeight();
  const recent = recentWeights(7);
  const chartData = recent.map((e) => ({
    date: e.date.slice(5),
    weight: e.weight,
  }));

  const handleLog = () => {
    const n = Number(input);
    if (!n) {
      toast.error("Enter a weight first");
      return;
    }
    const next = logWeight(n);
    setWeights(next);
    toast.success(`Logged ${n} kg`);
    setInput("");
  };

  const delta =
    recent.length >= 2
      ? +(recent[recent.length - 1].weight - recent[0].weight).toFixed(1)
      : null;

  return (
    <section
      className="fr-card p-6 sm:p-8 mb-6 fr-fade-up"
      data-testid="perf-weight"
    >
      <SectionHeader
        icon={TrendingUp}
        eyebrow="Body Weight"
        title="Track the trend"
        meta={
          <TargetsButton targets={targets} onSave={refreshTargets} kind="weight" />
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest + delta + add */}
        <div className="lg:col-span-1 space-y-4">
          <div className="border border-white/10 rounded-sm p-5 bg-black/30">
            <div className="label-eyebrow text-white/40 mb-2">Current</div>
            <div className="flex items-end gap-2">
              <div className="font-display text-5xl leading-none text-white">
                {latest ? latest.weight : "—"}
              </div>
              <div className="label-eyebrow text-white/40 mb-1">kg</div>
            </div>
            {delta !== null && (
              <div
                className={`mt-3 flex items-center gap-1 text-xs font-ui ${
                  delta < 0 ? "text-[#007AFF]" : delta > 0 ? "text-[#FF3B30]" : "text-white/60"
                }`}
                data-testid="weight-delta"
              >
                {delta < 0 ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : delta > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : null}
                {delta > 0 ? "+" : ""}
                {delta} kg over last 7 days
              </div>
            )}
          </div>

          {(targets.targetWeight || targets.weightClass) && (
            <div className="border border-white/10 rounded-sm p-5 bg-black/30">
              <div className="label-eyebrow text-white/40 mb-2">Target</div>
              <div className="flex items-baseline gap-3">
                {targets.targetWeight && (
                  <div className="font-display text-2xl text-[#FF3B30] leading-none">
                    {targets.targetWeight} kg
                  </div>
                )}
                {targets.weightClass && (
                  <div className="text-xs text-white/60 font-ui">
                    {targets.weightClass}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              placeholder="Today's weight"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              data-testid="weight-input"
              className="h-11 rounded-sm bg-black border-white/15 text-white font-ui"
            />
            <Button
              onClick={handleLog}
              data-testid="weight-log"
              className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold h-11 px-5 fr-pressable shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" />
              Log
            </Button>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 border border-white/10 rounded-sm p-5 bg-black/30">
          <div className="label-eyebrow text-white/40 mb-4">7-Day Trend</div>
          {chartData.length < 2 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-white/40 font-ui">
              Log at least 2 days to see the trend.
            </div>
          ) : (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#A1A1AA"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  />
                  <YAxis
                    stroke="#A1A1AA"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    domain={["dataMin - 1", "dataMax + 1"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#141414",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "4px",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#FF3B30"
                    strokeWidth={2}
                    dot={{ fill: "#FF3B30", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── 2. MACROS ──────────────────────────────────────────────────────
function MacrosSection({
  macros,
  setMacros,
  targets,
  refreshTargets,
  feedback,
}) {
  const [draft, setDraft] = useState(macros);

  useEffect(() => {
    setDraft(macros);
  }, [macros]);

  const save = () => {
    const cleaned = {
      protein: Number(draft.protein) || 0,
      carbs: Number(draft.carbs) || 0,
      fats: Number(draft.fats) || 0,
      calories: Number(draft.calories) || 0,
    };
    updateMacros(cleaned);
    setMacros(cleaned);
    toast.success("Macros saved");
  };

  const fields = [
    { key: "protein", label: "Protein", unit: "g", color: "#FF3B30" },
    { key: "carbs", label: "Carbs", unit: "g", color: "#007AFF" },
    { key: "fats", label: "Fats", unit: "g", color: "#A1A1AA" },
    { key: "calories", label: "Calories", unit: "kcal", color: "#FFFFFF" },
  ];

  return (
    <section
      className="fr-card p-6 sm:p-8 mb-6 fr-fade-up"
      data-testid="perf-macros"
    >
      <SectionHeader
        icon={Apple}
        eyebrow="Macros"
        title="Fuel for the rolls"
        meta={
          <TargetsButton targets={targets} onSave={refreshTargets} kind="macros" />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {fields.map((f) => {
          const value = Number(draft[f.key]) || 0;
          const target = Number(targets[f.key]) || 0;
          const pct = target ? Math.min(100, (value / target) * 100) : 0;
          return (
            <div
              key={f.key}
              className="border border-white/10 rounded-sm p-4 bg-black/30"
              data-testid={`macro-${f.key}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="label-eyebrow text-white/40">{f.label}</span>
                <span className="text-[10px] text-white/40 font-ui">
                  Target {target}
                  {f.unit}
                </span>
              </div>
              <Input
                type="number"
                value={draft[f.key] || ""}
                onChange={(e) =>
                  setDraft({ ...draft, [f.key]: e.target.value })
                }
                onBlur={save}
                placeholder="0"
                data-testid={`macro-${f.key}-input`}
                className="h-10 rounded-sm bg-black border-white/15 text-white font-display text-xl text-center"
              />
              <div className="h-1.5 bg-white/5 rounded-sm overflow-hidden mt-3">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: f.color,
                    opacity: pct >= 95 ? 1 : 0.6,
                  }}
                />
              </div>
              <div className="text-[10px] text-white/40 font-ui mt-2 text-right">
                {Math.round(pct)}%
              </div>
            </div>
          );
        })}
      </div>

      <FeedbackRow items={feedback} testid="macro-feedback" />
    </section>
  );
}

// ─── 3. HYDRATION ──────────────────────────────────────────────────
function HydrationSection({ hydration, setHydration, targets, feedback }) {
  const adjust = (delta) => {
    const next = Math.max(0, (hydration.waterMl || 0) + delta);
    const patch = { waterMl: next };
    updateHydration(patch);
    setHydration({ ...hydration, ...patch });
  };

  const toggle = (key) => {
    const patch = { [key]: !hydration[key] };
    updateHydration(patch);
    setHydration({ ...hydration, ...patch });
  };

  const pct = Math.min(
    100,
    ((hydration.waterMl || 0) / (targets.waterMl || 3000)) * 100,
  );

  const quickAdds = [250, 500, 750];

  return (
    <section
      className="fr-card p-6 sm:p-8 mb-6 fr-fade-up"
      data-testid="perf-hydration"
    >
      <SectionHeader
        icon={Droplet}
        eyebrow="Hydration"
        title="Sip steady, sweat hard"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2 border border-white/10 rounded-sm p-5 bg-black/30">
          <div className="flex items-baseline justify-between mb-3">
            <div className="label-eyebrow text-white/40">Water</div>
            <div className="text-xs text-white/40 font-ui">
              Target {targets.waterMl} ml
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <div
              className="font-display text-5xl leading-none text-white"
              data-testid="water-current"
            >
              {hydration.waterMl || 0}
            </div>
            <div className="label-eyebrow text-white/40 mb-1">ml</div>
          </div>
          <div className="h-2 bg-white/5 rounded-sm overflow-hidden mb-4">
            <div
              className="h-full bg-[#007AFF] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {quickAdds.map((ml) => (
              <Button
                key={ml}
                onClick={() => adjust(ml)}
                variant="outline"
                data-testid={`water-add-${ml}`}
                className="rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui text-xs h-9"
              >
                + {ml} ml
              </Button>
            ))}
            <Button
              onClick={() => adjust(-250)}
              variant="outline"
              data-testid="water-undo"
              className="rounded-sm bg-transparent border-white/15 text-white/60 hover:bg-white/5 font-ui text-xs h-9"
            >
              − 250
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <CheckRow
            label="Electrolytes today"
            checked={hydration.electrolytes}
            onChange={() => toggle("electrolytes")}
            testid="hydration-electrolytes"
          />
          <CheckRow
            label="Sauna / heavy sweat"
            checked={hydration.sauna}
            onChange={() => toggle("sauna")}
            testid="hydration-sauna"
          />
        </div>
      </div>

      <FeedbackRow items={[feedback]} testid="hydration-feedback" />
    </section>
  );
}

// ─── 4. RECOVERY ───────────────────────────────────────────────────
function RecoverySection({ recovery, setRecovery, status }) {
  const update = (key, val) => {
    const patch = { [key]: val };
    updateRecovery(patch);
    setRecovery({ ...recovery, ...patch });
  };

  const statusTone =
    status.status === "High Recovery"
      ? "good"
      : status.status === "Low Recovery"
        ? "warn"
        : "muted";

  return (
    <section
      className="fr-card p-6 sm:p-8 mb-6 fr-fade-up"
      data-testid="perf-recovery"
    >
      <SectionHeader
        icon={Moon}
        eyebrow="Recovery"
        title="Daily check-in"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Sleep */}
        <div className="border border-white/10 rounded-sm p-5 bg-black/30">
          <div className="label-eyebrow text-white/40 mb-3">Sleep</div>
          <div className="flex items-baseline gap-2 mb-3">
            <Input
              type="number"
              step="0.5"
              value={recovery.sleep || ""}
              onChange={(e) => update("sleep", Number(e.target.value) || 0)}
              placeholder="0"
              data-testid="recovery-sleep"
              className="h-12 w-24 rounded-sm bg-black border-white/15 text-white font-display text-3xl text-center"
            />
            <span className="label-eyebrow text-white/40">hours</span>
          </div>
        </div>

        {/* Soreness */}
        <RatingRow
          label="Soreness"
          help="1 = fresh · 5 = wrecked"
          value={recovery.soreness}
          onChange={(v) => update("soreness", v)}
          activeColor="#FF3B30"
          testid="recovery-soreness"
        />

        {/* Energy */}
        <RatingRow
          label="Energy"
          help="1 = empty · 5 = peak"
          value={recovery.energy}
          onChange={(v) => update("energy", v)}
          activeColor="#007AFF"
          testid="recovery-energy"
        />
      </div>

      {/* Status */}
      <div
        className={`border rounded-sm p-5 flex items-start gap-4 ${
          statusTone === "good"
            ? "border-[#FF3B30]/40 bg-[#FF3B30]/5"
            : statusTone === "warn"
              ? "border-white/15 bg-white/5"
              : "border-white/10 bg-black/30"
        }`}
        data-testid="recovery-status"
      >
        <div
          className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${
            statusTone === "good"
              ? "bg-[#FF3B30] text-white"
              : statusTone === "warn"
                ? "bg-white/10 text-white/70"
                : "bg-white/5 text-white/60"
          }`}
        >
          {statusTone === "good" ? (
            <Flame className="w-5 h-5" fill="currentColor" />
          ) : statusTone === "warn" ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="label-eyebrow text-white/40 mb-1">
            Recovery Status
          </div>
          <div className="font-display text-2xl tracking-tight text-white leading-none mb-1">
            {status.status}
          </div>
          <p className="text-sm text-white/60 font-ui">{status.message}</p>
        </div>
        {status.score !== null && (
          <div className="text-right shrink-0">
            <div className="label-eyebrow text-white/40 mb-1">Score</div>
            <div className="font-display text-3xl text-white leading-none">
              {status.score}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 5. INSIGHTS ───────────────────────────────────────────────────
function InsightsSection({ insights }) {
  return (
    <section className="fr-card p-6 sm:p-8 fr-fade-up" data-testid="perf-insights">
      <SectionHeader
        icon={Lightbulb}
        eyebrow="Performance Insights"
        title="How inputs shape your roll"
      />

      {insights.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-sm p-8 text-center">
          <p className="text-sm text-white/50 font-ui">
            Log a few days of recovery, macros, and rounds to surface
            correlations between inputs and rolling performance.
          </p>
        </div>
      ) : (
        <ul className="space-y-3" data-testid="insights-list">
          {insights.map((i) => (
            <li
              key={i.id}
              data-testid={`insight-${i.id}`}
              className="border border-white/10 rounded-sm p-5 flex items-start gap-4"
              style={
                i.tone === "good"
                  ? { borderColor: "rgba(255,59,48,0.35)" }
                  : undefined
              }
            >
              <div
                className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${
                  i.tone === "good"
                    ? "bg-[#FF3B30] text-white"
                    : "bg-white/5 text-white/70"
                }`}
              >
                {i.tone === "good" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-ui text-white text-base leading-snug mb-1">
                  {i.headline}
                </div>
                <div className="text-xs text-white/55 font-ui leading-relaxed">
                  {i.detail}
                </div>
              </div>
              <span className="label-eyebrow text-white/40 hidden sm:inline">
                {i.kind}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ─── Shared ────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, eyebrow, title, meta }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-6 flex-wrap">
      <div>
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-2">
          <Icon className="w-3.5 h-3.5" />
          {eyebrow}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight uppercase text-white leading-none">
          {title}
        </h2>
      </div>
      {meta}
    </div>
  );
}

function FeedbackRow({ items, testid }) {
  return (
    <div className="flex flex-wrap gap-2" data-testid={testid}>
      {items.map((f, i) => (
        <span
          key={i}
          className={`px-3 h-8 inline-flex items-center rounded-sm border text-xs font-ui font-semibold tracking-wide ${
            f.tone === "good"
              ? "border-[#FF3B30]/40 bg-[#FF3B30]/10 text-[#FF3B30]"
              : f.tone === "warn"
                ? "border-white/20 bg-white/5 text-white"
                : "border-white/10 bg-black/30 text-white/50"
          }`}
        >
          {f.tone === "good" ? (
            <Check className="w-3 h-3 mr-1.5" />
          ) : f.tone === "warn" ? (
            <AlertCircle className="w-3 h-3 mr-1.5" />
          ) : null}
          {f.text}
        </span>
      ))}
    </div>
  );
}

function RatingRow({ label, help, value, onChange, activeColor, testid }) {
  return (
    <div
      className="border border-white/10 rounded-sm p-5 bg-black/30"
      data-testid={testid}
    >
      <div className="label-eyebrow text-white/40 mb-1">{label}</div>
      <div className="text-[10px] text-white/40 font-ui mb-3">{help}</div>
      <div className="flex gap-1">
        {ratingScale.map((n) => {
          const active = value >= n;
          return (
            <button
              key={n}
              onClick={() => onChange(n === value ? 0 : n)}
              data-testid={`${testid}-${n}`}
              className={`flex-1 h-10 rounded-sm border text-sm font-display tracking-wider transition-all fr-pressable ${
                active
                  ? "border-transparent text-white"
                  : "border-white/15 text-white/40 hover:bg-white/5"
              }`}
              style={active ? { background: activeColor } : {}}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CheckRow({ label, checked, onChange, testid }) {
  return (
    <button
      onClick={onChange}
      data-testid={testid}
      className={`w-full border rounded-sm p-4 flex items-center gap-3 text-left transition-all fr-pressable ${
        checked
          ? "border-[#FF3B30]/50 bg-[#FF3B30]/10"
          : "border-white/10 bg-black/30 hover:bg-white/5"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-sm flex items-center justify-center shrink-0 ${
          checked ? "bg-[#FF3B30] text-white" : "border border-white/20"
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5" />}
      </div>
      <span className="font-ui text-sm text-white">{label}</span>
    </button>
  );
}

// Edit-targets dialog
function TargetsButton({ targets, onSave, kind }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(targets);

  useEffect(() => {
    if (open) setDraft(targets);
  }, [open, targets]);

  const handleSave = () => {
    const cleaned = {
      targetWeight: draft.targetWeight ? Number(draft.targetWeight) : null,
      weightClass: draft.weightClass || "",
      protein: Number(draft.protein) || 0,
      carbs: Number(draft.carbs) || 0,
      fats: Number(draft.fats) || 0,
      calories: Number(draft.calories) || 0,
      waterMl: Number(draft.waterMl) || 0,
    };
    saveTargets(cleaned);
    onSave();
    toast.success("Targets updated");
    setOpen(false);
  };

  const weightFields = kind === "weight";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          data-testid={`targets-${kind}-button`}
          className="rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui text-xs h-9"
        >
          <Target className="w-3.5 h-3.5 mr-1.5" />
          Targets
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#141414] border-white/15 rounded-sm text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight uppercase">
            {weightFields ? "Weight Targets" : "Macro & Hydration Targets"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {weightFields ? (
            <>
              <FieldRow
                label="Target Weight (kg)"
                value={draft.targetWeight ?? ""}
                onChange={(v) => setDraft({ ...draft, targetWeight: v })}
                type="number"
                step="0.1"
                testid="target-weight-input"
              />
              <FieldRow
                label="Weight Class (optional)"
                value={draft.weightClass}
                onChange={(v) => setDraft({ ...draft, weightClass: v })}
                placeholder="Light Featherweight"
                testid="weight-class-input"
              />
            </>
          ) : (
            <>
              <FieldRow
                label="Protein (g)"
                value={draft.protein}
                onChange={(v) => setDraft({ ...draft, protein: v })}
                type="number"
                testid="target-protein-input"
              />
              <FieldRow
                label="Carbs (g)"
                value={draft.carbs}
                onChange={(v) => setDraft({ ...draft, carbs: v })}
                type="number"
                testid="target-carbs-input"
              />
              <FieldRow
                label="Fats (g)"
                value={draft.fats}
                onChange={(v) => setDraft({ ...draft, fats: v })}
                type="number"
                testid="target-fats-input"
              />
              <FieldRow
                label="Calories (kcal)"
                value={draft.calories}
                onChange={(v) => setDraft({ ...draft, calories: v })}
                type="number"
                testid="target-calories-input"
              />
              <FieldRow
                label="Water (ml)"
                value={draft.waterMl}
                onChange={(v) => setDraft({ ...draft, waterMl: v })}
                type="number"
                testid="target-water-input"
              />
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            data-testid="targets-save"
            className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold"
          >
            Save Targets
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FieldRow({ label, value, onChange, type = "text", testid, ...rest }) {
  return (
    <div>
      <Label className="label-eyebrow text-white/40 mb-2 block">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        data-testid={testid}
        className="h-10 rounded-sm bg-black border-white/15 text-white font-ui"
        {...rest}
      />
    </div>
  );
}
