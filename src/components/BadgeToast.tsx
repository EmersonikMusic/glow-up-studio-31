import { Sparkles, Target, Hourglass, Compass, Puzzle, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import type { Badge } from "@/data/badgeData";

const GOLD_GRADIENT =
  "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)";

function iconFor(badgeType: string) {
  switch (badgeType) {
    case "Progression & Consistency":
      return Sparkles;
    case "Mode & Difficulty Mastery":
      return Target;
    case "Time Travelers (Eras)":
      return Hourglass;
    case "Category Specialists":
      return Compass;
    case "Custom Combo Games":
      return Puzzle;
    default:
      return Trophy;
  }
}

interface BadgeToastProps {
  id: string | number;
  badge: Badge;
}

export default function BadgeToast({ id, badge }: BadgeToastProps) {
  const Icon = iconFor(badge.badgeType);
  return (
    <div
      role="status"
      className="relative flex items-center gap-3 w-[340px] max-w-[92vw] rounded-2xl pl-3 pr-9 py-3"
      style={{
        background: "rgba(15, 15, 35, 0.92)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(253, 199, 12, 0.4)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(253,199,12,0.15) inset",
      }}
    >
      <div
        className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: GOLD_GRADIENT,
          border: "2px solid rgba(255,255,255,0.35)",
          boxShadow: "0 4px 16px rgba(253,199,12,0.4)",
        }}
      >
        <Icon className="w-7 h-7" style={{ color: "hsl(240 45% 10%)" }} strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[10px] font-body font-bold uppercase tracking-widest mb-0.5"
          style={{ color: "hsl(185 70% 60%)" }}
        >
          Badge Unlocked
        </div>
        <div className="text-sm font-subheading font-bold text-white leading-tight truncate">
          {badge.badgeName}
        </div>
        <div className="text-[11px] font-body text-white/60 leading-snug line-clamp-2 mt-0.5">
          {badge.requirement}
        </div>
      </div>
      <button
        type="button"
        onClick={() => toast.dismiss(id)}
        aria-label="Dismiss"
        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 active:scale-95"
      >
        <X className="w-3.5 h-3.5 text-white/70" />
      </button>
    </div>
  );
}
