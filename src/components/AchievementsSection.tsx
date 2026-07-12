import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { BADGES, type Badge } from "@/data/badgeData";
import BadgeItem from "./BadgeItem";

interface AchievementsSectionProps {
  // Newest-earned first. (Until per-badge timestamps exist, caller controls order.)
  unlockedIds: string[];
}

export default function AchievementsSection({ unlockedIds }: AchievementsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [flippedId, setFlippedId] = useState<string | null>(null);


  const { unlockedBadges, lockedFillers } = useMemo(() => {
    const byId = new Map(BADGES.map((b) => [b.id, b]));
    const unlocked: Badge[] = [];
    for (const id of unlockedIds) {
      const b = byId.get(id);
      if (b && !unlocked.find((u) => u.id === b.id)) unlocked.push(b);
    }

    let fillers: Badge[] = [];
    if (unlocked.length < 3) {
      const unlockedSet = new Set(unlocked.map((b) => b.id));
      const progression = BADGES.filter(
        (b) => b.badgeType === "Progression & Consistency" && !unlockedSet.has(b.id),
      ).sort((a, b) => {
        // tier 0 goes last; otherwise ascending
        const at = a.tier === 0 ? 99 : a.tier;
        const bt = b.tier === 0 ? 99 : b.tier;
        return at - bt;
      });
      fillers = progression.slice(0, 3 - unlocked.length);
    }

    return { unlockedBadges: unlocked, lockedFillers: fillers };
  }, [unlockedIds]);

  const hasMore = unlockedBadges.length > 3;
  const visibleUnlocked = expanded || !hasMore ? unlockedBadges : unlockedBadges.slice(0, 3);
  const items = [
    ...visibleUnlocked.map((b) => ({ badge: b, unlocked: true })),
    ...lockedFillers.map((b) => ({ badge: b, unlocked: false })),
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {items.map(({ badge, unlocked }) => (
          <BadgeItem
            key={badge.id}
            badge={badge}
            unlocked={unlocked}
            flipped={flippedId === badge.id}
            onFlipChange={(v) => setFlippedId(v ? badge.id : (cur) => (cur === badge.id ? null : cur) as any)}
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
              View more <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
