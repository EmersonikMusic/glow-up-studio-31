import { Trophy, Lock } from "lucide-react";
import type { Badge } from "@/data/badgeData";

const GOLD_GRADIENT =
  "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)";

interface BadgeItemProps {
  badge: Badge;
  unlocked: boolean;
  flipped?: boolean;
  onFlipChange?: (flipped: boolean) => void;
}

export default function BadgeItem({ badge, unlocked, flipped = false, onFlipChange }: BadgeItemProps) {
  const label = (
    <span
      className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight text-center"
      style={{ color: unlocked ? "#fff" : "hsl(var(--muted-foreground))" }}
    >
      {badge.badgeName}
    </span>
  );

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "2px solid rgba(255,255,255,0.1)",
            opacity: 0.45,
            filter: "grayscale(1)",
          }}
        >
          <Lock className="w-7 h-7 text-white/60" />
        </div>
        {label}
      </div>
    );
  }

  const toggle = () => onFlipChange?.(!flipped);
  const setFlip = (v: boolean) => onFlipChange?.(v);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <button
        type="button"
        onClick={toggle}
        onMouseEnter={() => setFlip(true)}
        onMouseLeave={() => setFlip(false)}
        aria-pressed={flipped}
        aria-label={`${badge.badgeName}: ${badge.requirement}`}
        className="relative w-20 h-20 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{ perspective: "600px" }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: GOLD_GRADIENT,
              border: "2px solid rgba(255,255,255,0.35)",
              boxShadow: "0 4px 20px rgba(253,199,12,0.35)",
            }}
          >
            <Trophy className="w-8 h-8" style={{ color: "hsl(240 45% 10%)" }} strokeWidth={2.5} />
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center px-2"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "rgba(0,0,0,0.55)",
              border: "1.5px solid rgba(253,199,12,0.5)",
              boxShadow: "inset 0 0 12px rgba(253,199,12,0.15)",
            }}
          >
            <span
              className="text-[9px] font-body font-semibold leading-tight text-center text-white"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {badge.requirement}
            </span>
          </div>
        </div>
      </button>
      {label}
    </div>
  );
}
