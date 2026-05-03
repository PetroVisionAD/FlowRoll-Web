import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Bookmark, History, LogOut, LogIn } from "lucide-react";
import { toast } from "sonner";

const initials = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "FR";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Link to="/auth/login" data-testid="navbar-signin">
        <Button
          variant="outline"
          className="rounded-sm bg-transparent border-white/20 text-white hover:bg-white/5 font-ui h-9 px-4"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign in
        </Button>
      </Link>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-testid="navbar-user-menu-trigger"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-sm border border-white/10 hover:border-[#FF3B30]/50 hover:bg-white/5 transition-all fr-pressable"
        >
          <Avatar className="w-7 h-7 rounded-sm">
            <AvatarFallback className="rounded-sm bg-[#FF3B30] text-white text-xs font-ui font-bold">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-ui font-semibold text-white leading-none">
              {user.name}
            </div>
            <div className="label-eyebrow text-[9px] text-white/40 leading-none mt-1">
              {user.belt} Belt
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#141414] border-white/15 rounded-sm text-white min-w-[200px]"
        data-testid="navbar-user-menu"
      >
        <DropdownMenuLabel className="label-eyebrow text-white/40 text-[10px]">
          Account
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="font-ui cursor-pointer focus:bg-white/10 focus:text-white"
          data-testid="user-menu-profile"
        >
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/saved")}
          className="font-ui cursor-pointer focus:bg-white/10 focus:text-white"
          data-testid="user-menu-saved"
        >
          <Bookmark className="w-4 h-4 mr-2" />
          Saved Progress
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/history")}
          className="font-ui cursor-pointer focus:bg-white/10 focus:text-white"
          data-testid="user-menu-history"
        >
          <History className="w-4 h-4 mr-2" />
          Training History
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="font-ui cursor-pointer text-[#FF3B30] focus:bg-[#FF3B30]/10 focus:text-[#FF3B30]"
          data-testid="user-menu-signout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
