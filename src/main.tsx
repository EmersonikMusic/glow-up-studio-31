import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Lock to portrait where supported (Android Chrome, installed PWAs).
// iOS Safari ignores this; the CSS overlay in index.css handles that case.
if (typeof screen !== "undefined" && screen.orientation && "lock" in screen.orientation) {
  (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> })
    .lock?.("portrait")
    .catch(() => {});
}

createRoot(document.getElementById("root")!).render(<App />);
