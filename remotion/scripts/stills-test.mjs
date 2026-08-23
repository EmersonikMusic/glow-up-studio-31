import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const jobs = [
  { id: "pmax-16x9", frame: 40, out: "/tmp/frame-hook-40.png" },
  { id: "pmax-16x9", frame: 110, out: "/tmp/frame-free-110.png" },
  { id: "pmax-16x9", frame: 320, out: "/tmp/frame-play-320.png" },
  { id: "pmax-16x9", frame: 410, out: "/tmp/frame-end-410.png" },
  { id: "pmax-9x16", frame: 410, out: "/tmp/frame-end-9x16-410.png" },
];

for (const j of jobs) {
  const composition = await selectComposition({
    serveUrl: bundled,
    id: j.id,
    puppeteerInstance: browser,
  });
  await renderStill({
    composition,
    serveUrl: bundled,
    output: j.out,
    frame: j.frame,
    puppeteerInstance: browser,
    imageFormat: "png",
  });
  console.log("still:", j.out);
}

await browser.close({ silent: false });
console.log("ALL STILLS DONE");
