export function safeMatchMedia(query: string): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }

  try {
    return window.matchMedia(query);
  } catch {
    return null;
  }
}

export function matchesMedia(query: string, fallback = false): boolean {
  const result = safeMatchMedia(query);
  return result ? result.matches : fallback;
}

export function safeStorageGet(key: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeStorageSet(key: string, value: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures on restricted/legacy browsers.
  }
}

export function createSafeId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // Fall through to timestamp-based id.
  }

  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}