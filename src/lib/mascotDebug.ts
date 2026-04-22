/**
 * Lightweight pub/sub timing store for mascot swap diagnostics.
 *
 * Records, per category, the path used (inline | img) and the swap latency in
 * milliseconds — measured from when the category was first requested for
 * render to the next animation frame paint.
 */

export type MascotPath = "inline" | "img";

export interface MascotTiming {
  category: string;
  path: MascotPath;
  /** ms between request and next paint */
  swapMs: number;
  /** total uses observed */
  count: number;
  lastAt: number;
}

const store = new Map<string, MascotTiming>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function recordMascotSwap(category: string, path: MascotPath) {
  const start = performance.now();
  requestAnimationFrame(() => {
    const swapMs = performance.now() - start;
    const existing = store.get(category);
    store.set(category, {
      category,
      path,
      swapMs: existing
        ? Math.max(existing.swapMs, swapMs) // keep worst-case
        : swapMs,
      count: (existing?.count ?? 0) + 1,
      lastAt: Date.now(),
    });
    emit();
  });
}

export function getMascotTimings(): MascotTiming[] {
  return Array.from(store.values()).sort((a, b) => b.lastAt - a.lastAt);
}

export function clearMascotTimings() {
  store.clear();
  emit();
}

export function subscribeMascotTimings(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
