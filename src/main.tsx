import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Measure the visual viewport into a CSS variable used by full-height screens.
// Runs before React mounts so the first paint already has the correct height —
// important on legacy mobile / TV browsers where 100vh / 100svh are unreliable.
function setAppVh() {
  try {
    const h =
      (typeof window !== "undefined" && window.visualViewport && window.visualViewport.height) ||
      (typeof window !== "undefined" && window.innerHeight) ||
      0;
    if (h > 0 && typeof document !== "undefined") {
      document.documentElement.style.setProperty("--app-vh", h + "px");
    }
  } catch {
    /* no-op — keep default fallback */
  }
}
setAppVh();
if (typeof window !== "undefined") {
  window.addEventListener("resize", setAppVh);
  if (window.visualViewport && typeof window.visualViewport.addEventListener === "function") {
    window.visualViewport.addEventListener("resize", setAppVh);
  }
}

// Lock to portrait where supported (Android Chrome, installed PWAs).
// iOS Safari and most TV browsers ignore this; the CSS overlay handles those cases.
try {
  if (
    typeof screen !== "undefined" &&
    screen.orientation &&
    typeof (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock === "function"
  ) {
    (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> })
      .lock!("portrait")
      .catch(() => {});
  }
} catch {
  /* older browsers (Tizen, etc.) — orientation lock not supported, ignore */
}

// Mount with a guard so a runtime failure shows a friendly message instead of a blank page.
try {
  const rootEl = document.getElementById("root");
  if (!rootEl) throw new Error("Root element missing");
  createRoot(rootEl).render(<App />);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error("App failed to mount:", err);
  const rootEl = document.getElementById("root");
  if (rootEl) {
    rootEl.innerHTML = [
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,sans-serif;background:#1a1740;color:#fff;text-align:center;">',
      '<div style="max-width:480px;">',
      '<h1 style="font-size:24px;margin:0 0 12px;">Triviolivia couldn\'t load</h1>',
      '<p style="margin:0 0 8px;opacity:0.85;">Your browser may be too old to run this game.</p>',
      '<p style="margin:0;opacity:0.7;font-size:14px;">For the best experience, open <strong>triviolivia.com</strong> on a phone, tablet, or desktop browser.</p>',
      "</div></div>",
    ].join("");
  }
}
