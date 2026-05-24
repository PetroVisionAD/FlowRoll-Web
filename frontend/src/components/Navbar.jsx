import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Flame,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Plus,
  ChevronDown,
  MessageSquare,
  Video,
  MapPin,
  ShoppingBag,
  Compass,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserMenu from "@/components/UserMenu";

const PRIMARY_LINKS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/logger", label: "Logger", icon: ClipboardList },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/performance", label: "Performance", icon: Activity },
];

const DISCOVER_LINKS = [
  {
    to: "/community",
    label: "Community",
    icon: MessageSquare,
    desc: "Technique threads",
  },
  {
    to: "/coaching",
    label: "Coaching",
    icon: Video,
    desc: "1:1 over Google Meet",
  },
  {
    to: "/schools",
    label: "Schools",
    icon: MapPin,
    desc: "Find a gym near you",
  },
  {
    to: "/store",
    label: "Shop",
    icon: ShoppingBag,
    desc: "Gear & apparel",
  },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const discoverActive = DISCOVER_LINKS.some((l) => pathname.startsWith(l.to));

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
          {PRIMARY_LINKS.map((link) => {
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

          {/* Discover dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                data-testid="nav-link-discover"
                className={`px-4 py-2 rounded-sm flex items-center gap-2 text-sm font-ui font-medium transition-all duration-200 ${
                  discoverActive
                    ? "text-white bg-white/5 border border-white/15"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Compass className="w-4 h-4" />
                Discover
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-[#141414] border-white/15 rounded-sm text-white min-w-[240px]"
              data-testid="navbar-discover-menu"
            >
              <DropdownMenuLabel className="label-eyebrow text-white/40 text-[10px]">
                Discover
              </DropdownMenuLabel>
              {DISCOVER_LINKS.map((l) => {
                const Icon = l.icon;
                return (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link
                      to={l.to}
                      data-testid={`discover-link-${l.label.toLowerCase()}`}
                      className="flex items-start gap-3 px-2 py-2 cursor-pointer focus:bg-white/10 focus:text-white"
                    >
                      <Icon className="w-4 h-4 mt-0.5 text-[#FF3B30] shrink-0" />
                      <div>
                        <div className="font-ui text-sm text-white">
                          {l.label}
                        </div>
                        <div className="text-[11px] text-white/50 leading-tight">
                          {l.desc}
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/logger"
            data-testid="navbar-cta-log-round"
            className="hidden sm:block"
          >
            <Button className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold tracking-wide px-4 h-9 fr-pressable">
              <Plus className="w-4 h-4 mr-1" />
              Log Round
            </Button>
          </Link>
          <UserMenu />
        </div>
      </div>

      {/* Mobile nav — primary + discover as equal tabs */}
      <div className="md:hidden border-t border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-2 py-2 flex items-center justify-between gap-1 overflow-x-auto">
          {PRIMARY_LINKS.map((link) => {
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
                className={`flex-1 min-w-[72px] text-center px-2 py-2 rounded-sm flex flex-col items-center gap-1 text-[10px] font-ui font-medium transition-all ${
                  active ? "text-white bg-white/5" : "text-white/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                data-testid="nav-mobile-discover"
                className={`flex-1 min-w-[72px] text-center px-2 py-2 rounded-sm flex flex-col items-center gap-1 text-[10px] font-ui font-medium transition-all ${
                  discoverActive ? "text-white bg-white/5" : "text-white/50"
                }`}
              >
                <Compass className="w-4 h-4" />
                Discover
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#141414] border-white/15 rounded-sm text-white min-w-[220px]"
            >
              {DISCOVER_LINKS.map((l) => {
                const Icon = l.icon;
                return (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link
                      to={l.to}
                      className="flex items-center gap-2 px-2 py-2 cursor-pointer focus:bg-white/10 focus:text-white"
                    >
                      <Icon className="w-4 h-4 text-[#FF3B30]" />
                      <span className="font-ui text-sm">{l.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
