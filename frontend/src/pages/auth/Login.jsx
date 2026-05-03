import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Flame } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email to continue");
      return;
    }
    setLoading(true);
    try {
      const u = await signIn({ email: email.trim(), password });
      toast.success(`Welcome back, ${u.name}`);
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-md mx-auto px-4 sm:px-8 py-16"
      data-testid="page-login"
    >
      <div className="fr-fade-up">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <LogIn className="w-3.5 h-3.5" />
          Sign In
        </div>
        <h1 className="font-display text-5xl tracking-tight leading-none uppercase text-white mb-2">
          Welcome back.
        </h1>
        <p className="text-sm text-white/60 mb-8">
          Continue your training — rounds, progress and saved lessons stay synced.
        </p>

        <form
          onSubmit={handleSubmit}
          className="fr-card p-6 sm:p-8 space-y-5"
          data-testid="login-form"
        >
          <div>
            <Label
              htmlFor="email"
              className="label-eyebrow text-white/40 mb-2 block"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              data-testid="login-email"
              className="h-11 rounded-sm bg-black border-white/15 text-white font-ui focus:border-[#FF3B30]/50"
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="label-eyebrow text-white/40 mb-2 block"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              data-testid="login-password"
              className="h-11 rounded-sm bg-black border-white/15 text-white font-ui focus:border-[#FF3B30]/50"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            data-testid="login-submit"
            className="w-full h-11 rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold tracking-wide fr-pressable"
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>

          <div className="flex items-center gap-3 text-[10px] label-eyebrow text-white/30">
            <div className="flex-1 h-px bg-white/10" />
            or
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            type="button"
            disabled
            data-testid="login-google-placeholder"
            className="w-full h-11 rounded-sm border border-white/15 text-white/60 font-ui text-sm cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Flame className="w-3.5 h-3.5" />
            Google sign-in — coming soon
          </button>

          <p className="text-center text-xs text-white/50 font-ui">
            No account yet?{" "}
            <Link
              to="/auth/register"
              className="text-[#FF3B30] hover:underline"
              data-testid="login-to-register"
            >
              Create one
            </Link>
          </p>
        </form>

        <div className="mt-6 text-[11px] text-white/40 font-ui leading-relaxed">
          Note: multi-user accounts are currently mocked locally. Supabase auth &
          profile sync are planned.
        </div>
      </div>
    </div>
  );
}
