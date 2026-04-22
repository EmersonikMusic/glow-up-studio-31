import { test, expect, devices } from "@playwright/test";

const CARD = '[data-testid="question-card"]';

async function startGame(page: import("@playwright/test").Page) {
  await page.goto("/");
  // The Start screen exposes a primary CTA — click any visible Start control.
  const startBtn = page
    .getByRole("button", { name: /start|begin|play/i })
    .first();
  await startBtn.waitFor({ state: "visible", timeout: 10_000 });
  await startBtn.click();
  await page.locator(CARD).waitFor({ state: "visible", timeout: 10_000 });
}

async function measureCard(page: import("@playwright/test").Page) {
  const box = await page.locator(CARD).boundingBox();
  if (!box) throw new Error("Card not measurable");
  return box.height;
}

async function advance(page: import("@playwright/test").Page) {
  // Click the first answer to trigger the answered → next-question auto-advance.
  const firstAnswer = page.getByRole("button").filter({ hasText: /.+/ }).nth(1);
  await firstAnswer.click().catch(() => {});
  // Wait for the next question (animKey changes, but card stays mounted).
  await page.waitForTimeout(1500);
}

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 720 },
];

for (const vp of viewports) {
  test.describe(`Card height stability — ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("card height stays identical across questions", async ({ page }) => {
      await startGame(page);
      const baseline = await measureCard(page);

      for (let i = 0; i < 3; i++) {
        await advance(page);
        const next = await measureCard(page);
        expect(Math.abs(next - baseline)).toBeLessThanOrEqual(1);
      }
    });
  });
}
