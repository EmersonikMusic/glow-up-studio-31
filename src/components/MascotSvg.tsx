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
 *
 * Also namespaces .cls-* class names. Mascot SVGs (Adobe Illustrator exports)
 * include a <style> block like `.cls-6 { fill: url(#linear-gradient-4) }`.
 * Both inline copies inject their own <style>; both rules match every .cls-6
 * element in the document and the later block wins the cascade. After id-only
 * namespacing each block's url(#...) still resolves to its own gradients, but
 * the visible copy's elements end up styled by the hidden copy's rules — so
 * their fills point into a display:none subtree and render transparent.
 */
function namespaceSvgIds(markup: string, uid: string): string {
  let out = markup;

  // 1) Namespace ids and id-references (url(#id), href="#id", xlink:href).
  const ids = new Set<string>();
  const idRe = /\sid="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = idRe.exec(markup)) !== null) ids.add(m[1]);
  for (const id of ids) {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const newId = `${id}__${uid}`;
    out = out
      .replace(new RegExp(`id="${esc}"`, "g"), `id="${newId}"`)
      .replace(new RegExp(`url\\(#${esc}\\)`, "g"), `url(#${newId})`)
      .replace(new RegExp(`href="#${esc}"`, "g"), `href="#${newId}"`)
      .replace(new RegExp(`xlink:href="#${esc}"`, "g"), `xlink:href="#${newId}"`);
  }

  // 2) Namespace .cls-* class names in <style> selectors AND class="..." attrs.
  const classNames = new Set<string>();
  const classAttrRe = /class="([^"]+)"/g;
  while ((m = classAttrRe.exec(markup)) !== null) {
    for (const c of m[1].split(/\s+/)) {
      if (/^cls-\d+$/.test(c)) classNames.add(c);
    }
  }
  const styleSelectorRe = /\.(cls-\d+)\b/g;
  while ((m = styleSelectorRe.exec(markup)) !== null) classNames.add(m[1]);

  for (const cn of classNames) {
    const newCn = `${cn}__${uid}`;
    out = out.replace(new RegExp(`\\.${cn}\\b`, "g"), `.${newCn}`);
    out = out.replace(
      new RegExp(`(class="[^"]*?\\b)${cn}(\\b[^"]*?")`, "g"),
      `$1${newCn}$2`
    );
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
