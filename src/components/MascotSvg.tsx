import { useId, useMemo, useEffect } from "react";
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
 * Namespace every id="..." in the SVG markup with a unique suffix, and rewrite
 * all url(#id), href="#id", and xlink:href="#id" references to match.
 *
 * Why: mascot SVGs are inlined twice in TriviaGame (mobile + desktop columns),
 * and their internal ids (linear-gradient, linear-gradient-2, ...) collide.
 * Browsers resolve url(#id) to the first match in document order, which on
 * desktop points into the display:none mobile copy — paint servers inside
 * display:none subtrees often don't render, producing transparent fills.
 */
function namespaceSvgIds(markup: string, uid: string): string {
  const ids = new Set<string>();
  const idRe = /\sid="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = idRe.exec(markup)) !== null) ids.add(m[1]);
  if (ids.size === 0) return markup;

  let out = markup;
  for (const id of ids) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const newId = `${id}__${uid}`;
    out = out
      .replace(new RegExp(`id="${esc}"`, "g"), `id="${newId}"`)
      .replace(new RegExp(`url\\(#${esc}\\)`, "g"), `url(#${newId})`)
      .replace(new RegExp(`href="#${esc}"`, "g"), `href="#${newId}"`)
      .replace(new RegExp(`xlink:href="#${esc}"`, "g"), `xlink:href="#${newId}"`);
  }
  return out;
}

/**
 * Renders the category's mascot as inline SVG with reactive state-driven
 * micro-animations (celebrate / urgent / paused).
 */
export default function MascotSvg({ category, className, ariaLabel, state = "idle" }: MascotSvgProps) {
  const reactId = useId();
  const uid = useMemo(() => reactId.replace(/[^a-zA-Z0-9_-]/g, ""), [reactId]);

  const markup = useMemo(() => {
    const raw = getMascotMarkupForCategory(category);
    const sized = raw.replace(/<svg([^>]*)>/i, (_match, attrs: string) => {
      let next = attrs;
      next = next.replace(/\s(width|height)="[^"]*"/gi, "");
      next = next.replace(/\spreserveAspectRatio="[^"]*"/gi, "");
      return `<svg${next} preserveAspectRatio="xMidYMax meet" width="100%" height="100%">`;
    });
    return namespaceSvgIds(sized, uid);
  }, [category, uid]);

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
