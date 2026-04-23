interface PauseOverlayProps {
  visible: boolean;
}

/**
 * Soft blur overlay shown when the game is paused. Sits inside the question
 * card area (parent must be position: relative).
 */
export default function PauseOverlay({ visible }: PauseOverlayProps) {
  if (!visible) return null;
  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl animate-fade-blur-in"
      style={{
        background: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
      aria-live="polite"
      role="status"
    >
      <div
        className="text-5xl sm:text-6xl font-heading font-extrabold tracking-wider"
        style={{
          color: "hsl(var(--game-gold))",
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          fontFamily: "'Fredoka One', 'Rubik', sans-serif",
        }}
      >
        Paused
      </div>
      <p className="mt-3 text-xs sm:text-sm font-body font-semibold uppercase tracking-widest text-white/80">
        Press <span className="hidden sm:inline">space or</span> tap play to resume
      </p>
    </div>
  );
}
