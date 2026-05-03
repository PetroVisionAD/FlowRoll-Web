import { Video, Clock, Star, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MOCK_COACHES = [
  {
    id: "c1",
    name: "Renata Costa",
    belt: "Black",
    stripes: 3,
    titles: ["IBJJF World Silver", "ADCC Trials"],
    specialty: "Closed Guard · Triangles",
    rate: 85,
    timezone: "America/Sao_Paulo",
    availability: "Tue/Thu · 18:00–21:00 BRT",
    rating: 4.9,
    sessions: 312,
  },
  {
    id: "c2",
    name: "Daniel Wu",
    belt: "Brown",
    stripes: 2,
    titles: ["Pan-Ams Bronze", "10 yrs teaching"],
    specialty: "Half Guard · Underhook systems",
    rate: 55,
    timezone: "America/Los_Angeles",
    availability: "Mon–Fri · 07:00–09:00 PT",
    rating: 4.8,
    sessions: 198,
  },
  {
    id: "c3",
    name: "Yuki Tanaka",
    belt: "Black",
    stripes: 1,
    titles: ["No-Gi specialist", "ADCC Asia"],
    specialty: "Back Control · Body-lock passing",
    rate: 70,
    timezone: "Asia/Tokyo",
    availability: "Weekends · JST evenings",
    rating: 5.0,
    sessions: 86,
  },
  {
    id: "c4",
    name: "Marco Oliveira",
    belt: "Black",
    stripes: 4,
    titles: ["Masters World Champion", "Head instructor"],
    specialty: "Side Control · Crossface mechanics",
    rate: 95,
    timezone: "Europe/Lisbon",
    availability: "Wed/Sun · 19:00–22:00 WET",
    rating: 4.9,
    sessions: 520,
  },
];

const beltHex = (b) =>
  ({
    White: "#FFFFFF",
    Blue: "#007AFF",
    Purple: "#8B5CF6",
    Brown: "#92400E",
    Black: "#111",
  })[b] || "#A1A1AA";

// Mock Google Meet link generator. In production this will be created via
// Google Calendar API when a real booking is confirmed.
const mockMeetLink = () => {
  const seg = () =>
    Math.random().toString(36).slice(2, 6);
  return `https://meet.google.com/${seg()}-${seg()}-${seg()}`;
};

export default function Coaching() {
  const handleBook = (coach) => {
    const link = mockMeetLink();
    toast.success(`Mock booking created with ${coach.name}`, {
      description: `Google Meet: ${link}`,
    });
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-coaching"
    >
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <Video className="w-3.5 h-3.5" />
          Private Coaching
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-3">
          1-on-1 Over Video.
        </h1>
        <p className="max-w-2xl text-base text-white/60 leading-relaxed">
          Book targeted sessions with verified instructors. Sessions happen over
          Google Meet — bring a camera, a partner if you have one, and a
          question.
        </p>
      </div>

      <div className="fr-hairline mb-8" />

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        data-testid="coach-grid"
      >
        {MOCK_COACHES.map((c) => (
          <article
            key={c.id}
            data-testid={`coach-${c.id}`}
            className="fr-card p-6"
          >
            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center font-display text-xl text-white shrink-0 border border-white/20"
                style={{ background: beltHex(c.belt) }}
              >
                {c.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-display text-2xl tracking-tight text-white leading-none">
                    {c.name}
                  </h3>
                  <ShieldCheck
                    className="w-4 h-4 text-[#007AFF]"
                    aria-label="Verified"
                  />
                </div>
                <div className="text-xs text-white/60 font-ui">
                  {c.belt} Belt · {c.stripes} stripes
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-2xl text-white leading-none">
                  ${c.rate}
                </div>
                <div className="label-eyebrow text-white/40 mt-1">per hour</div>
              </div>
            </div>

            <p className="font-ui text-white/80 mb-4">{c.specialty}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {c.titles.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="rounded-sm border-white/15 bg-white/5 text-white/70 font-ui text-[10px] tracking-widest uppercase font-semibold"
                >
                  {t}
                </Badge>
              ))}
            </div>

            <div className="fr-hairline my-4" />

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs text-white/60 font-ui">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/40" />
                {c.availability}
              </div>
              <div className="flex items-center gap-2">
                <Star
                  className="w-3.5 h-3.5 text-[#FF3B30]"
                  fill="currentColor"
                />
                {c.rating} · {c.sessions} sessions
              </div>
            </div>

            <Button
              onClick={() => handleBook(c)}
              data-testid={`book-${c.id}`}
              className="w-full h-11 rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold fr-pressable"
            >
              <Video className="w-4 h-4 mr-2" />
              Book via Google Meet
              <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
            </Button>
          </article>
        ))}
      </div>

      <p className="text-[11px] text-white/40 font-ui mt-8">
        Bookings are mocked. Real scheduling via Google Calendar + Meet link
        generation is planned.
      </p>
    </div>
  );
}
