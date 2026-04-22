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

// Prewarm: fetch + GPU-decode all mascot SVGs once at module load so the very
// first category swap paints synchronously, even on slower devices. Each decode
// is raced against a 2s timeout so a slow/failed image never blocks the others.
// Scheduled via requestIdleCallback (with setTimeout fallback) so prewarm doesn't
// compete with the Start screen's first paint.
if (typeof window !== "undefined") {
  const urls = [...Object.values(mascotByFilename), defaultMascot];

  const prewarmOne = (url: string): Promise<void> => {
    const img = new Image();
    img.src = url;
    const decodePromise: Promise<void> = img.decode
      ? img.decode().catch(() => {})
      : new Promise((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2000));
    return Promise.race([decodePromise, timeout]);
  };

  const runPrewarm = () => {
    void Promise.all(urls.map(prewarmOne));
  };

  type IdleWindow = Window & {
    requestIdleCallback?: (cb: () => void) => number;
  };
  const w = window as IdleWindow;
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(runPrewarm);
  } else {
    setTimeout(runPrewarm, 0);
  }
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
