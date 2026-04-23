import { useEffect, useState } from "react";
import { Vibrate, VibrateOff } from "lucide-react";
import { isHapticsEnabled, isHapticsSupported, toggleHaptics, vibrate } from "@/lib/haptics";

interface HapticsToggleProps {
  className?: string;
}

/**
 * Mobile-only haptics toggle. Hidden on devices without vibrate support.
 */
export default function HapticsToggle({ className }: HapticsToggleProps) {
  const [enabled, setEnabled] = useState(isHapticsEnabled());
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isHapticsSupported());
  }, []);

  if (!supported) return null;

  const handleClick = () => {
    const next = toggleHaptics();
    setEnabled(next);
    if (next) vibrate(20); // Confirmation buzz.
  };

  return (
    <button
      onClick={handleClick}
      className={`nav-btn sm:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 ${className ?? ""}`}
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
      aria-label={enabled ? "Disable haptics" : "Enable haptics"}
    >
      {enabled ? (
        <Vibrate className="nav-icon w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.25} />
      ) : (
        <VibrateOff className="nav-icon w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.25} />
      )}
    </button>
  );
}
