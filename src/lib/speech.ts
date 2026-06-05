/**
 * Browser Web Speech API wrapper for "read aloud" question + answer playback.
 *
 * Zero network cost, zero dependencies — uses window.speechSynthesis.
 * Preference is persisted to localStorage (default: OFF).
 * Picks a female English voice by default when available.
 */

import { safeStorageGet, safeStorageSet } from "@/lib/browserCompat";

const STORAGE_KEY = "to.readaloud.enabled";
export const READ_ALOUD_EVENT = "to:read-aloud-changed";

let enabled = false;
let selectedVoice: SpeechSynthesisVoice | null = null;
let voicesInitialized = false;

if (typeof window !== "undefined") {
  const stored = safeStorageGet(STORAGE_KEY);
  enabled = stored === "1";
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";
}

// Common female voice names across macOS/iOS, Windows, Android, Linux.
const FEMALE_NAME_HINTS = [
  "samantha", "victoria", "karen", "tessa", "moira", "fiona", "zira",
  "hazel", "catherine", "linda", "heather", "susan", "allison", "ava",
  "serena", "kate", "emily", "joanna", "salli", "kimberly", "amy",
  "female", "woman",
];

// Known male voice names to exclude when matching ambiguous strings.
const MALE_NAME_HINTS = [
  "male", "man", "david", "mark", "daniel", "alex", "fred", "tom",
  "george", "james", "oliver", "aaron", "arthur", "diego", "jorge",
];

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  let voices: SpeechSynthesisVoice[] = [];
  try {
    voices = window.speechSynthesis.getVoices() || [];
  } catch {
    return null;
  }
  if (!voices.length) return null;

  const en = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
  const pool = en.length ? en : voices;

  const isMale = (name: string) => MALE_NAME_HINTS.some((h) => name.includes(h));

  // 1. Explicit female-name match
  const byName = pool.find((v) => {
    const n = v.name.toLowerCase();
    if (isMale(n)) return false;
    return FEMALE_NAME_HINTS.some((h) => n.includes(h));
  });
  if (byName) return byName;

  // 2. Fallback: any en-US voice
  const enUs = pool.find((v) => v.lang && v.lang.toLowerCase() === "en-us");
  if (enUs) return enUs;

  // 3. Fallback: first English voice, else first voice
  return pool[0] || null;
}

function initVoices() {
  if (voicesInitialized || !isSpeechSupported()) return;
  selectedVoice = pickFemaleVoice();
  try {
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      selectedVoice = pickFemaleVoice();
    });
  } catch {
    // ignore
  }
  voicesInitialized = true;
}

if (typeof window !== "undefined" && isSpeechSupported()) {
  initVoices();
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
    if (!selectedVoice) selectedVoice = pickFemaleVoice();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    if (selectedVoice) {
      u.voice = selectedVoice;
      u.lang = selectedVoice.lang || "en-US";
    } else {
      u.lang = "en-US";
    }
    window.speechSynthesis.speak(u);
  } catch {
    // ignore — speech is a non-critical enhancement
  }
}
