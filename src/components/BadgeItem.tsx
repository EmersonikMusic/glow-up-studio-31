import { useState } from "react";
import { Trophy, Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Badge } from "@/data/badgeData";

const GOLD_GRADIENT =
  "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)";

interface BadgeItemProps {
  badge: Badge;
  unlocked: boolean;
}

export default function BadgeItem({ badge, unlocked }: BadgeItemProps) {
  const [tapOpen, setTapOpen] = useState(false);

  const circle = (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
      style={{
        background: unlocked ? GOLD_GRADIENT : "rgba(255,255,255,0.06)",
        border: unlocked
          ? "2px solid rgba(255,255,255,0.35)"
          : "2px solid rgba(255,255,255,0.1)",
        boxShadow: unlocked ? "0 4px 20px rgba(253,199,12,0.35)" : "none",
        opacity: unlocked ? 1 : 0.45,
        filter: unlocked ? "none" : "grayscale(1)",
      }}
    >
      {unlocked ? (
        <Trophy className="w-7 h-7" style={{ color: "hsl(240 45% 10%)" }} strokeWidth={2.5} />
      ) : (
        <Lock className="w-6 h-6 text-white/60" />
      )}
    </div>
  );

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
        {circle}
        {label}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={tapOpen || undefined} onOpenChange={setTapOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="flex flex-col items-center gap-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg"
            onClick={() => setTapOpen((v) => !v)}
            aria-label={`${badge.badgeName}: ${badge.requirement}`}
          >
            {circle}
            {label}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px]">
          <div className="text-xs font-bold mb-0.5">{badge.badgeName}</div>
          <div className="text-[11px] text-muted-foreground leading-snug">
            {badge.requirement}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
