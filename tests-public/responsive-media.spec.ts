import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import images from "../src/responsive-images.json" with { type: "json" };
import registry from "../src/media-authorization.json" with { type: "json" };

test("all 24 originals and authorized responsive derivatives retain their SHA-256", () => {
  expect(registry.assets).toHaveLength(24);
  for (const asset of registry.assets) {
    for (const root of ["public", "dist"]) {
      expect(
        createHash("sha256")
          .update(readFileSync(root + "/" + asset.path))
          .digest("hex"),
      ).toBe(asset.sha256);
    }
  }
  for (const [source, info] of Object.entries(images)) {
    expect(
      registry.assets.some((a) => "/" + a.path === source && a.authorized),
    ).toBe(true);
    for (const variant of info.variants) {
      expect(
        createHash("sha256")
          .update(readFileSync("dist" + variant.src))
          .digest("hex"),
      ).toBe(variant.sha256);
      expect(variant.width).toBeLessThanOrEqual(info.width);
    }
  }
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test(
    "responsive WebP and progressive loading at " + width,
    async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() =>
        sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
      );
      await page.goto("/");
      const hero = page.locator(".home-hero-photo img");
      await expect(hero).toHaveAttribute("fetchpriority", "high");
      expect(await hero.getAttribute("loading")).not.toBe("lazy");
      await expect
        .poll(() => hero.evaluate((i) => (i as HTMLImageElement).currentSrc))
        .toContain(".webp");
      await expect
        .poll(() => hero.evaluate((i) => (i as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
      expect(
        await page
          .locator(".photo-open img")
          .evaluateAll((imgs) =>
            imgs.every((i) => (i as HTMLImageElement).loading === "lazy"),
          ),
      ).toBe(true);
      const last = page.locator(".photo-open img").last();
      // A distant gallery stays unrequested until the visitor approaches it.
      expect(await last.evaluate((i) => (i as HTMLImageElement).complete)).toBe(
        false,
      );
      await last.scrollIntoViewIfNeeded();
      await expect
        .poll(() => last.evaluate((i) => (i as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
      expect(
        await last.evaluate((i) => (i as HTMLImageElement).currentSrc),
      ).toContain(".webp");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if ([375, 1440].includes(width)) {
        await page.screenshot({
          path: `.local/site007c3-gallery-${width}.png`,
        });
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: `.local/site007c3-hero-${width}.png` });
      }
    },
  );
}

test("missing responsive file falls back to the unchanged original", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.route("**/optimized/hero-*.webp", (r) =>
    r.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/");
  const hero = page.locator(".home-hero-photo img");
  await expect
    .poll(() => hero.evaluate((i) => (i as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await expect
    .poll(() => hero.evaluate((i) => (i as HTMLImageElement).currentSrc))
    .toContain("/images/hero-joyce-helena.png");
});
