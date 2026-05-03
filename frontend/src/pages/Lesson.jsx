import { Link, useParams, Navigate } from "react-router-dom";
import {
  ChevronLeft,
  ListChecks,
  Clock,
  AlertOctagon,
  Dumbbell,
  Zap,
  Flag,
  Play,
} from "lucide-react";
import { getPosition, getScenario, getScenarios } from "@/data/library";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Lesson() {
  const { positionId, scenarioId } = useParams();
  const position = getPosition(positionId);
  const scenario = getScenario(positionId, scenarioId);
  const siblings = getScenarios(positionId);

  if (!position || !scenario)
    return <Navigate to={`/library/${positionId || ""}`} replace />;

  const currentIndex = siblings.findIndex((s) => s.id === scenarioId);
  const prev = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < siblings.length - 1
      ? siblings[currentIndex + 1]
      : null;

  const { lesson } = scenario;

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid={`page-lesson-${positionId}-${scenarioId}`}
    >
      <Link
        to={`/library/${positionId}`}
        className="inline-flex items-center gap-1 text-white/50 hover:text-white text-sm font-ui mb-6 transition-colors"
        data-testid="back-to-position"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to {position.name}
      </Link>

      <div className="fr-fade-up mb-8">
        <div className="label-eyebrow text-[#FF3B30] mb-3">
          {position.name} · Scenario {String(currentIndex + 1).padStart(2, "0")}
        </div>
        <h1 className="font-display text-4xl sm:text-6xl tracking-tight leading-[0.95] uppercase text-white mb-3">
          {scenario.title}
        </h1>
        <p className="font-ui text-white/60 text-lg">{scenario.subtitle}</p>

        <div className="flex flex-wrap gap-2 mt-5">
          {scenario.tags.map((t) => (
            <Badge
              key={t}
              variant="outline"
              className="rounded-sm border-white/15 bg-white/5 text-white/80 font-ui text-[10px] tracking-widest uppercase font-semibold"
            >
              {t}
            </Badge>
          ))}
        </div>
      </div>

      {/* VIDEO */}
      <div
        className="fr-card overflow-hidden mb-10 fr-fade-up"
        style={{ animationDelay: "80ms" }}
        data-testid="lesson-video-wrapper"
      >
        <div className="relative aspect-video bg-black">
          <video
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            data-testid="lesson-video"
            poster="https://images.pexels.com/photos/15545735/pexels-photo-15545735.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          >
            <source src={lesson.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-white/10 rounded-sm px-3 py-1.5 pointer-events-none">
            <Play className="w-3.5 h-3.5 text-[#FF3B30]" fill="currentColor" />
            <span className="label-eyebrow text-white/90">Video Lesson</span>
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      <section
        className="fr-card p-6 sm:p-8 mb-6 fr-fade-up"
        style={{ animationDelay: "120ms" }}
        data-testid="lesson-overview"
      >
        <div className="label-eyebrow text-white/40 mb-3">Overview</div>
        <p className="text-white/80 leading-relaxed text-lg">
          {lesson.summary}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* KEY STEPS */}
        <section
          className="fr-card p-6 sm:p-8 fr-fade-up"
          style={{ animationDelay: "160ms" }}
          data-testid="lesson-key-steps"
        >
          <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-5">
            <ListChecks className="w-3.5 h-3.5" />
            Key Steps
          </div>
          <ol className="space-y-4">
            {lesson.keySteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-display text-2xl text-[#FF3B30] leading-none w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-white/85 text-sm leading-relaxed pt-1">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* WHEN TO USE */}
        <section
          className="fr-card p-6 sm:p-8 fr-fade-up"
          style={{ animationDelay: "200ms" }}
          data-testid="lesson-when-to-use"
        >
          <div className="flex items-center gap-2 label-eyebrow text-[#007AFF] mb-5">
            <Clock className="w-3.5 h-3.5" />
            When to Use
          </div>
          <p className="text-white/85 leading-relaxed">{lesson.whenToUse}</p>

          <div className="fr-hairline my-6" />

          <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-4">
            <AlertOctagon className="w-3.5 h-3.5" />
            Common Mistakes
          </div>
          <ul className="space-y-3">
            {lesson.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/75">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] mt-[9px] shrink-0" />
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* DRILLS */}
      <section
        className="fr-card p-6 sm:p-8 mb-10 fr-fade-up"
        style={{ animationDelay: "240ms" }}
        data-testid="lesson-drills"
      >
        <div className="flex items-center gap-2 label-eyebrow text-white/40 mb-6">
          <Dumbbell className="w-3.5 h-3.5" />
          Drill Progression
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DrillBlock
            icon={Dumbbell}
            color="#A1A1AA"
            label="Static Reps"
            text={lesson.drills.static}
            testid="drill-static"
          />
          <DrillBlock
            icon={Zap}
            color="#007AFF"
            label="Progressive Resistance"
            text={lesson.drills.progressive}
            testid="drill-progressive"
          />
          <DrillBlock
            icon={Flag}
            color="#FF3B30"
            label="Live Goal"
            text={lesson.drills.live}
            testid="drill-live"
          />
        </div>
      </section>

      {/* NAV */}
      <div className="flex items-center justify-between gap-3">
        {prev ? (
          <Link
            to={`/lesson/${positionId}/${prev.id}`}
            className="fr-card fr-pressable p-4 flex-1 group min-w-0"
            data-testid="lesson-prev"
          >
            <div className="label-eyebrow text-white/40 mb-1">Previous</div>
            <div className="font-ui text-white group-hover:text-[#FF3B30] transition-colors truncate">
              {prev.title}
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        <Link to="/logger" data-testid="lesson-log-round">
          <Button className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold tracking-wide h-12 px-6 fr-pressable shrink-0">
            Log a Round
          </Button>
        </Link>

        {next ? (
          <Link
            to={`/lesson/${positionId}/${next.id}`}
            className="fr-card fr-pressable p-4 flex-1 group text-right min-w-0"
            data-testid="lesson-next"
          >
            <div className="label-eyebrow text-white/40 mb-1">Next</div>
            <div className="font-ui text-white group-hover:text-[#FF3B30] transition-colors truncate">
              {next.title}
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}

function DrillBlock({ icon: Icon, color, label, text, testid }) {
  return (
    <div
      className="border border-white/10 rounded-sm p-5 bg-black/30"
      data-testid={testid}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-sm flex items-center justify-center"
          style={{ background: `${color}20`, color }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="label-eyebrow" style={{ color }}>
          {label}
        </span>
      </div>
      <p className="text-sm text-white/75 leading-relaxed">{text}</p>
    </div>
  );
}
