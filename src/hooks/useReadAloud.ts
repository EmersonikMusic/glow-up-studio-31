import { useCallback, useEffect, useState } from "react";
import {
  cancelSpeech,
  isReadAloudEnabled,
  isSpeechSupported,
  READ_ALOUD_EVENT,
  setReadAloudEnabled,
  speak,
} from "@/lib/speech";

/**
 * React wrapper around the speech layer. Mirrors useSound: exposes a reactive
 * `enabled` state synced to localStorage and to in-app toggle events from
 * anywhere (header button, future keyboard shortcut, etc.).
 */
export function useReadAloud() {
  const [enabled, setEnabledState] = useState<boolean>(() => isReadAloudEnabled());
  const supported = isSpeechSupported();

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "to.readaloud.enabled") setEnabledState(isReadAloudEnabled());
    };
    const onChange = () => setEnabledState(isReadAloudEnabled());
    window.addEventListener("storage", onStorage);
    window.addEventListener(READ_ALOUD_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(READ_ALOUD_EVENT, onChange);
    };
  }, []);

  const setEnabledSynced = useCallback((next: boolean) => {
    setReadAloudEnabled(next);
    setEnabledState(next);
  }, []);

  const toggle = useCallback(() => {
    setEnabledSynced(!isReadAloudEnabled());
  }, [setEnabledSynced]);

  const speakText = useCallback((text: string) => speak(text), []);
  const cancel = useCallback(() => cancelSpeech(), []);

  return { enabled, toggle, setEnabled: setEnabledSynced, speak: speakText, cancel, supported };
}
