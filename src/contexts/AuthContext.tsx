import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { User as CloudUser } from "@supabase/supabase-js";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  username: string;
  email: string;
  provider?: "google" | "apple" | "email";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function redirectUrl() {
  return typeof window !== "undefined" ? window.location.origin : undefined;
}

function toAppUser(authUser: CloudUser | null): User | null {
  if (!authUser) return null;

  const metadata = authUser.user_metadata || {};
  const provider = authUser.app_metadata?.provider;
  const email = authUser.email || "";
  const username =
    metadata.username ||
    metadata.user_name ||
    metadata.preferred_username ||
    metadata.full_name ||
    metadata.name ||
    (email ? email.split("@")[0] : "Player");

  return {
    id: authUser.id,
    username: String(username),
    email,
    provider: provider === "google" || provider === "apple" ? provider : "email",
  };
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(toAppUser(session?.user ?? null));
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(toAppUser(session?.user ?? null));
      setIsLoading(false);
    }).catch(() => {
      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: _password });
    setIsLoading(false);
    if (error) throw error;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: redirectUrl() });
    setIsLoading(false);
    if (result.error) throw result.error;
  }, []);

  const loginWithApple = useCallback(async () => {
    setIsLoading(true);
    const result = await lovable.auth.signInWithOAuth("apple", { redirect_uri: redirectUrl() });
    setIsLoading(false);
    if (result.error) throw result.error;
  }, []);

  const signup = useCallback(async (email: string, _password: string, username: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: _password,
      options: {
        emailRedirectTo: redirectUrl(),
        data: { username },
      },
    });
    setIsLoading(false);
    if (error) throw error;
    return { needsEmailConfirmation: !!data.user && !data.session };
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    if (error) throw error;
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, loginWithApple, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
