import { useState } from "react";
import { MessageSquare, Pin, Lock, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Mock threads — training-focused only. Not a generic social feed.
const MOCK_THREADS = [
  {
    id: 1,
    title: "What's your go-to escape from deep side control?",
    author: "RafaelQ",
    belt: "Purple",
    category: "Side Control",
    replies: 24,
    lastActivity: "2h ago",
    pinned: true,
  },
  {
    id: 2,
    title: "Over-under pass vs knee-shield half guard",
    author: "MarcosDev",
    belt: "Brown",
    category: "Half Guard",
    replies: 18,
    lastActivity: "5h ago",
  },
  {
    id: 3,
    title: "Drill breakdown: breaking posture in closed guard",
    author: "KaiS",
    belt: "Blue",
    category: "Closed Guard",
    replies: 11,
    lastActivity: "1d ago",
  },
  {
    id: 4,
    title: "Seatbelt slipping when opponent turns belly down",
    author: "NandoT",
    belt: "Black",
    category: "Back Control",
    replies: 32,
    lastActivity: "1d ago",
  },
  {
    id: 5,
    title: "Weekly drilling partners — Bay Area",
    author: "JennaM",
    belt: "Blue",
    category: "Meetup",
    replies: 6,
    lastActivity: "2d ago",
  },
  {
    id: 6,
    title: "Breaking down the Ezekiel from mount — timing cues",
    author: "Priscila",
    belt: "Purple",
    category: "Mount",
    replies: 9,
    lastActivity: "3d ago",
  },
];

const CATEGORIES = [
  "All",
  "Closed Guard",
  "Open Guard",
  "Half Guard",
  "Mount",
  "Side Control",
  "Back Control",
  "Meetup",
];

const beltColor = (b) =>
  ({
    White: "#FFFFFF",
    Blue: "#007AFF",
    Purple: "#8B5CF6",
    Brown: "#92400E",
    Black: "#262626",
  })[b] || "#A1A1AA";

export default function Community() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const threads = MOCK_THREADS.filter(
    (t) =>
      (filter === "All" || t.category === filter) &&
      (!query || t.title.toLowerCase().includes(query.toLowerCase())),
  );

  const handleNewThread = () => {
    if (!user) {
      toast.error("Sign in to start a discussion");
      return;
    }
    toast("New threads will be available once the community backend ships.");
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-community"
    >
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          Training Discussions
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-3">
          Talk Technique.
        </h1>
        <p className="max-w-2xl text-base text-white/60 leading-relaxed">
          Scenario-based threads from practitioners. No off-topic feeds — just
          positions, passes, escapes, and drills.
        </p>
      </div>

      <div className="fr-hairline mb-8" />

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search discussions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="community-search"
            className="h-11 pl-9 rounded-sm bg-black border-white/15 text-white font-ui"
          />
        </div>
        <Button
          onClick={handleNewThread}
          data-testid="community-new-thread"
          className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold h-11 px-5 fr-pressable"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Start Thread
        </Button>
      </div>

      <div
        className="flex gap-2 mb-6 overflow-x-auto pb-2"
        data-testid="community-filters"
      >
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            data-testid={`filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
            className={`shrink-0 px-4 h-9 rounded-sm border text-xs font-ui font-semibold tracking-wide uppercase transition-all ${
              filter === c
                ? "bg-[#FF3B30] border-[#FF3B30] text-white"
                : "bg-transparent border-white/15 text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ol className="space-y-3" data-testid="community-threads">
        {threads.map((t) => (
          <li
            key={t.id}
            data-testid={`thread-${t.id}`}
            className="fr-card fr-pressable p-5 flex items-start gap-4 group"
          >
            <div className="shrink-0 hidden sm:flex w-10 h-10 rounded-sm bg-white/5 border border-white/10 items-center justify-center">
              {t.pinned ? (
                <Pin className="w-4 h-4 text-[#FF3B30]" />
              ) : (
                <MessageSquare className="w-4 h-4 text-white/50" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="rounded-sm border-white/15 bg-white/5 text-white/70 font-ui text-[10px] tracking-widest uppercase font-semibold"
                >
                  {t.category}
                </Badge>
                {t.pinned && (
                  <span className="label-eyebrow text-[#FF3B30] text-[9px]">
                    Pinned
                  </span>
                )}
              </div>
              <h3 className="font-ui font-semibold text-white text-base sm:text-lg group-hover:text-[#FF3B30] transition-colors leading-snug mb-2">
                {t.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-white/50 font-ui flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-sm"
                    style={{ background: beltColor(t.belt) }}
                  />
                  {t.author}
                </span>
                <span className="text-white/20">·</span>
                <span>{t.replies} replies</span>
                <span className="text-white/20">·</span>
                <span>{t.lastActivity}</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 shrink-0 group-hover:text-[#FF3B30] group-hover:translate-x-1 transition-all mt-1" />
          </li>
        ))}
      </ol>

      {!user && (
        <div
          className="fr-card p-5 mt-6 flex items-center gap-3"
          data-testid="community-signin-nudge"
        >
          <Lock className="w-4 h-4 text-white/40 shrink-0" />
          <p className="text-sm text-white/60 font-ui flex-1">
            Sign in to post replies and start new threads.
          </p>
        </div>
      )}

      <p className="text-[11px] text-white/40 font-ui mt-8">
        Community is a read-only preview. Full discussion backend (Supabase +
        realtime) is planned.
      </p>
    </div>
  );
}
