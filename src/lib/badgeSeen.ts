/**
 * Per-device tracker of badge IDs the user has "seen" (acknowledged by
 * opening their profile). Used to drive the "new badge" indicators on the
 * nav pill and on individual badge tiles.
 */
import { safeStorageGet, safeStorageSet } from "@/lib/browserCompat";
import { BADGES } from "@/data/badgeData";

const KEY = "to.badges.seen";
const SEEN_EVENT = "to:badges-seen-changed";

function read(): Set<string> {
  const raw = safeStorageGet(KEY);
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

function write(ids: Set<string>) {
  safeStorageSet(KEY, JSON.stringify([...ids]));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SEEN_EVENT));
  }
}

export function getUnseen(unlockedIds: string[]): string[] {
  const seen = read();
  return unlockedIds.filter((id) => !seen.has(id));
}

export function markAllSeen(unlockedIds: string[]) {
  const seen = read();
  let changed = false;
  for (const id of unlockedIds) {
    if (!seen.has(id)) {
      seen.add(id);
      changed = true;
    }
  }
  if (changed) write(seen);
}

/** Convert badge names (as stored in profiles.unlocked_badges) to badge IDs. */
export function badgeNamesToIds(names: string[] | null | undefined): string[] {
  if (!names?.length) return [];
  const set = new Set(names);
  return BADGES.filter((b) => set.has(b.badgeName)).map((b) => b.id);
}

export { SEEN_EVENT };
