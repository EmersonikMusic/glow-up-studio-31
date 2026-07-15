import { useEffect, useState } from "react";
import { ChevronsLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { trackClick } from "@/lib/analytics";

import googleBtnAsset from "@/assets/google-signin-dark-pill.svg.asset.json";
import appleLogo from "@/assets/apple-logo-white.svg";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Google's dark pill SVG is intrinsically 180x40. Rendering the Apple
// button at the same size keeps the two social buttons visually aligned.
const SOCIAL_BTN_WIDTH = 180;
const SOCIAL_BTN_HEIGHT = 40;


const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9._]{1,18})[a-zA-Z0-9]$/;

function validateUsername(u: string): string | null {
  const trimmed = u.trim();
  if (!trimmed) return "Please choose a username.";
  if (trimmed.length < 3) return "Username must be at least 3 characters.";
  if (trimmed.length > 20) return "Username must be 20 characters or fewer.";
  if (!USERNAME_RE.test(trimmed))
    return "Use letters, numbers, dots and underscores. No leading/trailing dot or underscore.";
  return null;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signup");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Forgot-password: after sending, keep the user on the forgot view with
  // a "sent" confirmation panel + throttled Resend button.
  const [resetSent, setResetSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // 30s countdown for the Resend button.
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  const handleApple = async () => {
    trackClick("click_sign_in_apple");
    setLoading(true);
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError("Apple sign-in failed. Please try again.");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      onOpenChange(false);
    } catch {
      setError("Apple sign-in failed. Please try again.");
    } finally {
      setLoading(false);
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

  const sendResetEmail = async (isResend: boolean) => {
    setError(null);
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    trackClick(isResend ? "click_resend_reset_link" : "click_send_reset_link");
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      // Always show the same confirmation to avoid account enumeration.
      toast.success("If that email exists, a reset link is on its way.");
      setResetSent(true);
      setResendCooldown(30);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetEmail(false);
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
      const usernameError = validateUsername(username);
      if (usernameError) {
        setError(usernameError);
        return;
      }
    }
    setLoading(true);
    trackClick(isSignup ? "click_sign_up_email" : "click_sign_in_email");
    try {
      if (isSignup) {
        const trimmedUsername = username.trim();
        // Pre-check availability (case-insensitive). Note: RLS restricts
        // profile reads to the owner, so this may return null even for a
        // taken username; the DB unique index is the ultimate guard.
        const { data: taken } = await supabase
          .from("profiles")
          .select("id")
          .ilike("username", trimmedUsername)
          .maybeSingle();
        if (taken) {
          setError("That username is already taken.");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { username: trimmedUsername },
          },
        });
        if (error) {
          // 23505 = unique violation on username index (thrown by trigger)
          if (error.message?.toLowerCase().includes("username") || (error as { code?: string }).code === "23505") {
            setError("That username is already taken.");
          } else {
            setError(error.message);
          }
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
        overlayClassName="bg-[hsl(240_45%_10%_/_0.6)]"
        hideClose
      >
        <div
          className="relative rounded-3xl p-6 sm:p-8"
          style={{
            background: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
          }}
        >
          {/* Back / close — matches Settings / About styling */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="nav-btn absolute left-4 top-4 z-20 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <ChevronsLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.5} />
          </button>

          {/* Heading - matches About page header styling */}
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
              {isForgot ? "Reset Password" : isSignup ? "Create Account" : "Welcome Back"}
            </h2>
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-white/60 mt-1 mb-6">
            {isForgot
              ? resetSent
                ? `We've sent a reset link to ${email || "your email"} if an account exists.`
                : "Enter your email to receive a reset link"
              : isSignup
                ? "Sign up to save your progress"
                : "Sign in to continue"}
          </DialogDescription>

          {/* Social row — kept mounted so Apple's SDK-painted button
              survives forgot ↔ signin toggles. Hidden in forgot mode. */}
          <div className={isForgot ? "hidden" : ""} aria-hidden={isForgot}>
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
                  className="w-full h-full block"
                  draggable={false}
                />
              </button>
              {/* Sign in with Apple — sized to match Google's pill. */}
              <button
                type="button"
                onClick={handleApple}
                disabled={loading}
                aria-label="Sign in with Apple"
                className="mx-auto flex items-center justify-center gap-2 rounded-full overflow-hidden transition-all active:scale-95 disabled:opacity-60"
                style={{
                  width: SOCIAL_BTN_WIDTH,
                  height: SOCIAL_BTN_HEIGHT,
                  maxWidth: "100%",
                  background: "#000",
                  border: "1px solid #000",
                }}
              >
                <img
                  src={appleLogo}
                  alt=""
                  aria-hidden="true"
                  className="w-4 h-4 block"
                  style={{ marginTop: -2 }}
                  draggable={false}
                />
                <span
                  className="text-white text-[14px] font-medium"
                  style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif" }}
                >
                  Sign in with Apple
                </span>
              </button>

            </div>

            {/* OR divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs uppercase tracking-widest text-white/40">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          </div>

          {/* Forgot: "sent" confirmation panel with throttled Resend */}
          {isForgot && resetSent ? (
            <div className="flex flex-col gap-3">
              <div
                className="rounded-xl px-4 py-3 text-sm text-white/80"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                Check your inbox (and spam folder). The reset link expires shortly for security.
              </div>

              <button
                type="button"
                onClick={() => sendResetEmail(true)}
                disabled={loading || resendCooldown > 0}
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
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Email"}
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={isForgot ? handleForgotSubmit : handleSubmit} className="flex flex-col gap-3">
              {isSignup && (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  autoComplete="username"
                  maxLength={20}
                  className="h-12 px-4 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--game-gold))]/40"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
              )}
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
              {!isForgot && (
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
              )}
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

              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => {
                    trackClick("click_forgot_password");
                    setError(null);
                    setPassword("");
                    setMode("forgot");
                  }}
                  className="self-end text-xs text-white/60 underline underline-offset-2 hover:text-[hsl(185_70%_55%)]"
                >
                  Forgot password?
                </button>
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
                {!isSignup && !isForgot && <LogIn className="w-5 h-5" />}
                {isForgot ? "Send Reset Link" : isSignup ? "Sign Up" : "Sign In"}
              </button>
            </form>
          )}

          {/* Toggle mode */}
          <p className="text-center text-xs text-white/50 mt-5">
            {isForgot ? (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setResetSent(false);
                  setResendCooldown(0);
                  setMode("signin");
                }}
                className="text-white/80 underline underline-offset-2 hover:text-[hsl(185_70%_55%)]"
              >
                Back to sign in
              </button>
            ) : (
              <>
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setConfirmPassword("");
                    setMode(isSignup ? "signin" : "signup");
                  }}
                  className="text-white/80 underline underline-offset-2 hover:text-[hsl(185_70%_55%)]"
                >
                  {isSignup ? "Sign in" : "Sign up"}
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
