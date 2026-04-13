import { Category } from "./questions";
import defaultMascot from "@/assets/Mascot.svg";

/**
 * Category → mascot image mapping.
 *
 * To add a unique mascot for a category:
 *   1. Place the SVG/PNG in src/assets/mascots/
 *   2. Import it at the top of this file
 *   3. Map it to the category key below
 *
 * Any category without an explicit entry falls back to the default mascot.
 */

// import artMascot from "@/assets/mascots/mascot-art.svg";
// import historyMascot from "@/assets/mascots/mascot-history.svg";

const categoryMascots: Partial<Record<Category, string>> = {
  // Art: artMascot,
  // History: historyMascot,
  // Science: scienceMascot,
  // Geography: geographyMascot,
  // ... add more as mascot assets are created
};

export function getMascotForCategory(category: Category): string {
  return categoryMascots[category] ?? defaultMascot;
}

export default categoryMascots;
