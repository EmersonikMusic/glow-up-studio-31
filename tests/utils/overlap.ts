import type { Locator, Page } from "@playwright/test";

export type Rect = { x: number; y: number; width: number; height: number };

/** Two axis-aligned rectangles overlap if they intersect on both axes. */
export function rectsOverlap(a: Rect, b: Rect, tolerance = 0): boolean {
  const aRight = a.x + a.width - tolerance;
  const aBottom = a.y + a.height - tolerance;
  const bRight = b.x + b.width - tolerance;
  const bBottom = b.y + b.height - tolerance;
  return !(
    aRight <= b.x + tolerance ||
    bRight <= a.x + tolerance ||
    aBottom <= b.y + tolerance ||
    bBottom <= a.y + tolerance
  );
}

export function rectsDoNotOverlap(a: Rect, b: Rect, tolerance = 0): boolean {
  return !rectsOverlap(a, b, tolerance);
}

/** Returns true iff the rect is fully inside the given viewport. */
export function rectInsideViewport(
  rect: Rect,
  viewportWidth: number,
  viewportHeight: number,
  tolerance = 1,
): boolean {
  return (
    rect.x >= -tolerance &&
    rect.y >= -tolerance &&
    rect.x + rect.width <= viewportWidth + tolerance &&
    rect.y + rect.height <= viewportHeight + tolerance
  );
}

/** Safe boundingBox: returns null if locator missing or detached. */
export async function safeBox(locator: Locator): Promise<Rect | null> {
  const count = await locator.count();
  if (count === 0) return null;
  try {
    const box = await locator.first().boundingBox();
    return box ?? null;
  } catch {
    return null;
  }
}

export type OverlapCheck = {
  name: string;
  a: string;
  b: string;
  pass: boolean;
  detail?: string;
};

export type BoundsCheck = {
  name: string;
  pass: boolean;
  detail?: string;
};

export async function collectRects(
  page: Page,
): Promise<Record<string, Rect | null>> {
  return {
    header: await safeBox(page.locator("header").first()),
    card: await safeBox(page.locator('[data-testid="question-card"]')),
    mobileMascot: await safeBox(page.locator(".mobile-mascot-overlay")),
    desktopMascot: await safeBox(page.locator('[data-testid="desktop-mascot"]')),
    footer: await safeBox(page.locator("footer").first()),
  };
}
