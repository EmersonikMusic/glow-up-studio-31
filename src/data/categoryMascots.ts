import { Category } from "./questions";
import defaultMascot from "@/assets/Mascot.svg";
import defaultMascotMarkup from "@/assets/Mascot.svg?raw";

/**
 * Category → mascot mapping.
 *
 * Two parallel maps:
 * - URL-based (existing) for Start/About/Result screens via <img>.
 * - Raw SVG markup for in-game inline rendering. Inline SVGs render in the
 *   same React commit as text/background — no <img> fetch/decode lag.
 */

const mascotUrlModules = import.meta.glob("../assets/mascots/*.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const mascotMarkupModules = import.meta.glob("../assets/mascots/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const mascotUrlByFilename: Record<string, string> = {};
for (const [path, url] of Object.entries(mascotUrlModules)) {
  const name = path.split("/").pop()?.replace(/\.svg$/, "");
  if (name) mascotUrlByFilename[name] = url;
}

const mascotMarkupByFilename: Record<string, string> = {};
for (const [path, markup] of Object.entries(mascotMarkupModules)) {
  const name = path.split("/").pop()?.replace(/\.svg$/, "");
  if (name) mascotMarkupByFilename[name] = markup;
}

function categoryToFilename(category: Category): string {
  return category
    .toLowerCase()
    .replace(/\s*&\s*/g, "-and-")
    .replace(/\s+/g, "-");
}

export function getMascotForCategory(category: Category): string {
  return mascotUrlByFilename[categoryToFilename(category)] ?? defaultMascot;
}

export function getMascotMarkupForCategory(category: Category): string {
  return mascotMarkupByFilename[categoryToFilename(category)] ?? defaultMascotMarkup;
}

export default getMascotForCategory;
