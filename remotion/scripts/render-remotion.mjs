import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COMPOSITIONS = [
  { id: "pmax-16x9", out: "/mnt/documents/triviolicia-pmax-16x9.mp4" },
  { id: "pmax-1x1", out: "/mnt/documents/triviolicia-pmax-1x1.mp4" },
  { id: "pmax-9x16", out: "/mnt/documents/triviolicia-pmax-9x16.mp4" },
];

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: {
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  },
  chromeMode: "chrome-for-testing",
});

for (const c of COMPOSITIONS) {
  const composition = await selectComposition({
    serveUrl: bundled,
    id: c.id,
    puppeteerInstance: browser,
  });
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: c.out,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
  });
  console.log("rendered:", c.out);
}

await browser.close({ silent: false });
console.log("ALL DONE");
