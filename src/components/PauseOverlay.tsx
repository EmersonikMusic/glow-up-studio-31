interface PauseOverlayProps {
  visible: boolean;
}

/**
 * Dim overlay shown when the game is paused. Sits inside the question card
 * area (parent must be position: relative). No blur — just dimming.
 */
export default function PauseOverlay({ visible }: PauseOverlayProps) {
  if (!visible) return null;
  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-between rounded-2xl animate-fade-blur-in"
      style={{
        background: "rgba(0, 0, 0, 0.45)",
        paddingTop: "28px",
        paddingBottom: "28px",
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
      <p className="text-xs sm:text-sm font-body font-semibold uppercase tracking-widest text-white/80 text-center px-4">
        Press space or start button to resume
      </p>
    </div>
  );
}
