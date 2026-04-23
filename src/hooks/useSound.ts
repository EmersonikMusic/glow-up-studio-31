import { useCallback, useEffect, useState } from "react";
import { isMuted, play, setMuted, type SoundName } from "@/lib/sound";

/**
 * React wrapper around the sound layer. Exposes a stable `play(name)` and
 * a reactive `muted` state synced to localStorage.
 */
export function useSound() {
  const [muted, setMutedState] = useState<boolean>(() => isMuted());

  // Re-sync if another tab toggles mute.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "to.sound.muted") setMutedState(isMuted());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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
