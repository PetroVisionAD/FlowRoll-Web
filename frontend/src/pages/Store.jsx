import { ShoppingBag, Package, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "FlowRoll Core Rash Guard",
    category: "No-Gi",
    price: 68,
    description: "4-way stretch, flatlock stitching, sublimated print.",
    color: "#FF3B30",
    badge: "Launching Q2",
  },
  {
    id: "p2",
    name: "Training Gi — Lightweight",
    category: "Gi",
    price: 189,
    description: "Pearl weave jacket, ripstop pants, IBJJF legal.",
    color: "#FFFFFF",
    badge: "Launching Q2",
  },
  {
    id: "p3",
    name: "Grappling Shorts",
    category: "No-Gi",
    price: 54,
    description: "10\" inseam, no-snag fly, gusseted crotch.",
    color: "#111111",
    badge: "Launching Q3",
  },
  {
    id: "p4",
    name: "FlowRoll Tee",
    category: "Apparel",
    price: 32,
    description: "Heavyweight cotton, chest + back print.",
    color: "#0A0A0A",
    badge: "Coming Soon",
  },
  {
    id: "p5",
    name: "Patch Set (3-pack)",
    category: "Apparel",
    price: 18,
    description: "Iron-on, sew-on backer. Flame, wordmark, initials.",
    color: "#FF3B30",
    badge: "Coming Soon",
  },
  {
    id: "p6",
    name: "Training Journal",
    category: "Gear",
    price: 24,
    description: "120-page structured log: rounds, drills, reflections.",
    color: "#141414",
    badge: "Launching Q2",
  },
];

export default function Store() {
  const handleNotify = (p) =>
    toast.success(`You'll be notified when ${p.name} launches.`);

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-store"
    >
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <ShoppingBag className="w-3.5 h-3.5" />
          FlowRoll Shop
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-3">
          Built For The Mat.
        </h1>
        <p className="max-w-2xl text-base text-white/60 leading-relaxed">
          Training gear and small-run apparel. Designed with athletes, priced
          without markup.
        </p>
      </div>

      <div
        className="fr-card p-5 mb-8 flex items-start gap-3"
        data-testid="store-coming-soon-banner"
        style={{ borderColor: "rgba(255,59,48,0.35)" }}
      >
        <Package className="w-5 h-5 text-[#FF3B30] shrink-0 mt-0.5" />
        <div>
          <div className="font-ui font-semibold text-white mb-1">
            Shop launching soon.
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Products are preview only. Notify sign-up will trigger the real
            launch list once the store backend is online.
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        data-testid="store-grid"
      >
        {MOCK_PRODUCTS.map((p) => (
          <article
            key={p.id}
            data-testid={`product-${p.id}`}
            className="fr-card group overflow-hidden"
          >
            {/* Product visual — geometric placeholder */}
            <div
              className="aspect-square relative overflow-hidden fr-grid-bg border-b border-white/10"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${p.color}, transparent 60%), #0A0A0A`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-28 h-28 rounded-sm border border-white/20 flex items-center justify-center font-display text-5xl tracking-wider"
                  style={{ color: p.color === "#FFFFFF" ? "#0A0A0A" : "#FFFFFF", background: `${p.color}30` }}
                >
                  FR
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <Badge
                  variant="outline"
                  className="rounded-sm border-white/20 bg-black/70 backdrop-blur text-white font-ui text-[10px] tracking-widest uppercase font-semibold"
                >
                  {p.badge}
                </Badge>
              </div>
            </div>

            <div className="p-5">
              <div className="label-eyebrow text-white/40 mb-2">
                {p.category}
              </div>
              <h3 className="font-display text-xl tracking-tight text-white mb-1">
                {p.name}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                {p.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="font-display text-2xl text-[#FF3B30] leading-none">
                  ${p.price}
                </div>
                <Button
                  onClick={() => handleNotify(p)}
                  variant="outline"
                  data-testid={`product-notify-${p.id}`}
                  className="rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui text-xs h-9"
                >
                  Notify Me
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        className="fr-card p-5 mt-8 flex items-center gap-3"
        data-testid="store-shipping-note"
      >
        <Truck className="w-4 h-4 text-white/40 shrink-0" />
        <p className="text-sm text-white/60 font-ui">
          Free shipping on orders over $100 — once the store is live.
        </p>
      </div>
    </div>
  );
}
