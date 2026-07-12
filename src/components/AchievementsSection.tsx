import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BADGES, type Badge } from "@/data/badgeData";
import BadgeItem from "./BadgeItem";

interface AchievementsSectionProps {
  // Newest-earned first. (Until per-badge timestamps exist, caller controls order.)
  unlockedIds: string[];
}

const COLLAPSED_LIMIT = 6;

export default function AchievementsSection({ unlockedIds }: AchievementsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const unlockedBadges = useMemo<Badge[]>(() => {
    const byId = new Map(BADGES.map((b) => [b.id, b]));
    const out: Badge[] = [];
    const seen = new Set<string>();
    for (const id of unlockedIds) {
      const b = byId.get(id);
      if (b && !seen.has(b.id)) {
        seen.add(b.id);
        out.push(b);
      }
    }
    return out;
  }, [unlockedIds]);

  if (unlockedBadges.length === 0) {
    return (
      <div
        className="rounded-xl px-4 py-6 text-center text-xs font-body text-white/60"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px dashed rgba(255,255,255,0.12)",
        }}
      >
        Play a game to earn your first badge.
      </div>
    );
  }

  const hasMore = unlockedBadges.length > COLLAPSED_LIMIT;
  const visible = expanded || !hasMore ? unlockedBadges : unlockedBadges.slice(0, COLLAPSED_LIMIT);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {visible.map((badge) => (
          <BadgeItem
            key={badge.id}
            badge={badge}
            unlocked
            flipped={flippedId === badge.id}
            onFlipChange={(v) => setFlippedId((cur) => (v ? badge.id : cur === badge.id ? null : cur))}
          />
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-body font-bold uppercase tracking-widest text-white/80 active:scale-95 transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              View all {unlockedBadges.length} <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
