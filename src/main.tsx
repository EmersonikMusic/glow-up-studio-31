import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Lock to portrait where supported (Android Chrome, installed PWAs).
// iOS Safari ignores this; the CSS overlay in index.css handles that case.
if (typeof screen !== "undefined" && screen.orientation && "lock" in screen.orientation) {
  // @ts-expect-error - lock() exists at runtime but isn't in all TS lib targets
  screen.orientation.lock("portrait").catch(() => {});
}

createRoot(document.getElementById("root")!).render(<App />);
