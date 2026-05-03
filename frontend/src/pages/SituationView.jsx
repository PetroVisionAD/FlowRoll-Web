import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { getPosition, getScenarios } from "@/data/library";
import { Badge } from "@/components/ui/badge";

export default function SituationView() {
  const { positionId } = useParams();
  const position = getPosition(positionId);
  const scenarios = getScenarios(positionId);

  if (!position) return <Navigate to="/library" replace />;

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid={`page-situation-${positionId}`}
    >
      <Link
        to="/library"
        className="inline-flex items-center gap-1 text-white/50 hover:text-white text-sm font-ui mb-6 transition-colors"
        data-testid="back-to-library"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Library
      </Link>

      <div className="fr-fade-up mb-10">
        <div className="label-eyebrow text-[#FF3B30] mb-3">
          {position.category} · {position.difficulty}
        </div>
        <h1 className="font-display text-5xl sm:text-7xl tracking-tight leading-none uppercase text-white mb-3">
          {position.name}
        </h1>
        <p className="font-ui italic text-white/50 text-lg mb-4">
          "{position.tagline}"
        </p>
        <p className="max-w-2xl text-base text-white/70 leading-relaxed">
          {position.description}
        </p>
      </div>

      <div className="fr-hairline mb-8" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight uppercase text-white">
          Scenarios ({scenarios.length})
        </h2>
        <div className="label-eyebrow text-white/40">Focus · {position.focus}</div>
      </div>

      <div className="space-y-4" data-testid="scenario-list">
        {scenarios.map((s, i) => (
          <Link
            key={s.id}
            to={`/lesson/${positionId}/${s.id}`}
            data-testid={`scenario-${s.id}`}
            className="fr-card fr-pressable group block p-6 sm:p-7 fr-fade-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="font-display text-3xl text-[#FF3B30] leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="fr-hairline flex-1 !w-auto" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl tracking-tight text-white mb-2 group-hover:text-[#FF3B30] transition-colors">
                  {s.title}
                </h3>
                <p className="font-ui text-white/60 text-sm mb-4">
                  {s.subtitle}
                </p>

                <div className="flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="rounded-sm border-white/15 bg-white/5 text-white/70 font-ui text-[10px] tracking-widest uppercase font-semibold"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="label-eyebrow text-white/30">Lesson</div>
                <div className="w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center group-hover:border-[#FF3B30]/60 group-hover:bg-[#FF3B30] group-hover:text-white text-white/60 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
