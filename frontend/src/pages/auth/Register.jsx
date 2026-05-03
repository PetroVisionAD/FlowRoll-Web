import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { BELTS } from "@/data/library";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [belt, setBelt] = useState("White");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setLoading(true);
    try {
      const u = await signUp({
        email: email.trim(),
        password,
        name: name.trim(),
        belt,
      });
      toast.success(`Welcome, ${u.name}. Time to roll.`);
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-md mx-auto px-4 sm:px-8 py-16"
      data-testid="page-register"
    >
      <div className="fr-fade-up">
        <div className="flex items-center gap-2 label-eyebrow text-[#FF3B30] mb-3">
          <UserPlus className="w-3.5 h-3.5" />
          Create Account
        </div>
        <h1 className="font-display text-5xl tracking-tight leading-none uppercase text-white mb-2">
          Start logging.
        </h1>
        <p className="text-sm text-white/60 mb-8">
          Save lessons, track rounds, and find your weakest position.
        </p>

        <form
          onSubmit={handleSubmit}
          className="fr-card p-6 sm:p-8 space-y-5"
          data-testid="register-form"
        >
          <div>
            <Label
              htmlFor="name"
              className="label-eyebrow text-white/40 mb-2 block"
            >
              Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Helio Gracie"
              data-testid="register-name"
              className="h-11 rounded-sm bg-black border-white/15 text-white font-ui focus:border-[#FF3B30]/50"
            />
          </div>
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
              data-testid="register-email"
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
              data-testid="register-password"
              className="h-11 rounded-sm bg-black border-white/15 text-white font-ui focus:border-[#FF3B30]/50"
            />
          </div>
          <div>
            <Label className="label-eyebrow text-white/40 mb-2 block">
              Current Belt
            </Label>
            <Select value={belt} onValueChange={setBelt}>
              <SelectTrigger
                data-testid="register-belt"
                className="h-11 rounded-sm bg-black border-white/15 text-white font-ui focus:ring-[#FF3B30]/40 focus:ring-2"
              >
                <SelectValue placeholder="Select belt" />
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

          <Button
            type="submit"
            disabled={loading}
            data-testid="register-submit"
            className="w-full h-11 rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold tracking-wide fr-pressable"
          >
            {loading ? "Creating…" : "Create Account"}
          </Button>

          <p className="text-center text-xs text-white/50 font-ui">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-[#FF3B30] hover:underline"
              data-testid="register-to-login"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
