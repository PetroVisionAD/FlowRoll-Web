import { POSITIONS } from "@/data/library";
import PositionCard from "@/components/PositionCard";
import { BookOpen } from "lucide-react";

export default function Library() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-library"
    >
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          Training Library
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-4">
          Every Position.
          <br />
          <span className="text-white/40">Every Situation.</span>
        </h1>
        <p className="max-w-2xl text-base text-white/60 leading-relaxed">
          Select a position to explore the real scenarios that happen inside it —
          with video, drills and structured progressions.
        </p>
      </div>

      <div className="fr-hairline mb-8" />

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        data-testid="library-grid"
      >
        {POSITIONS.map((p, i) => (
          <PositionCard key={p.id} position={p} index={i} />
        ))}
      </div>
    </div>
  );
}
