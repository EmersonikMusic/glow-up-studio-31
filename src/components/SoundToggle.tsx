import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/hooks/useSound";

interface SoundToggleProps {
  className?: string;
}

export default function SoundToggle({ className }: SoundToggleProps) {
  const { muted, toggle, play } = useSound();

  const handleClick = () => {
    const wasMuted = muted;
    toggle();
    // Confirmation chime when un-muting (after the state is committed).
    if (wasMuted) {
      // Small delay so the AudioContext has resumed.
      setTimeout(() => play("tick"), 50);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`nav-btn flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-full transition-all duration-200 active:scale-95 ${className ?? ""}`}
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
      aria-label={muted ? "Enable sound" : "Mute sound"}
    >
      {muted ? (
        <VolumeX className="nav-icon w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.25} />
      ) : (
        <Volume2 className="nav-icon w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.25} />
      )}
    </button>
  );
}
