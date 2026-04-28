import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { createSafeId } from "@/lib/browserCompat";

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
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));
    const username = email.split("@")[0];
    setUser({ id: createSafeId(), username, email, provider: "email" });
    setIsLoading(false);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setUser({ id: createSafeId(), username: "GoogleUser", email: "user@gmail.com", provider: "google" });
    setIsLoading(false);
  }, []);

  const loginWithApple = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setUser({ id: createSafeId(), username: "AppleUser", email: "user@icloud.com", provider: "apple" });
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (email: string, _password: string, username: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setUser({ id: createSafeId(), username, email, provider: "email" });
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, loginWithApple, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
