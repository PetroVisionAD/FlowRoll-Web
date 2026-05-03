import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { loadRounds, computeStats, loadStreakData } from "@/lib/storage";
import { loadAllProgress } from "@/lib/lessonProgress";
import { BELTS } from "@/data/library";
import {
  User,
  Bookmark,
  History,
  Edit3,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const initials = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "FR";

export default function Profile() {
  const { user, updateProfile, ready } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", belt: "White", homeGym: "" });
  const [rounds, setRounds] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        belt: user.belt,
        homeGym: user.homeGym || "",
      });
    }
  }, [user]);

  useEffect(() => {
    setRounds(loadRounds());
    setProgress(loadAllProgress());
  }, []);

  const stats = useMemo(() => computeStats(rounds), [rounds]);
  const streak = useMemo(() => loadStreakData(), []);
  const learnedCount = progress.filter((p) => p.learned).length;
  const savedCount = progress.filter((p) => p.saved).length;

  if (!ready) return null;
  if (!user) return <Navigate to="/auth/login" replace />;

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    await updateProfile({
      name: form.name.trim(),
      belt: form.belt,
      homeGym: form.homeGym.trim(),
    });
    toast.success("Profile updated");
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ name: user.name, belt: user.belt, homeGym: user.homeGym || "" });
    setEditing(false);
  };

  const joined = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-10"
      data-testid="page-profile"
    >
      <div className="fr-fade-up mb-10">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <User className="w-3.5 h-3.5" />
          Athlete Profile
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <Avatar
            className="w-24 h-24 rounded-sm shrink-0"
            data-testid="profile-avatar"
          >
            <AvatarFallback className="rounded-sm bg-[#FF3B30] text-white font-display text-4xl tracking-wider">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-none uppercase text-white mb-2 break-words">
              {user.name}
            </h1>
            <div className="flex items-center gap-3 text-sm text-white/60 font-ui flex-wrap">
              <span className="label-eyebrow text-[#FF3B30]">
                {user.belt} Belt
              </span>
              <span className="text-white/20">·</span>
              <span>{user.email}</span>
              <span className="text-white/20">·</span>
              <span>Joined {joined}</span>
            </div>
          </div>
          {!editing && (
            <Button
              onClick={() => setEditing(true)}
              variant="outline"
              data-testid="profile-edit"
              className="rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui shrink-0"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="fr-hairline mb-8" />

      {/* EDIT FORM */}
      {editing && (
        <section
          className="fr-card p-6 sm:p-8 mb-8"
          data-testid="profile-edit-form"
        >
          <div className="label-eyebrow text-white/40 mb-5">Edit Profile</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="label-eyebrow text-white/40 mb-2 block">
                Name
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-testid="profile-name-input"
                className="h-11 rounded-sm bg-black border-white/15 text-white font-ui"
              />
            </div>
            <div>
              <Label className="label-eyebrow text-white/40 mb-2 block">
                Belt
              </Label>
              <Select
                value={form.belt}
                onValueChange={(v) => setForm({ ...form, belt: v })}
              >
                <SelectTrigger
                  data-testid="profile-belt-input"
                  className="h-11 rounded-sm bg-black border-white/15 text-white font-ui"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border-white/15 rounded-sm text-white">
                  {BELTS.map((b) => (
                    <SelectItem
                      key={b}
                      value={b}
                      className="font-ui focus:bg-white/10 focus:text-white"
                    >
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="label-eyebrow text-white/40 mb-2 block">
                Home Gym (optional)
              </Label>
              <Input
                value={form.homeGym}
                onChange={(e) =>
                  setForm({ ...form, homeGym: e.target.value })
                }
                placeholder="Gracie Barra, 10th Planet, local academy…"
                data-testid="profile-gym-input"
                className="h-11 rounded-sm bg-black border-white/15 text-white font-ui"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button
              onClick={handleSave}
              data-testid="profile-save"
              className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold"
            >
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              data-testid="profile-cancel"
              className="rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </section>
      )}

      {/* STATS OVERVIEW */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatTile label="Total Rounds" value={stats.total} />
        <StatTile label="Win Rate" value={stats.total ? `${Math.round((stats.wins / stats.total) * 100)}%` : "—"} color="text-[#007AFF]" />
        <StatTile label="Current Streak" value={streak.streak} />
        <StatTile label="Lessons Learned" value={learnedCount} color="text-[#FF3B30]" />
      </section>

      {/* QUICK LINKS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ProfileLink
          to="/history"
          icon={History}
          label="Training History"
          sub={`${rounds.length} rounds · ${streak.bestStreak} day best streak`}
          testid="profile-link-history"
        />
        <ProfileLink
          to="/saved"
          icon={Bookmark}
          label="Saved Progress"
          sub={`${learnedCount} learned · ${savedCount} saved`}
          testid="profile-link-saved"
        />
      </section>

      <p className="text-[11px] text-white/40 font-ui mt-8">
        Profile data is currently stored locally. Cloud sync via Supabase auth
        is planned.
      </p>
    </div>
  );
}

function StatTile({ label, value, color = "text-white" }) {
  return (
    <div className="fr-card p-5">
      <div className="label-eyebrow text-white/40 mb-3">{label}</div>
      <div className={`font-display text-4xl leading-none ${color}`}>
        {typeof value === "number" ? String(value).padStart(2, "0") : value}
      </div>
    </div>
  );
}

function ProfileLink({ to, icon: Icon, label, sub, testid }) {
  return (
    <Link
      to={to}
      data-testid={testid}
      className="fr-card fr-pressable group p-5 flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:text-[#FF3B30] group-hover:border-[#FF3B30]/50 transition-all">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-ui font-semibold text-white">{label}</div>
        <div className="text-xs text-white/50 mt-0.5 truncate">{sub}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#FF3B30] group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
