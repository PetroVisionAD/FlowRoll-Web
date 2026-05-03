import { NavLink, Link, useLocation } from "react-router-dom";
import { Flame, LayoutDashboard, BookOpen, ClipboardList, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/logger", label: "Logger", icon: ClipboardList },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10"
      data-testid="app-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          data-testid="navbar-logo"
        >
          <div className="w-9 h-9 rounded-sm bg-[#FF3B30] flex items-center justify-center shadow-[0_0_20px_rgba(255,59,48,0.45)] group-hover:shadow-[0_0_28px_rgba(255,59,48,0.7)] transition-all">
            <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <div className="font-display text-2xl tracking-wider text-white">
              FLOW<span className="text-[#FF3B30]">ROLL</span>
            </div>
            <div className="label-eyebrow text-white/40 mt-0.5">
              Training System
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = link.end
              ? pathname === link.to
              : pathname.startsWith(link.to) && link.to !== "/";
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={`px-4 py-2 rounded-sm flex items-center gap-2 text-sm font-ui font-medium transition-all duration-200 ${
                  active
                    ? "text-white bg-white/5 border border-white/15"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/logger" data-testid="navbar-cta-log-round">
            <Button className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold tracking-wide px-4 fr-pressable">
              <Plus className="w-4 h-4 mr-1" />
              Log Round
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-1 overflow-x-auto">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = link.end
              ? pathname === link.to
              : pathname.startsWith(link.to) && link.to !== "/";
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                data-testid={`nav-mobile-${link.label.toLowerCase()}`}
                className={`flex-1 min-w-[80px] text-center px-3 py-2 rounded-sm flex flex-col items-center gap-1 text-[11px] font-ui font-medium transition-all ${
                  active ? "text-white bg-white/5" : "text-white/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </header>
  );
}
