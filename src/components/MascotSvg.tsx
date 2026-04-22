import { useMemo, useEffect } from "react";
import type { Category } from "@/data/questions";
import { getMascotMarkupForCategory } from "@/data/categoryMascots";
import { recordMascotSwap } from "@/lib/mascotDebug";

interface MascotSvgProps {
  category: Category;
  className?: string;
  ariaLabel?: string;
}

/**
 * Renders the category's mascot as inline SVG.
 *
 * - Strips fixed width/height on the root <svg> so CSS controls sizing.
 * - Forces preserveAspectRatio="xMidYMax meet" so the mascot's body is
 *   always bottom-aligned within the container — guarantees the turquoise
 *   circle hugs the lower body identically across all 25 SVGs.
 *
 * Inline rendering avoids the <img> fetch/decode lifecycle, so the swap
 * commits in the same paint frame as text/background updates.
 */
export default function MascotSvg({ category, className, ariaLabel }: MascotSvgProps) {
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
      className={className}
      role="img"
      aria-label={ariaLabel ?? "TrivOlivia mascot"}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
