/**
 * Lightweight Web Audio sound layer.
 *
 * Sounds are SYNTHESIZED on the fly (no asset files) so they ship with zero
 * network cost, work offline, and stay perfectly in sync with gameplay.
 * Each "sound" is a short envelope-shaped tone or chord designed to feel
 * gentle, on-brand (gameshow-meets-educational), and never abrasive.
 */

export type SoundName = "tick" | "reveal" | "transition" | "start" | "complete";

const STORAGE_KEY = "to.sound.muted";
const VOLUME = 0.35;

let ctx: AudioContext | null = null;
let muted = true; // default OFF until user opts in

// Read persisted mute state on first import (browser only).
if (typeof window !== "undefined") {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  // If never set, default to muted (true). User must opt in.
  muted = stored === null ? true : stored === "1";
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  // Some browsers suspend the context until a user gesture.
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function envTone(
  c: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  peak: number = 0.6,
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  // Quick attack, smooth decay — avoids clicks.
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak * VOLUME, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

function noiseSwoosh(c: AudioContext, start: number, dur: number) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(800, start);
  filter.frequency.exponentialRampToValueAtTime(2400, start + dur);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.25 * VOLUME, start + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start(start);
  src.stop(start + dur + 0.05);
}

export function play(name: SoundName) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;

  switch (name) {
    case "tick":
      envTone(c, 880, t, 0.08, "triangle", 0.5);
      break;
    case "reveal":
      // Gentle 2-note chime: E5 → A5
      envTone(c, 659.25, t, 0.35, "sine", 0.55);
      envTone(c, 880.0, t + 0.08, 0.45, "sine", 0.5);
      break;
    case "transition":
      noiseSwoosh(c, t, 0.28);
      break;
    case "start":
      // Uplifting 3-note arpeggio C5 → E5 → G5
      envTone(c, 523.25, t, 0.22, "triangle", 0.55);
      envTone(c, 659.25, t + 0.12, 0.22, "triangle", 0.55);
      envTone(c, 783.99, t + 0.24, 0.45, "triangle", 0.6);
      break;
    case "complete":
      // Short fanfare: C5, E5, G5, C6
      envTone(c, 523.25, t, 0.18, "triangle", 0.6);
      envTone(c, 659.25, t + 0.12, 0.18, "triangle", 0.6);
      envTone(c, 783.99, t + 0.24, 0.18, "triangle", 0.6);
      envTone(c, 1046.5, t + 0.36, 0.6, "triangle", 0.7);
      break;
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }
  if (!next) {
    // First unmute may need a user gesture to unlock the context.
    getCtx();
  }
}

export function toggleMuted(): boolean {
  setMuted(!muted);
  return muted;
}
