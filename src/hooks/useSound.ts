import { useCallback, useEffect, useState } from "react";
import { isMuted, MUTE_EVENT, play, setMuted, type SoundName } from "@/lib/sound";

/**
 * React wrapper around the sound layer. Exposes a stable `play(name)` and
 * a reactive `muted` state synced to localStorage and to in-app mute changes
 * triggered from anywhere (header click, keyboard shortcut, etc.).
 */
export function useSound() {
  const [muted, setMutedState] = useState<boolean>(() => isMuted());

  // Re-sync if another tab toggles mute, or if any in-app caller flips it.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "to.sound.muted") setMutedState(isMuted());
    };
    const onMuteChange = () => setMutedState(isMuted());
    window.addEventListener("storage", onStorage);
    window.addEventListener(MUTE_EVENT, onMuteChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(MUTE_EVENT, onMuteChange);
    };
  }, []);

  const setMutedSynced = useCallback((next: boolean) => {
    setMuted(next);
    setMutedState(next);
  }, []);

  const toggle = useCallback(() => {
    setMutedSynced(!isMuted());
  }, [setMutedSynced]);

  const playSound = useCallback((name: SoundName) => {
    play(name);
  }, []);

  return { muted, toggle, setMuted: setMutedSynced, play: playSound };
}
