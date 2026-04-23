import { useMemo, useEffect } from "react";
import type { Category } from "@/data/questions";
import { getMascotMarkupForCategory } from "@/data/categoryMascots";
import { recordMascotSwap } from "@/lib/mascotDebug";

export type MascotState = "idle" | "celebrate" | "urgent" | "paused";

interface MascotSvgProps {
  category: Category;
  className?: string;
  ariaLabel?: string;
  state?: MascotState;
}

const stateClass: Record<MascotState, string> = {
  idle: "",
  celebrate: "animate-mascot-bounce",
  urgent: "animate-mascot-wobble",
  paused: "",
};

/**
 * Renders the category's mascot as inline SVG with reactive state-driven
 * micro-animations (celebrate / urgent / paused).
 */
export default function MascotSvg({ category, className, ariaLabel, state = "idle" }: MascotSvgProps) {
  const markup = useMemo(() => {
    const raw = getMascotMarkupForCategory(category);
    return raw
      .replace(/<svg([^>]*)>/i, (_match, attrs: string) => {
        let next = attrs;
        next = next.replace(/\s(width|height)="[^"]*"/gi, "");
        next = next.replace(/\spreserveAspectRatio="[^"]*"/gi, "");
        return `<svg${next} preserveAspectRatio="xMidYMax meet" width="100%" height="100%">`;
      });
  }, [category]);

  useEffect(() => {
    recordMascotSwap(category, "inline");
  }, [category]);

  return (
    <div
      className={`${className ?? ""} ${stateClass[state]}`}
      role="img"
      aria-label={ariaLabel ?? "TrivOlivia mascot"}
      dangerouslySetInnerHTML={{ __html: markup }}
      style={{ transformOrigin: "bottom center" }}
    />
  );
}
