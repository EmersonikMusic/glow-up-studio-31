import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";

/**
 * Pausable 1-second-tick countdown.
 *
 * - `value` is the current second remaining (or `null` when idle for the
 *   nullable variant — see `useNullableCountdown`).
 * - `start(seconds)` resets and begins ticking down to 0.
 * - Tick is gated by `pausedRef.current` so pausing doesn't require restarting
 *   the interval (avoids drift and keeps the visible bar animation in sync).
 */
export function useCountdown(initial: number, pausedRef: MutableRefObject<boolean>) {
  const [value, setValue] = useState<number>(initial);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (seconds: number) => {
      clear();
      setValue(seconds);
      intervalRef.current = setInterval(() => {
        if (pausedRef.current) return;
        setValue((prev) => {
          if (prev <= 1) {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clear, pausedRef]
  );

  // Cleanup on unmount.
  useEffect(() => clear, [clear]);

  return { value, setValue, start, clear };
}

/**
 * Same as useCountdown but the value can be `null` (used by the answer-reveal
 * countdown which is inactive between questions).
 */
export function useNullableCountdown(pausedRef: MutableRefObject<boolean>) {
  const [value, setValue] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setValue(null);
  }, []);

  const start = useCallback(
    (seconds: number) => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setValue(seconds);
      intervalRef.current = setInterval(() => {
        if (pausedRef.current) return;
        setValue((prev) => {
          if (prev === null || prev <= 1) {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [pausedRef]
  );

  useEffect(() => clear, [clear]);

  return { value, setValue, start, clear };
}
