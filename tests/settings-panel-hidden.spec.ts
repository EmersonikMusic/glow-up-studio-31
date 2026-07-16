import { test, expect, devices, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * Cross-engine regression: the SettingsPanel bottom sheet (mobile) and
 * side drawer (desktop) must never appear on-screen until the user
 * opens them. Runs under Chromium, Firefox, and WebKit so we catch
 * paint-gap flashes that only show up on Safari.
 *
 * Detection: a raf-sampler installed before app scripts records the
 * bounding rect + computed style of the sheet on every frame during
 * the first 1500ms after navigation. Any frame where the sheet is
 * partially inside the viewport with non-zero opacity is a violation.
 */

const SCREENSHOT_ROOT = path.join(__dirname, "__screenshots__", "settings-hidden");

type Sample = {
  t: number;
  present: boolean;
  top: number;
  bottom: number;
  height: number;
  opacity: number;
  visibility: string;
  vh: number;
};

const SAMPLER = `
(() => {
  if (window.__sheetSamples) return;
  const samples = [];
  window.__sheetSamples = samples;
  const t0 = performance.now();
  const SEL = '[data-testid="settings-panel-sheet"], [data-testid="settings-panel-desktop"]';
  function sample() {
    const now = performance.now() - t0;
    const el = document.querySelector(SEL);
    if (!el) {
      samples.push({ t: now, present: false, top: 0, bottom: 0, height: 0, opacity: 0, visibility: 'hidden', vh: window.innerHeight });
    } else {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      samples.push({
        t: now,
        present: true,
        top: r.top,
        bottom: r.bottom,
        height: r.height,
        opacity: parseFloat(cs.opacity || '1'),
        visibility: cs.visibility,
        vh: window.innerHeight,
      });
    }
    if (now < 1500) requestAnimationFrame(sample);
  }
  requestAnimationFrame(sample);
})();
`;

function violations(samples: Sample[]): Sample[] {
  return samples.filter(
    (s) =>
      s.present &&
      s.height > 1 &&
      s.opacity > 0.01 &&
      s.visibility !== "hidden" &&
      s.top < s.vh - 1 &&
      s.bottom > 0,
  );
}

async function shoot(page: Page, browser: string, label: string) {
  const dir = path.join(SCREENSHOT_ROOT, browser);
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${label}.png`), fullPage: false });
}

async function collect(page: Page): Promise<Sample[]> {
  await page.waitForFunction(
    () => (window as unknown as { __sheetSamples?: Sample[] }).__sheetSamples && (window as unknown as { __sheetSamples: Sample[] }).__sheetSamples.at(-1)!.t >= 1400,
    undefined,
    { timeout: 5000 },
  );
  return page.evaluate(() => (window as unknown as { __sheetSamples: Sample[] }).__sheetSamples);
}

const MOBILE = { width: 390, height: 844 };
const LANDSCAPE = { width: 844, height: 390 };
const DESKTOP = { width: 1280, height: 800 };

for (const browserName of ["chromium", "firefox", "webkit"] as const) {
  test.describe(`SettingsPanel stays hidden — ${browserName}`, () => {
    test.use({
      ...(browserName === "webkit" ? devices["iPhone 13"] : {}),
      viewport: MOBILE,
      browserName,
    });

    test.beforeEach(async ({ page }) => {
      await page.addInitScript(SAMPLER);
      await page.addInitScript(FIRST_PAINT_SAMPLER);
    });

    test("cold load — sheet never intersects viewport", async ({ page }) => {
      await page.goto("/");
      const samples = await collect(page);
      await shoot(page, browserName, "cold-load");
      const bad = violations(samples);
      expect(bad, `violations: ${JSON.stringify(bad.slice(0, 5))}`).toEqual([]);
    });

    test("reload keeps sheet hidden", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(200);
      await page.reload();
      const samples = await collect(page);
      await shoot(page, browserName, "reload");
      expect(violations(samples)).toEqual([]);
    });

    test("orientation flip does not flash sheet", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(600);
      await page.evaluate(() => {
        (window as unknown as { __sheetSamples: Sample[] }).__sheetSamples.length = 0;
      });
      await page.setViewportSize(LANDSCAPE);
      await page.waitForTimeout(800);
      await shoot(page, browserName, "landscape");
      const samples: Sample[] = await page.evaluate(
        () => (window as unknown as { __sheetSamples: Sample[] }).__sheetSamples,
      );
      expect(violations(samples)).toEqual([]);
    });

    test("crossing breakpoint does not flash sheet", async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto("/");
      await page.waitForTimeout(600);
      await page.evaluate(() => {
        (window as unknown as { __sheetSamples: Sample[] }).__sheetSamples.length = 0;
      });
      await page.setViewportSize(MOBILE);
      await page.waitForTimeout(800);
      await shoot(page, browserName, "breakpoint");
      const samples: Sample[] = await page.evaluate(
        () => (window as unknown as { __sheetSamples: Sample[] }).__sheetSamples,
      );
      expect(violations(samples)).toEqual([]);
    });

    test("opens correctly when gear is tapped", async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(500);
      const gear = page.getByRole("button", { name: /settings/i }).first();
      await gear.click();
      await page.waitForTimeout(500);
      await shoot(page, browserName, "opened");
      const rect = await page
        .locator('[data-testid="settings-panel-sheet"], [data-testid="settings-panel-desktop"]')
        .first()
        .boundingBox();
      expect(rect, "sheet should be in DOM after open").not.toBeNull();
      const vh = await page.evaluate(() => window.innerHeight);
      expect(rect!.top).toBeLessThan(vh - 100);
    });
  });
}
