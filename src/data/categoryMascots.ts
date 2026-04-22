import { Category } from "./questions";
import defaultMascot from "@/assets/Mascot.svg";

/**
 * Category → mascot image mapping.
 *
 * SVGs in src/assets/mascots/ are bundled automatically via import.meta.glob.
 * Filename convention: lowercase category, " & " → "-and-", spaces → "-".
 *   "Art"          → art.svg
 *   "Food & Drink" → food-and-drink.svg
 *   "Pop Culture"  → pop-culture.svg
 *   "Video Games"  → video-games.svg
 *
 * Categories without a matching file fall back to the default mascot.
 */

const mascotModules = import.meta.glob("../assets/mascots/*.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

// Build a filename → url lookup (e.g. "art" → "/assets/art-abc123.svg")
const mascotByFilename: Record<string, string> = {};
for (const [path, url] of Object.entries(mascotModules)) {
  const name = path.split("/").pop()?.replace(/\.svg$/, "");
  if (name) mascotByFilename[name] = url;
}

// Preload all mascot SVGs once at module load so the browser caches them
// before the first category swap. Eliminates first-paint lag during gameplay.
if (typeof window !== "undefined") {
  for (const url of Object.values(mascotByFilename)) {
    const img = new Image();
    img.src = url;
  }
  // Also preload the default fallback.
  const fallback = new Image();
  fallback.src = defaultMascot;
}

function categoryToFilename(category: Category): string {
  return category
    .toLowerCase()
    .replace(/\s*&\s*/g, "-and-")
    .replace(/\s+/g, "-");
}

export function getMascotForCategory(category: Category): string {
  return mascotByFilename[categoryToFilename(category)] ?? defaultMascot;
}

export default getMascotForCategory;
