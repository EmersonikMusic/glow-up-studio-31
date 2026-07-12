import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { trackClick } from "@/lib/analytics";
import toLogoSm from "@/assets/TO_logo_sm_clr.svg";
import appleLogoWhite from "@/assets/apple-logo-white.svg";
import googleBtnAsset from "@/assets/google-signin-dark-pill.svg.asset.json";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Filled in once the Apple Developer Services ID is provisioned.
// While empty, the Apple button renders visually via Apple's SDK but clicks
// are intercepted and only show a "coming soon" toast.
const APPLE_SERVICES_ID = (import.meta.env.VITE_APPLE_SERVICES_ID as string | undefined) ?? "";
const APPLE_AUTH_READY = APPLE_SERVICES_ID.length > 0;

// Google's dark pill SVG is intrinsically 180x40. Rendering both social
// buttons at that exact size (a) keeps Google's asset unscaled, and
// (b) lets Apple's SDK auto-scale its text/logo to match as closely as
// Apple's proportions allow. Both changes are compliant with each brand's
// guidelines (Google allows uniform scaling only; Apple's SDK derives its
// text and logo sizes from data-height).
const SOCIAL_BTN_WIDTH = 180;
const SOCIAL_BTN_HEIGHT = 40;

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
  const appleContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize Apple's Sign in with Apple JS SDK once the script loads. We
  // render a custom Sign in with Apple button (per Apple HIG's custom-button
  // guidelines) so we control font size and layout, then dispatch to
  // AppleID.auth.signIn() from that button once credentials are provisioned.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let interval: number | undefined;

    const tryInit = () => {
      if (cancelled) return true;
      const AppleID = window.AppleID;
      if (!AppleID?.auth) return false;
      try {
        AppleID.auth.init({
          clientId: APPLE_SERVICES_ID || "pending.services.id",
          scope: "name email",
          redirectURI: window.location.origin,
          usePopup: true,
        });
      } catch {
        // init can throw if called twice on some SDK builds — safe to ignore.
      }
      return true;
    };

    if (!tryInit()) {
      interval = window.setInterval(() => {
        if (tryInit()) window.clearInterval(interval);
      }, 100);
      window.setTimeout(() => interval && window.clearInterval(interval), 5000);
    }

    return () => {
      cancelled = true;
      if (interval) window.clearInterval(interval);
    };
  }, [open, isSignup]);


  const handleAppleClick = (e: React.MouseEvent) => {
    // Until the Apple Developer Services ID is configured, keep the button
    // inert: swallow the click so Apple's SDK doesn't open an auth window
    // against a placeholder client ID (which would show `invalid_client`).
    if (!APPLE_AUTH_READY) {
      e.preventDefault();
      e.stopPropagation();
      trackClick("click_sign_in_apple");
      toast("Apple sign-in coming soon");
    }
  };


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

          {/* Heading - matches About page header styling */}
          <p
            className="text-center text-sm font-subheading font-bold tracking-[0.2em] uppercase mb-2"
            style={{ color: "hsl(185 70% 55%)" }}
          >
            {isSignup ? "Join" : "Welcome to"}
          </p>
          <DialogTitle asChild>
            <h2
              className="text-center font-heading font-extrabold uppercase leading-none tracking-tight whitespace-nowrap text-[clamp(14px,6.2vw,24px)] sm:text-3xl md:text-4xl"
              style={{
                background:
                  "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.05,
              }}
            >
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-white/60 mt-1 mb-6">
            {isSignup ? "Sign up to save your progress" : "Sign in to continue"}
          </DialogDescription>

          {/* Social buttons - stacked on mobile, side-by-side on tablet+ */}
          <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              aria-label="Sign in with Google"
              className="mx-auto flex items-center justify-center rounded-full overflow-hidden transition-all active:scale-95 disabled:opacity-60"
              style={{ width: SOCIAL_BTN_WIDTH, height: SOCIAL_BTN_HEIGHT, maxWidth: "100%" }}
            >
              <img
                src={googleBtnAsset.url}
                alt=""
                className="h-full w-auto"
                draggable={false}
              />
            </button>
            {/* Custom Sign in with Apple button — Apple HIG allows custom
                buttons with adjustable title font size, provided the official
                Apple logo file and title text ("Sign in with Apple" /
                "Sign up with Apple") are used. Clicks are swallowed until
                VITE_APPLE_SERVICES_ID is set. */}
            <button
              ref={appleContainerRef as unknown as React.RefObject<HTMLButtonElement>}
              type="button"
              onClick={handleAppleClick}
              aria-label={isSignup ? "Sign up with Apple" : "Sign in with Apple"}
              aria-disabled={!APPLE_AUTH_READY}
              className="mx-auto flex items-center justify-center rounded-full overflow-hidden transition-all active:scale-95 cursor-pointer"
              style={{
                width: SOCIAL_BTN_WIDTH,
                height: SOCIAL_BTN_HEIGHT,
                maxWidth: "100%",
                background: "#000000",
                color: "#FFFFFF",
              }}
            >
              <img
                src={appleLogoWhite}
                alt=""
                aria-hidden="true"
                draggable={false}
                style={{ height: SOCIAL_BTN_HEIGHT, width: "auto", display: "block" }}
              />
              <span
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "-0.24px",
                  lineHeight: 1,
                }}
              >
                {isSignup ? "Sign up with Apple" : "Sign in with Apple"}
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
