import { Megaphone, MegaphoneOff } from "lucide-react";
import { useReadAloud } from "@/hooks/useReadAloud";
import { trackToggle } from "@/lib/analytics";

interface ReadAloudToggleProps {
  className?: string;
}

export default function ReadAloudToggle({ className }: ReadAloudToggleProps) {
  const { enabled, toggle, supported } = useReadAloud();

  if (!supported) return null;

  const handleClick = () => {
    trackToggle("read_aloud", !enabled);
    toggle();
  };

  return (
    <button
      onClick={handleClick}
      className={`nav-btn flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-full transition-all duration-200 active:scale-95 ${className ?? ""}`}
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
      aria-label={enabled ? "Disable read aloud" : "Enable read aloud"}
      aria-pressed={enabled}
    >
      {enabled ? (
        <Megaphone className="nav-icon w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.25} />
      ) : (
        <MegaphoneOff className="nav-icon w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.25} />
      )}
    </button>
  );
}

