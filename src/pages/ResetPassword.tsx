import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackClick } from "@/lib/analytics";

type Status = "form" | "success" | "invalid";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>("form");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setHasRecoverySession(true);
      } else if (session) {
        setHasRecoverySession(true);
      }
    });

    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      setHasRecoverySession((prev) => prev ?? !!data.session);
    }, 400);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        return;
      }
      trackClick("password_reset_success");
      toast.success("Password updated.");
      setStatus("success");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    trackClick("click_continue_after_reset");
    await supabase.auth.signOut();
    navigate("/");
  };

  // Effective view: invalid link overrides form; success is set explicitly.
  const view: Status = status === "success"
    ? "success"
    : hasRecoverySession === false
      ? "invalid"
      : "form";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[hsl(240_45%_10%)]">
      <div
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-8"
        style={{
          background: "rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
      >
        <h1
          className="text-center font-heading font-extrabold uppercase leading-none tracking-tight text-3xl md:text-4xl"
          style={{
            background:
              "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.05,
          }}
        >
          {view === "success" ? "Password Updated" : "Reset Password"}
        </h1>
        <p className="text-center text-sm text-white/60 mt-1 mb-6">
          {view === "success"
            ? "You're all set — sign in with your new password."
            : view === "invalid"
              ? "This reset link is invalid or has expired."
              : "Choose a new password for your account"}
        </p>

        {view === "success" ? (
          <div className="flex flex-col items-center gap-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "hsl(185 70% 55% / 0.15)",
                border: "1px solid hsl(185 70% 55% / 0.35)",
              }}
            >
              <CheckCircle2 className="w-8 h-8" style={{ color: "hsl(185 70% 55%)" }} strokeWidth={2.25} />
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="w-full min-h-14 py-2 px-10 rounded-full border-2 border-[#221948] whitespace-nowrap
                bg-[linear-gradient(0deg,#e93e3a_0%,#ed683c_11%,#f3903f_33%,#fdc70c_72%,#fff33b_100%)]
                text-white text-xl font-heading font-extrabold tracking-[0.18em] uppercase
                shadow-lg shadow-black/30 active:scale-95"
              style={{
                textShadow: "0 2px 3px rgba(87,33,91,0.6)",
                fontFamily: "'Fredoka One', 'Rubik', sans-serif",
              }}
            >
              Continue to Sign In
            </button>
          </div>
        ) : view === "invalid" ? (
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="min-h-12 py-2 px-8 rounded-full border-2 border-[#221948]
                bg-[linear-gradient(0deg,#e93e3a_0%,#ed683c_11%,#f3903f_33%,#fdc70c_72%,#fff33b_100%)]
                text-white font-heading font-extrabold tracking-[0.18em] uppercase
                shadow-lg shadow-black/30 active:scale-95"
            >
              Back to home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                autoComplete="new-password"
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
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="w-full h-12 px-4 pr-12 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--game-gold))]/40"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading || hasRecoverySession === null}
              className="mt-3 min-h-14 py-2 px-10 rounded-full border-2 border-[#221948] whitespace-nowrap
                bg-[linear-gradient(0deg,#e93e3a_0%,#ed683c_11%,#f3903f_33%,#fdc70c_72%,#fff33b_100%)]
                text-white text-xl font-heading font-extrabold tracking-[0.18em] uppercase
                shadow-lg shadow-black/30 transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
              style={{
                textShadow: "0 2px 3px rgba(87,33,91,0.6)",
                fontFamily: "'Fredoka One', 'Rubik', sans-serif",
              }}
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
