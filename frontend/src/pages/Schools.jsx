import { useState } from "react";
import { MapPin, Navigation, ExternalLink, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MOCK_SCHOOLS = [
  {
    id: "s1",
    name: "Gracie Barra — Downtown",
    affiliation: "Gracie Barra",
    address: "142 Market St, San Francisco, CA",
    distanceMi: 1.2,
    schedule: "Mon–Sat · Morning + Evening classes",
    beltsWelcome: "All levels",
    tags: ["Gi", "No-Gi", "Kids"],
  },
  {
    id: "s2",
    name: "10th Planet SOMA",
    affiliation: "10th Planet",
    address: "201 Folsom St, San Francisco, CA",
    distanceMi: 1.8,
    schedule: "Daily No-Gi · Open mat Sundays",
    beltsWelcome: "No-gi rank",
    tags: ["No-Gi", "Rubber Guard", "Advanced"],
  },
  {
    id: "s3",
    name: "Atos HQ — Bay Area",
    affiliation: "Atos",
    address: "800 2nd Ave, San Mateo, CA",
    distanceMi: 14.5,
    schedule: "Competitor track · Tue/Thu/Sat",
    beltsWelcome: "Blue+",
    tags: ["Gi", "Competition", "Drilling"],
  },
  {
    id: "s4",
    name: "Ralph Gracie — Berkeley",
    affiliation: "Ralph Gracie",
    address: "2080 University Ave, Berkeley, CA",
    distanceMi: 12.1,
    schedule: "Mon–Fri · Fundamentals & Live",
    beltsWelcome: "All levels",
    tags: ["Gi", "Fundamentals"],
  },
  {
    id: "s5",
    name: "AOJ Oakland",
    affiliation: "Art of Jiu-Jitsu",
    address: "360 17th St, Oakland, CA",
    distanceMi: 10.3,
    schedule: "Daily AM/PM · Kids 4–14",
    beltsWelcome: "All levels",
    tags: ["Gi", "Kids", "Competition"],
  },
];

export default function Schools() {
  const [zip, setZip] = useState("");

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported in this browser");
      return;
    }
    toast.info("Detecting your location…");
    navigator.geolocation.getCurrentPosition(
      () =>
        toast.success(
          "Location captured. Real results will appear once the gym database is live.",
        ),
      () => toast.error("Could not access location — allow permission and retry."),
    );
  };

  const filtered = zip
    ? MOCK_SCHOOLS.filter((s) => s.address.includes(zip))
    : MOCK_SCHOOLS;

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-schools"
    >
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <MapPin className="w-3.5 h-3.5" />
          Find a School
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-3">
          Roll Near You.
        </h1>
        <p className="max-w-2xl text-base text-white/60 leading-relaxed">
          Find verified jiu-jitsu academies near you — affiliation, schedule,
          and what levels train there.
        </p>
      </div>

      <div className="fr-hairline mb-6" />

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <Input
          placeholder="ZIP, city, or address…"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          data-testid="schools-zip"
          className="h-11 rounded-sm bg-black border-white/15 text-white font-ui flex-1"
        />
        <Button
          onClick={handleLocate}
          data-testid="schools-locate"
          variant="outline"
          className="h-11 rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Use My Location
        </Button>
      </div>

      {/* Map placeholder */}
      <div
        className="fr-card overflow-hidden mb-8 relative fr-grid-bg"
        data-testid="schools-map-placeholder"
      >
        <div className="aspect-[3/1] flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-[#FF3B30] mx-auto mb-2" />
            <div className="label-eyebrow text-white/50">
              Map preview · real geo search coming soon
            </div>
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        data-testid="schools-grid"
      >
        {filtered.map((s) => (
          <article
            key={s.id}
            data-testid={`school-${s.id}`}
            className="fr-card p-5 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="min-w-0 flex-1">
                <div className="label-eyebrow text-white/40 mb-1">
                  {s.affiliation}
                </div>
                <h3 className="font-display text-2xl tracking-tight text-white leading-tight mb-1">
                  {s.name}
                </h3>
                <p className="text-xs text-white/60 font-ui flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  {s.address}
                </p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <div className="font-display text-xl text-[#007AFF] leading-none">
                  {s.distanceMi}
                </div>
                <div className="label-eyebrow text-white/40 mt-1">mi</div>
              </div>
            </div>

            <div className="fr-hairline mb-4" />

            <div className="text-xs text-white/60 font-ui space-y-1 mb-4">
              <div>{s.schedule}</div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                {s.beltsWelcome}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {s.tags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="rounded-sm border-white/15 bg-white/5 text-white/70 font-ui text-[10px] tracking-widest uppercase font-semibold"
                >
                  {t}
                </Badge>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                toast(
                  "Directions will open once the maps integration is live.",
                )
              }
              data-testid={`school-directions-${s.id}`}
              className="w-full h-10 rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui text-sm"
            >
              Get Directions
              <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
            </Button>
          </article>
        ))}
      </div>

      <p className="text-[11px] text-white/40 font-ui mt-8">
        Listings are mocked. Real academy database + Google Maps integration is
        planned.
      </p>
    </div>
  );
}
