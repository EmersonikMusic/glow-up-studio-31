import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile (Managed) bot check.
 * The site key is public by design.
 */
export const TURNSTILE_SITE_KEY = "0x4AAAAAAEiFj5sqDuNYqKAK";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile-load-failed"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

interface Props {
  /** Fires with a fresh token, or null when it expires / errors. */
  onToken: (token: string | null) => void;
  /** Bump to force a fresh challenge (e.g. after a failed submit). */
  resetKey?: number;
  className?: string;
}

export default function TurnstileWidget({ onToken, resetKey = 0, className }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !hostRef.current || !window.turnstile) return;
        if (widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
          return;
        }
        widgetIdRef.current = window.turnstile.render(hostRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "dark",
          size: "flexible",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch(() => {
        // Network/script failure: don't hard-block real users.
        onTokenRef.current(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Force a new challenge when the parent asks for one.
  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onTokenRef.current(null);
    }
  }, [resetKey]);

  return <div ref={hostRef} className={className} />;
}
