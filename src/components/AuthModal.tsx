import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { trackClick } from "@/lib/analytics";
import toLogoSm from "@/assets/TO_logo_sm_clr.svg";
import googleBtnAsset from "@/assets/google-signin-dark-pill.svg.asset.json";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.45 2.23-1.19 3.02-.78.85-2.03 1.5-3.08 1.42-.13-1.11.42-2.26 1.15-3.02.8-.85 2.15-1.47 3.12-1.42zM20.5 17.14c-.55 1.27-.82 1.84-1.53 2.96-.99 1.56-2.38 3.5-4.1 3.51-1.54.02-1.93-1-4.02-.99-2.09.01-2.52 1.01-4.06.99-1.72-.01-3.04-1.76-4.03-3.32C.02 15.44-.28 10.16 1.84 7.32c1.51-2.02 3.88-3.2 6.11-3.2 2.27 0 3.7 1.24 5.58 1.24 1.82 0 2.93-1.25 5.56-1.25 1.99 0 4.1 1.08 5.6 2.96-4.92 2.7-4.12 9.72.81 10.07z" />
    </svg>
  );
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const handleGoogle = async () => {
    trackClick("click_sign_in_google");
    setLoading(true);
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError("Google sign-in failed. Please try again.");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      onOpenChange(false);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (isSignup) {
      if (!confirmPassword) {
        setError("Please confirm your password.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }
    setLoading(true);
    trackClick(isSignup ? "click_sign_up_email" : "click_sign_in_email");
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) {
          setError(error.message);
          return;
        }
        toast.success("Account created! Check your email to confirm.");
        onOpenChange(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
          return;
        }
        toast.success("Signed in!");
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md p-0 border-0 bg-transparent shadow-none sm:rounded-3xl"
      >
        <div
          className="relative rounded-3xl p-6 sm:p-8"
          style={{
            background: "linear-gradient(180deg, hsl(240 30% 8%) 0%, hsl(240 25% 5%) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 0 60px hsl(var(--game-gold) / 0.15), 0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          {/* Back / close */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="absolute left-4 top-4 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
          </button>

          {/* Logo */}
          <div className="flex justify-center mt-1 mb-4">
            <img src={toLogoSm} alt="Triviolivia" className="h-8 w-auto" draggable={false} />
          </div>

          {/* Heading */}
          <DialogTitle asChild>
            <h2
              className="text-center text-3xl sm:text-4xl font-heading tracking-wider uppercase"
              style={{
                fontFamily: "'Fredoka One', 'Rubik', sans-serif",
                background:
                  "linear-gradient(180deg, #fff33b 0%, #fdc70c 40%, #f3903f 75%, #e93e3a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 2px 3px rgba(87,33,91,0.4)",
              }}
            >
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-white/60 mt-1 mb-6">
            {isSignup ? "Sign up to save your progress" : "Sign in to continue"}
          </DialogDescription>

          {/* Social buttons - stacked, brand-standard */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              aria-label="Sign in with Google"
              className="w-full h-12 flex items-center justify-center rounded-full overflow-hidden transition-all active:scale-95 disabled:opacity-60"
            >
              <img
                src={googleBtnAsset.url}
                alt=""
                className="h-12 w-auto"
                draggable={false}
              />
            </button>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="w-full flex items-center justify-center gap-3 h-12 rounded-full opacity-50 cursor-not-allowed"
              style={{
                background: "#000000",
                border: "1px solid #000000",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              <AppleIcon className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white" style={{ letterSpacing: "0.2px" }}>
                Continue with Apple
              </span>
            </button>
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs uppercase tracking-widest text-white/40">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="h-12 px-4 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--game-gold))]/40"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="w-full h-12 px-4 pr-12 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--game-gold))]/40"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isSignup && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  className="w-full h-12 px-4 pr-12 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--game-gold))]/40"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 min-h-14 py-2 px-10 rounded-full border-2 border-[#221948] whitespace-nowrap
                bg-[linear-gradient(0deg,#e93e3a_0%,#ed683c_11%,#f3903f_33%,#fdc70c_72%,#fff33b_100%)]
                text-white text-xl font-heading font-extrabold tracking-[0.18em] uppercase
                shadow-lg shadow-black/30 transition-all duration-200
                inline-flex items-center justify-center gap-2
                disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
              style={{
                textShadow: "0 2px 3px rgba(87,33,91,0.6)",
                fontFamily: "'Fredoka One', 'Rubik', sans-serif",
              }}
            >
              {!isSignup && <LogIn className="w-5 h-5" />}
              {isSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-xs text-white/50 mt-5">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setConfirmPassword("");
                setMode(isSignup ? "signin" : "signup");
              }}
              className="text-white/80 underline underline-offset-2 hover:text-[hsl(var(--game-gold))]"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
