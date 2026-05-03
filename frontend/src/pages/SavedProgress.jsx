import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookOpen, Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { loadAllProgress } from "@/lib/lessonProgress";
import { POSITIONS, getPosition, getScenario } from "@/data/library";

export default function SavedProgress() {
  const [progress, setProgress] = useState([]);
  useEffect(() => {
    setProgress(loadAllProgress());
  }, []);

  const decorated = useMemo(
    () =>
      progress
        .map((p) => ({
          ...p,
          position: getPosition(p.positionId),
          scenario: getScenario(p.positionId, p.scenarioId),
        }))
        .filter((p) => p.position && p.scenario)
        .sort(
          (a, b) =>
            new Date(b.savedAt || b.learnedAt || 0) -
            new Date(a.savedAt || a.learnedAt || 0),
        ),
    [progress],
  );

  const learned = decorated.filter((p) => p.learned);
  const saved = decorated.filter((p) => p.saved);

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-saved"
    >
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <Bookmark className="w-3.5 h-3.5" />
          Saved Lesson Progress
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-3">
          Your Playbook.
        </h1>
        <p className="max-w-xl text-base text-white/60 leading-relaxed">
          Lessons you've marked as learned or bookmarked for later.
        </p>
      </div>

      <div className="fr-hairline mb-6" />

      <Tabs defaultValue="learned" className="w-full" data-testid="saved-tabs">
        <TabsList className="bg-black border border-white/10 rounded-sm p-1 h-11 mb-6">
          <TabsTrigger
            value="learned"
            data-testid="tab-learned"
            className="data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white rounded-sm font-ui font-semibold px-5 text-white/60 text-xs tracking-wide uppercase"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Learned · {learned.length}
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            data-testid="tab-saved"
            className="data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white rounded-sm font-ui font-semibold px-5 text-white/60 text-xs tracking-wide uppercase"
          >
            <Bookmark className="w-3.5 h-3.5 mr-1.5" />
            Saved · {saved.length}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learned">
          <ProgressGrid
            items={learned}
            empty="No lessons marked as learned yet."
            testid="learned-grid"
          />
        </TabsContent>
        <TabsContent value="saved">
          <ProgressGrid
            items={saved}
            empty="No saved lessons yet. Bookmark lessons from the Library."
            testid="saved-grid"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProgressGrid({ items, empty, testid }) {
  if (!items.length) {
    return (
      <div
        className="fr-card p-10 text-center"
        data-testid={`${testid}-empty`}
      >
        <div className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Filter className="w-5 h-5 text-white/50" />
        </div>
        <p className="text-sm text-white/60 mb-5">{empty}</p>
        <Link to="/library" data-testid="saved-empty-cta">
          <Button
            variant="outline"
            className="rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Library
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      data-testid={testid}
    >
      {items.map((p) => (
        <Link
          key={`${p.positionId}:${p.scenarioId}`}
          to={`/lesson/${p.positionId}/${p.scenarioId}`}
          data-testid={`saved-item-${p.positionId}-${p.scenarioId}`}
          className="fr-card fr-pressable group p-5 block"
        >
          <div className="label-eyebrow text-white/40 mb-3">
            {p.position.name}
          </div>
          <h3 className="font-display text-xl tracking-tight leading-tight text-white group-hover:text-[#FF3B30] transition-colors mb-2">
            {p.scenario.title}
          </h3>
          <p className="text-xs text-white/50 leading-relaxed">
            {p.scenario.subtitle}
          </p>
          <div className="flex items-center gap-2 mt-4">
            {p.learned && (
              <span className="label-eyebrow text-[#FF3B30] flex items-center gap-1">
                <Check className="w-3 h-3" />
                Learned
              </span>
            )}
            {p.saved && (
              <span className="label-eyebrow text-[#007AFF] flex items-center gap-1">
                <Bookmark className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
