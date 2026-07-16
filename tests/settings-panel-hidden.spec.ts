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

/**
 * First-paint sampler. Uses MutationObserver + PerformanceObserver to
 * capture the sheet the *instant* it enters the DOM, along with the
 * transform matrix, opacity, and whether first-contentful-paint has
 * already fired. This is stricter than the frame sampler above: the
 * test fails if the very first appearance of the panel is not in the
 * closed position.
 */
const FIRST_PAINT_SAMPLER = `
(() => {
  if (window.__firstPaint) return;
  const state = { insertion: null, fp: null, fcp: null };
  window.__firstPaint = state;
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.name === 'first-paint' && state.fp == null) state.fp = e.startTime;
        if (e.name === 'first-contentful-paint' && state.fcp == null) state.fcp = e.startTime;
      }
    }).observe({ type: 'paint', buffered: true });
  } catch (_) {}
  const SEL = '[data-testid="settings-panel-sheet"], [data-testid="settings-panel-desktop"]';
  function record(el) {
    if (state.insertion) return;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    state.insertion = {
      t: performance.now(),
      testid: el.getAttribute('data-testid'),
      dataOpen: el.getAttribute('data-open'),
      dataAnimated: el.getAttribute('data-animated'),
      rect: { top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right },
      transform: cs.transform,
      opacity: parseFloat(cs.opacity || '1'),
      visibility: cs.visibility,
      display: cs.display,
      vw: window.innerWidth,
      vh: window.innerHeight,
      fpAtInsert: state.fp,
      fcpAtInsert: state.fcp,
    };
  }
  const existing = document.querySelector(SEL);
  if (existing) record(existing);
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches && node.matches(SEL)) { record(node); return; }
        const inner = node.querySelector && node.querySelector(SEL);
        if (inner) { record(inner); return; }
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
  // Polling fallback — some engines/timing combinations miss the MO tick.
  const iv = setInterval(() => {
    if (state.insertion) { clearInterval(iv); return; }
    const el = document.querySelector(SEL);
    if (el) { record(el); clearInterval(iv); }
  }, 16);
})();

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

    test("panel is not visible on first paint", async ({ page }, testInfo) => {
      await page.goto("/");
      // Wait for the panel to be inserted into the DOM (mounted gate flips
      // after one rAF). If it never mounts, the test still finishes and
      // reports "no insertion recorded" as a pass since nothing painted.
      await page.waitForFunction(
        () => {
          const s = (window as unknown as { __firstPaint?: { insertion: unknown; fcp: number | null } }).__firstPaint;
          return !!s && s.insertion !== null;
        },
        undefined,
        { timeout: 10000 },
      );
      await page.waitForTimeout(200);
      const state = await page.evaluate(
        () => (window as unknown as { __firstPaint: { insertion: FirstPaintInsertion | null; fp: number | null; fcp: number | null } }).__firstPaint,
      );
      await shoot(page, browserName, "first-paint");
      await testInfo.attach("first-paint-state.json", {
        body: JSON.stringify(state, null, 2),
        contentType: "application/json",
      });

      const ins = state.insertion;
      if (!ins) return; // panel never mounted → nothing painted, nothing to check

      // The panel now stays in its final position at all times, but is kept
      // invisible via opacity:0 + visibility:hidden until data-open flips.
      // A "visible on first paint" violation is any insertion where the
      // element is on-screen with non-zero opacity and not visibility:hidden.
      const problems: string[] = [];
      if (ins.opacity > 0.01) {
        problems.push(`opacity=${ins.opacity} > 0 at first paint`);
      }
      if (ins.visibility !== "hidden") {
        problems.push(`visibility=${ins.visibility} (expected 'hidden') at first paint`);
      }
      if (ins.dataOpen !== "false") {
        problems.push(`data-open=${ins.dataOpen} (expected 'false') at first paint`);
      }
      expect(
        problems,
        `First paint of panel was visible. state=${JSON.stringify(ins)}`,
      ).toEqual([]);
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

type FirstPaintInsertion = {
  t: number;
  testid: string;
  dataOpen: string | null;
  dataAnimated: string | null;
  rect: { top: number; left: number; width: number; height: number; bottom: number; right: number };
  transform: string;
  opacity: number;
  visibility: string;
  display: string;
  vw: number;
  vh: number;
  fpAtInsert: number | null;
  fcpAtInsert: number | null;
};
