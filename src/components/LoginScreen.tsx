import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react";
import toLogoSm from "@/assets/TO_logo_sm_clr.svg";

export default function LoginScreen({ onClose }: { onClose: () => void }) {
  const { login, loginWithGoogle, loginWithApple, signup, isLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "signup") {
        if (!username.trim()) { setError("Username is required"); return; }
        await signup(email, password, username);
      } else {
        await login(email, password);
      }
      onClose();
    } catch {
      setError("Authentication failed. Please try again.");
    }
  };

  const handleSocial = async (provider: "google" | "apple") => {
    setError("");
    try {
      if (provider === "google") await loginWithGoogle();
      else await loginWithApple();
      onClose();
    } catch {
      setError("Social login failed. Please try again.");
    }
  };

  const inputStyle = {
    background: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    color: "rgba(255,255,255,0.9)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden animate-scale-in backdrop-blur-xl"
        style={{
          background: "rgba(0, 0, 0, 0.45)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:brightness-125 active:scale-95"
            style={{ background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)" }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
          </button>
          <img src={toLogoSm} alt="TrivOlivia" className="h-6 w-auto" draggable={false} />
          <div className="w-9" />
        </div>

        {/* Title */}
        <div className="px-6 pb-5 text-center">
          <h2
            className="text-xl font-black uppercase tracking-wider"
            style={{
              fontFamily: "'Fredoka One', 'Nunito', sans-serif",
              background: "linear-gradient(160deg, hsl(42 100% 62%), hsl(35 90% 48%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            {mode === "login" ? "Sign in to continue" : "Join the trivia fun"}
          </p>
        </div>

        {/* Social buttons */}
        <div className="px-6 flex gap-3 mb-4">
          <button
            onClick={() => handleSocial("google")}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button
            onClick={() => handleSocial("apple")}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.24 16.7 4.89 10.38 9 10.1c1.24.07 2.1.72 2.82.78.96-.2 1.88-.82 2.92-.74 1.24.1 2.17.58 2.78 1.5-2.56 1.54-1.95 4.92.53 5.86-.64 1.68-1.46 3.34-3 4.78zM12.04 10.02c-.12-2.19 1.7-4.06 3.86-4.22.3 2.39-2.17 4.42-3.86 4.22z"/>
            </svg>
            Apple
          </button>
        </div>

        {/* Divider */}
        <div className="px-6 flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 flex flex-col gap-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-[hsl(42_100%_55%_/_0.4)]"
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-[hsl(42_100%_55%_/_0.4)]"
            style={inputStyle}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-[hsl(42_100%_55%_/_0.4)] pr-10"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs font-semibold text-center" style={{ color: "hsl(0 70% 60%)" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="cta-glass w-full py-3 rounded-xl font-black text-sm tracking-widest uppercase transition-all disabled:opacity-50 mt-1"
          >
            <span className="flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              {isLoading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="text-xs font-semibold text-center transition-colors"
            style={{ color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
          >
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
