import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});
const browser = await openBrowser("chrome", {
  browserExecutable: "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});
for (const j of [
  { id: "pmax-16x9", frame: 445, out: "/tmp/frame-end-445.png" },
  { id: "pmax-9x16", frame: 445, out: "/tmp/frame-end-9x16-445.png" },
]) {
  const composition = await selectComposition({ serveUrl: bundled, id: j.id, puppeteerInstance: browser });
  await renderStill({ composition, serveUrl: bundled, output: j.out, frame: j.frame, puppeteerInstance: browser, imageFormat: "png" });
  console.log("still:", j.out);
}
await browser.close({ silent: false });
console.log("DONE");
