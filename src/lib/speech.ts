/**
 * Browser Web Speech API wrapper for "read aloud" question + answer playback.
 *
 * Zero network cost, zero dependencies — uses window.speechSynthesis.
 * Preference is persisted to localStorage (default: OFF).
 */

import { safeStorageGet, safeStorageSet } from "@/lib/browserCompat";

const STORAGE_KEY = "to.readaloud.enabled";
export const READ_ALOUD_EVENT = "to:read-aloud-changed";

let enabled = false;

if (typeof window !== "undefined") {
  const stored = safeStorageGet(STORAGE_KEY);
  enabled = stored === "1";
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";
}

export function isReadAloudEnabled(): boolean {
  return enabled;
}

export function setReadAloudEnabled(next: boolean) {
  enabled = next;
  if (typeof window !== "undefined") {
    safeStorageSet(STORAGE_KEY, next ? "1" : "0");
    window.dispatchEvent(new CustomEvent(READ_ALOUD_EVENT));
    if (!next) cancelSpeech();
  }
}

export function toggleReadAloud(): boolean {
  setReadAloudEnabled(!enabled);
  return enabled;
}

export function cancelSpeech() {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}

export function speak(text: string) {
  if (!enabled || !isSpeechSupported() || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  } catch {
    // ignore — speech is a non-critical enhancement
  }
}
