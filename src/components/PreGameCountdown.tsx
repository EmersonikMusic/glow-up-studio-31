import { useEffect, useState } from "react";
import { useSound } from "@/hooks/useSound";

interface PreGameCountdownProps {
  background?: string;
  onComplete: () => void;
}

/**
 * Full-screen 3-2-1-Go! intro shown before a game starts (initial Start,
 * Play Again, and mid-game settings Apply). Each step lasts ~1s.
 */
export default function PreGameCountdown({ background, onComplete }: PreGameCountdownProps) {
  const [step, setStep] = useState(3); // 3 → 2 → 1 → 0 (Go!)
  const { play } = useSound();

  useEffect(() => {
    if (step > 0) play("tick");
    else play("reveal");

    const t = setTimeout(() => {
      if (step === 0) {
        onComplete();
      } else {
        setStep((s) => s - 1);
      }
    }, step === 0 ? 500 : 1000);

    return () => clearTimeout(t);
  }, [step, play, onComplete]);

  const label = step === 0 ? "Go!" : String(step);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: background || "hsl(var(--game-bg))",
        transition: "background 0.6s ease",
      }}
      aria-live="assertive"
      role="status"
    >
      <div
        key={step}
        className="rounded-full backdrop-blur-xl flex items-center justify-center animate-soft-zoom-in"
        style={{
          width: "clamp(180px, 32vw, 320px)",
          height: "clamp(180px, 32vw, 320px)",
          background: "rgba(0, 0, 0, 0.45)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 16px 64px rgba(0, 0, 0, 0.5)",
        }}
      >
        <span
          className="font-heading"
          style={{
            color: step === 0 ? "hsl(42 100% 65%)" : "hsl(0 0% 97%)",
            fontSize: "clamp(5rem, 14vw, 9rem)",
            lineHeight: 1,
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
