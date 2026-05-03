import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Plus,
  Trash2,
  Flag,
  X,
  Check,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  BELTS,
  STARTING_POSITIONS,
  RESULTS,
  SUBMISSIONS,
} from "@/data/library";
import {
  loadRounds,
  addRound,
  saveRounds,
  addSession,
  computeSessionFeedback,
  computeStats,
  recordWeaknessSnapshot,
} from "@/lib/storage";
import { toast } from "sonner";

const emptyForm = {
  opponentBelt: "",
  startingPosition: "",
  result: "",
  submission: "None",
};

export default function Logger() {
  const [rounds, setRounds] = useState([]);
  const [sessionRounds, setSessionRounds] = useState([]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setRounds(loadRounds());
  }, []);

  const canSubmit = useMemo(
    () => form.opponentBelt && form.startingPosition && form.result,
    [form],
  );

  const handleAdd = () => {
    if (!canSubmit) {
      toast.error("Fill out belt, position, and result first.");
      return;
    }
    const submission =
      form.result === "Win" && form.submission !== "None"
        ? form.submission
        : form.result === "Loss" && form.submission !== "None"
        ? form.submission
        : "None";

    const next = addRound({ ...form, submission });
    setRounds(next);
    const newest = next[next.length - 1];
    setSessionRounds((s) => [...s, newest]);
    toast.success(`Round logged — ${form.result}`);
    setForm({
      ...emptyForm,
      opponentBelt: form.opponentBelt,
      startingPosition: form.startingPosition,
    });
  };

  const handleFinishSession = () => {
    if (!sessionRounds.length) {
      toast.error("Add at least one round before finishing.");
      return;
    }
    const wins = sessionRounds.filter((r) => r.result === "Win").length;
    const losses = sessionRounds.filter((r) => r.result === "Loss").length;

    // Compute prior rounds = all rounds minus this session
    const sessionIds = new Set(sessionRounds.map((r) => r.id));
    const priorRounds = rounds.filter((r) => !sessionIds.has(r.id));

    // 1. Session-level improvement feedback
    const feedbacks = computeSessionFeedback(sessionRounds, priorRounds);
    feedbacks.forEach((f) => {
      toast.success(f.message, {
        description: "Session improvement detected.",
      });
    });

    // 2. Record new weakness snapshot from updated stats
    const updatedStats = computeStats(rounds);
    recordWeaknessSnapshot(updatedStats.weakest);

    addSession({
      roundCount: sessionRounds.length,
      wins,
      losses,
      feedbacks: feedbacks.map((f) => f.message),
    });

    if (!feedbacks.length) {
      toast.success(`Session finished — ${sessionRounds.length} rounds logged.`);
    }
    setSessionRounds([]);
  };

  const handleDelete = (id) => {
    const next = rounds.filter((r) => r.id !== id);
    setRounds(next);
    saveRounds(next);
    setSessionRounds((s) => s.filter((r) => r.id !== id));
    toast("Round removed");
  };

  const handleClearSession = () => {
    setSessionRounds([]);
    toast("Session cleared");
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-logger"
    >
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <ClipboardList className="w-3.5 h-3.5" />
          Round Logger
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-3">
          Log Every Roll.
        </h1>
        <p className="max-w-xl text-base text-white/60 leading-relaxed">
          Capture every round so the system can find your patterns. Belt,
          position, result. Submission optional.
        </p>
      </div>

      <div className="fr-hairline mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* FORM */}
        <section
          className="fr-card p-6 sm:p-8 lg:col-span-2 fr-fade-up"
          data-testid="logger-form"
        >
          <div className="label-eyebrow text-white/40 mb-6">New Round</div>

          <div className="space-y-5">
            <FieldSelect
              id="opponentBelt"
              label="Opponent Belt"
              value={form.opponentBelt}
              onChange={(v) => setForm({ ...form, opponentBelt: v })}
              options={BELTS.map((b) => ({ value: b, label: b }))}
              placeholder="Select belt"
            />

            <FieldSelect
              id="startingPosition"
              label="Starting Position"
              value={form.startingPosition}
              onChange={(v) => setForm({ ...form, startingPosition: v })}
              options={STARTING_POSITIONS.map((p) => ({
                value: p.name,
                label: p.name,
              }))}
              placeholder="Select position"
            />

            <div>
              <Label className="label-eyebrow text-white/40 mb-2 block">
                Result
              </Label>
              <div
                className="grid grid-cols-3 gap-2"
                data-testid="result-toggle"
              >
                {RESULTS.map((r) => {
                  const active = form.result === r;
                  const color =
                    r === "Win"
                      ? "#FF3B30"
                      : r === "Loss"
                      ? "#007AFF"
                      : "#A1A1AA";
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, result: r })}
                      data-testid={`result-option-${r.toLowerCase()}`}
                      className={`h-11 rounded-sm border font-ui font-semibold text-sm tracking-wide transition-all fr-pressable ${
                        active
                          ? "border-transparent text-white"
                          : "border-white/15 text-white/70 hover:bg-white/5"
                      }`}
                      style={active ? { background: color } : {}}
                    >
                      {r === "Win" && <Trophy className="w-3.5 h-3.5 inline mr-1" />}
                      {r === "Loss" && <Flag className="w-3.5 h-3.5 inline mr-1" />}
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            <FieldSelect
              id="submission"
              label="Submission (optional)"
              value={form.submission}
              onChange={(v) => setForm({ ...form, submission: v })}
              options={SUBMISSIONS.map((s) => ({ value: s, label: s }))}
              placeholder="Select submission"
            />

            <Button
              onClick={handleAdd}
              disabled={!canSubmit}
              data-testid="btn-add-round"
              className="w-full h-12 rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold tracking-wide fr-pressable disabled:opacity-40"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Round
            </Button>
          </div>
        </section>

        {/* SESSION */}
        <section className="lg:col-span-3 space-y-6">
          <div
            className="fr-card p-6 sm:p-8 fr-fade-up"
            data-testid="session-panel"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="label-eyebrow text-[#007AFF] mb-1">
                  Current Session
                </div>
                <div className="font-display text-3xl text-white leading-none">
                  {String(sessionRounds.length).padStart(2, "0")} Rounds
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClearSession}
                  disabled={!sessionRounds.length}
                  data-testid="btn-clear-session"
                  className="rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
                <Button
                  onClick={handleFinishSession}
                  disabled={!sessionRounds.length}
                  data-testid="btn-finish-session"
                  className="rounded-sm bg-white text-black hover:bg-white/90 font-ui font-semibold"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Finish Session
                </Button>
              </div>
            </div>

            {sessionRounds.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-sm p-8 text-center">
                <div className="label-eyebrow text-white/30 mb-2">No rounds yet</div>
                <div className="text-sm text-white/50">
                  Add your first round on the left.
                </div>
              </div>
            ) : (
              <ul className="space-y-2" data-testid="session-rounds">
                {sessionRounds.map((r, i) => (
                  <RoundRow
                    key={r.id}
                    round={r}
                    index={i}
                    onDelete={() => handleDelete(r.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* ALL ROUNDS HISTORY */}
          <div
            className="fr-card p-6 sm:p-8"
            data-testid="history-panel"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="label-eyebrow text-white/40 mb-1">All Time</div>
                <div className="font-display text-2xl text-white leading-none">
                  {String(rounds.length).padStart(2, "0")} Rounds
                </div>
              </div>
              <Link to="/progress" data-testid="logger-view-progress">
                <Button
                  variant="outline"
                  className="rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui"
                >
                  View Progress
                </Button>
              </Link>
            </div>
            {rounds.length === 0 ? (
              <div className="text-sm text-white/50">
                Logged rounds will appear here.
              </div>
            ) : (
              <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {[...rounds]
                  .slice()
                  .reverse()
                  .map((r, i) => (
                    <RoundRow
                      key={r.id}
                      round={r}
                      index={rounds.length - i - 1}
                      onDelete={() => handleDelete(r.id)}
                      compact
                    />
                  ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function FieldSelect({ id, label, value, onChange, options, placeholder }) {
  return (
    <div>
      <Label htmlFor={id} className="label-eyebrow text-white/40 mb-2 block">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          data-testid={`select-${id}`}
          className="h-11 rounded-sm bg-black border-white/15 text-white font-ui focus:ring-[#FF3B30]/40 focus:ring-2"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-[#141414] border-white/15 rounded-sm text-white">
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              data-testid={`option-${id}-${o.value.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-ui focus:bg-white/10 focus:text-white"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function RoundRow({ round, index, onDelete, compact = false }) {
  const resultColor =
    round.result === "Win"
      ? "#FF3B30"
      : round.result === "Loss"
      ? "#007AFF"
      : "#A1A1AA";
  return (
    <li
      className="group flex items-center gap-3 border border-white/10 rounded-sm p-3 bg-black/30 hover:bg-black/50 transition-colors"
      data-testid={`round-row-${round.id}`}
    >
      <div className="font-display text-xl text-white/40 w-8 text-center leading-none">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        className="w-1 self-stretch rounded-sm"
        style={{ background: resultColor }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 font-ui text-white text-sm truncate">
          <span className="font-semibold">{round.startingPosition}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/70">vs {round.opponentBelt} belt</span>
        </div>
        {!compact && round.submission && round.submission !== "None" && (
          <div className="text-xs text-white/50 mt-0.5 truncate">
            {round.result === "Win" ? "Finish:" : "Tapped to:"} {round.submission}
          </div>
        )}
      </div>
      <span
        className="label-eyebrow shrink-0"
        style={{ color: resultColor }}
      >
        {round.result}
      </span>
      <button
        onClick={onDelete}
        data-testid={`btn-delete-${round.id}`}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-[#FF3B30] p-1"
        aria-label="Delete round"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}
