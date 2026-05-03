// Mock auth context — API intentionally mirrors Supabase's
// (user, signIn, signUp, signOut, session) so we can swap the implementation
// for `createClient` / `supabase.auth.*` later without touching UI code.

import { createContext, useContext, useEffect, useState } from "react";

const USER_KEY = "flowroll.mock_user.v1";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupt user row
    }
    setReady(true);
  }, []);

  const persist = (u) => {
    if (u) {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setUser(u);
  };

  const signIn = async ({ email }) => {
    // Mock: succeed for any non-empty email. When Supabase is wired in,
    // replace with `supabase.auth.signInWithPassword(...)`.
    if (!email) throw new Error("Email required");
    const name = email.split("@")[0] || "Athlete";
    const existing = user && user.email === email ? user : null;
    const u =
      existing || {
        id: `u_${Date.now()}`,
        email,
        name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
        belt: "White",
        stripes: 0,
        homeGym: "",
        createdAt: new Date().toISOString(),
      };
    persist(u);
    return u;
  };

  const signUp = async ({ email, name, belt }) => {
    if (!email || !name) throw new Error("Email and name required");
    const u = {
      id: `u_${Date.now()}`,
      email,
      name,
      belt: belt || "White",
      stripes: 0,
      homeGym: "",
      createdAt: new Date().toISOString(),
    };
    persist(u);
    return u;
  };

  const signOut = async () => {
    persist(null);
  };

  const updateProfile = async (patch) => {
    if (!user) throw new Error("Not signed in");
    const next = { ...user, ...patch };
    persist(next);
    return next;
  };

  return (
    <AuthContext.Provider
      value={{ user, ready, signIn, signUp, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
