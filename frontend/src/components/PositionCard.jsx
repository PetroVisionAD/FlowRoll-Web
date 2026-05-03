import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getScenarios } from "@/data/library";

export default function PositionCard({ position, index = 0 }) {
  const scenarioCount = getScenarios(position.id).length;
  return (
    <Link
      to={`/library/${position.id}`}
      data-testid={`position-card-${position.id}`}
      className="fr-card fr-pressable group block p-6 sm:p-7 fr-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between mb-6">
        <span className="label-eyebrow text-white/40">
          {position.category} · {position.difficulty}
        </span>
        <div className="w-8 h-8 rounded-sm border border-white/10 flex items-center justify-center group-hover:border-[#FF3B30]/60 group-hover:text-[#FF3B30] text-white/40 transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <h3 className="font-display text-3xl sm:text-4xl tracking-tight leading-none text-white mb-2">
        {position.name}
      </h3>
      <p className="font-ui text-sm text-white/50 italic mb-5">
        "{position.tagline}"
      </p>

      <p className="text-sm text-white/70 leading-relaxed mb-6">
        {position.description}
      </p>

      <div className="fr-hairline mb-5" />

      <div className="flex items-center justify-between">
        <div>
          <div className="label-eyebrow text-white/40 mb-1">Focus</div>
          <div className="font-ui text-sm text-white/80">{position.focus}</div>
        </div>
        <div className="text-right">
          <div className="label-eyebrow text-white/40 mb-1">Scenarios</div>
          <div className="font-display text-2xl text-[#FF3B30] leading-none">
            {String(scenarioCount).padStart(2, "0")}
          </div>
        </div>
      </div>
    </Link>
  );
}
