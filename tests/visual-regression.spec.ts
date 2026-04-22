import { test, expect, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import {
  collectRects,
  rectInsideViewport,
  rectsDoNotOverlap,
  rectsOverlap,
  type Rect,
} from "./utils/overlap";

const SCREENSHOT_DIR = path.join(__dirname, "__screenshots__");
const REPORT_PATH = path.join(SCREENSHOT_DIR, "REPORT.md");
const CARD = '[data-testid="question-card"]';

type Viewport = {
  name: string;
  width: number;
  height: number;
  category: "phone-portrait" | "phone-landscape" | "tablet-portrait" | "tablet-landscape" | "desktop";
};

const viewports: Viewport[] = [
  { name: "phone-360x800", width: 360, height: 800, category: "phone-portrait" },
  { name: "phone-390x844", width: 390, height: 844, category: "phone-portrait" },
  { name: "phone-414x896", width: 414, height: 896, category: "phone-portrait" },
  { name: "phone-landscape-667x375", width: 667, height: 375, category: "phone-landscape" },
  { name: "phone-landscape-844x390", width: 844, height: 390, category: "phone-landscape" },
  { name: "phone-landscape-932x430", width: 932, height: 430, category: "phone-landscape" },
  { name: "tablet-768x1024", width: 768, height: 1024, category: "tablet-portrait" },
  { name: "tablet-820x1180", width: 820, height: 1180, category: "tablet-portrait" },
  { name: "tablet-landscape-1024x768", width: 1024, height: 768, category: "tablet-landscape" },
  { name: "tablet-landscape-1180x820", width: 1180, height: 820, category: "tablet-landscape" },
  { name: "desktop-1280x720", width: 1280, height: 720, category: "desktop" },
  { name: "desktop-1920x1080", width: 1920, height: 1080, category: "desktop" },
];

type Result = {
  viewport: string;
  width: number;
  height: number;
  state: "gameplay" | "settings";
  checks: { name: string; pass: boolean; detail?: string }[];
  screenshot: string;
};

const results: Result[] = [];

function isMobileSheet(vp: Viewport): boolean {
  // Bottom-sheet expected when narrow OR phone-landscape (short height + medium width).
  return vp.width < 768 || (vp.height <= 500 && vp.width <= 950);
}

async function startGame(page: Page) {
  await page.goto("/");
  const startBtn = page
    .getByRole("button", { name: /start|begin|play/i })
    .first();
  await startBtn.waitFor({ state: "visible", timeout: 15_000 });
  await startBtn.click();
  await page.locator(CARD).waitFor({ state: "visible", timeout: 15_000 });
  // Settle layout / animations.
  await page.waitForTimeout(400);
}

async function openSettings(page: Page) {
  const gear = page
    .getByRole("button", { name: /settings/i })
    .first();
  await gear.click();
  await page.waitForTimeout(500);
}

function evalChecks(
  vp: Viewport,
  rects: Record<string, Rect | null>,
): { name: string; pass: boolean; detail?: string }[] {
  const out: { name: string; pass: boolean; detail?: string }[] = [];

  // Bounds checks (each visible element fully inside viewport).
  for (const [key, rect] of Object.entries(rects)) {
    if (!rect) continue;
    const inside = rectInsideViewport(rect, vp.width, vp.height);
    out.push({
      name: `bounds:${key}`,
      pass: inside,
      detail: inside
        ? undefined
        : `rect=${JSON.stringify(rect)} viewport=${vp.width}x${vp.height}`,
    });
  }

  const { header, card, mobileMascot, desktopMascot, footer } = rects;
  const mascot = mobileMascot ?? desktopMascot;

  // No-overlap pairs.
  const pairs: [string, Rect | null, Rect | null][] = [
    ["header-vs-card", header, card],
    ["header-vs-footer", header, footer],
    ["card-vs-footer", card, footer],
    ["header-vs-mascot", header, mascot],
    ["footer-vs-mascot", footer, mascot],
  ];
  for (const [name, a, b] of pairs) {
    if (!a || !b) continue;
    const ok = rectsDoNotOverlap(a, b, 1);
    out.push({
      name: `no-overlap:${name}`,
      pass: ok,
      detail: ok ? undefined : `a=${JSON.stringify(a)} b=${JSON.stringify(b)}`,
    });
  }

  // Card vs mascot — mascot may sit in a reserved right gutter on landscape phones.
  if (card && mascot) {
    const overlap = rectsOverlap(card, mascot, 1);
    if (!overlap) {
      out.push({ name: "card-vs-mascot", pass: true });
    } else if (vp.category === "phone-landscape") {
      const mascotLeft = mascot.x;
      const cardRight = card.x + card.width;
      const ok = mascotLeft >= cardRight - 4;
      out.push({
        name: "card-vs-mascot(landscape-gutter)",
        pass: ok,
        detail: ok
          ? undefined
          : `mascotLeft=${mascotLeft} cardRight=${cardRight}`,
      });
    } else {
      out.push({
        name: "card-vs-mascot",
        pass: false,
        detail: `mascot overlaps card on ${vp.category}`,
      });
    }
  }

  return out;
}

async function checkSettingsDrawerSide(page: Page, vp: Viewport): Promise<{ name: string; pass: boolean; detail?: string }> {
  // Radix-based dialogs/sheets/drawers expose data-side or [data-vaul-drawer].
  const expectedSide = isMobileSheet(vp) ? "bottom" : "right";

  // Try a number of likely selectors.
  const candidates = [
    "[data-vaul-drawer]",
    "[data-side]",
    "[role=dialog]",
  ];
  for (const sel of candidates) {
    const loc = page.locator(sel);
    const count = await loc.count();
    if (count === 0) continue;
    const el = loc.first();
    const side = await el.getAttribute("data-side");
    const vaul = await el.getAttribute("data-vaul-drawer");
    if (side) {
      return {
        name: `settings-drawer-side(expected=${expectedSide})`,
        pass: side === expectedSide,
        detail: `data-side=${side}`,
      };
    }
    if (vaul !== null && expectedSide === "bottom") {
      // vaul drawer is bottom-only by default in this stack.
      return {
        name: `settings-drawer-side(expected=${expectedSide})`,
        pass: true,
        detail: `data-vaul-drawer present`,
      };
    }
  }
  return {
    name: `settings-drawer-side(expected=${expectedSide})`,
    pass: false,
    detail: "no drawer/dialog/sheet detected",
  };
}

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

for (const vp of viewports) {
  test.describe(`Visual regression — ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("gameplay layout", async ({ page }) => {
      await startGame(page);

      const shotPath = path.join(SCREENSHOT_DIR, `${vp.name}-gameplay.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      const rects = await collectRects(page);
      const checks = evalChecks(vp, rects);

      results.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        state: "gameplay",
        checks,
        screenshot: path.basename(shotPath),
      });

      const failed = checks.filter((c) => !c.pass);
      expect(failed, `Failed checks: ${JSON.stringify(failed, null, 2)}`).toEqual([]);
    });

    test("settings open", async ({ page }) => {
      await startGame(page);
      await openSettings(page);

      const shotPath = path.join(SCREENSHOT_DIR, `${vp.name}-settings.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      const sideCheck = await checkSettingsDrawerSide(page, vp);
      const rects = await collectRects(page);
      const checks = [...evalChecks(vp, rects), sideCheck];

      results.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        state: "settings",
        checks,
        screenshot: path.basename(shotPath),
      });

      const failed = checks.filter((c) => !c.pass);
      expect(failed, `Failed checks: ${JSON.stringify(failed, null, 2)}`).toEqual([]);
    });
  });
}

test.afterAll(() => {
  if (results.length === 0) return;
  const lines: string[] = [];
  lines.push("# Visual Regression Report", "");
  lines.push(`Generated: ${new Date().toISOString()}`, "");

  const grouped = new Map<string, Result[]>();
  for (const r of results) {
    const arr = grouped.get(r.viewport) ?? [];
    arr.push(r);
    grouped.set(r.viewport, arr);
  }

  for (const [viewport, items] of grouped) {
    lines.push(`## ${viewport}`, "");
    for (const item of items) {
      const total = item.checks.length;
      const passed = item.checks.filter((c) => c.pass).length;
      lines.push(`### ${item.state} — ${passed}/${total} passed`, "");
      lines.push(`![${item.state}](./${item.screenshot})`, "");
      lines.push("| Check | Result | Detail |", "| --- | --- | --- |");
      for (const c of item.checks) {
        lines.push(
          `| ${c.name} | ${c.pass ? "✅" : "❌"} | ${c.detail ?? ""} |`,
        );
      }
      lines.push("");
    }
  }

  fs.writeFileSync(REPORT_PATH, lines.join("\n"), "utf8");
});
