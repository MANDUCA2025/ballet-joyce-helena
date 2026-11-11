import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { galleryPhotos } from "../src/gallery-content";
const review = "http://127.0.0.1:5174";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("14 photos, keyboard lightbox, Escape and focus restoration", async ({
  page,
}) => {
  await page.goto(review);
  await expect(page.locator(".photo-open")).toHaveCount(14);
  const opener = page.getByRole("button", {
    name: "Ampliar: Acolhimento em cada passo",
    exact: true,
  });
  await opener.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Fotografia ampliada" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.locator("figcaption")).toHaveText("Aprendendo juntas");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.locator("figcaption")).toHaveText(
    "Acolhimento em cada passo",
  );
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Próxima" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  for (const year of ["2024", "2025"]) {
    const section = page.getByRole("region", {
      name: "Memórias do palco — " + year,
    });
    await expect(section.locator(".photo-open")).toHaveCount(
      year === "2024" ? 3 : 5,
    );
    await section.locator(".photo-open").first().click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Fechar" })
      .click();
    await expect(section.locator(".photo-open").first()).toBeFocused();
  }
});
test("responsive galleries, originals loaded without cropping, review captures", async ({
  page,
}) => {
  await page.goto(review);
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const opener = page.locator(".photo-open").first();
    await opener.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  }
  for (const [width, name] of [
    [1440, "desktop"],
    [375, "mobile"],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    for (const img of await page.locator(".photo-open img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((i) => (i as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
      await expect(img).toHaveCSS("object-fit", "contain");
    }
    await page.screenshot({
      path: ".local/site004a-homepage-" + name + ".png",
      fullPage: true,
    });
    await page
      .locator(".photo-collection")
      .first()
      .screenshot({ path: ".local/site004a-aulas-" + name + ".png" });
    await page
      .locator("#espetaculos")
      .screenshot({ path: ".local/site004a-palco-" + name + ".png" });
    await page.locator(".photo-open").first().click();
    await page.screenshot({
      path: ".local/site004a-lightbox-" + name + ".png",
    });
    await page.keyboard.press("Escape");
  }
});
test("authorized assets are identical in public and normal production build", async ({
  page,
  request,
}) => {
  const registry = JSON.parse(
    readFileSync("src/media-authorization.json", "utf8"),
  ) as { assets: { path: string; authorized: boolean; sha256: string }[] };
  expect(galleryPhotos).toHaveLength(14);
  expect(
    galleryPhotos.every((p) => p.authorized && p.src.startsWith("/images/")),
  ).toBe(true);
  for (const item of registry.assets) {
    expect(item.authorized).toBe(true);
    expect(item.path).not.toMatch(/\.png\.png$/);
    for (const base of ["public", "dist"])
      expect(
        createHash("sha256")
          .update(readFileSync(base + "/" + item.path))
          .digest("hex"),
      ).toBe(item.sha256);
    const response = await request.get("http://127.0.0.1:4174/" + item.path);
    expect(response.status()).toBe(200);
    expect(
      createHash("sha256")
        .update(await response.body())
        .digest("hex"),
    ).toBe(item.sha256);
  }
  await page.goto("http://127.0.0.1:4174");
  await expect(page.locator(".photo-open")).toHaveCount(14);
  for (const img of await page.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((i) => (i as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  }
  for (const [width, name] of [
    [1440, "desktop"],
    [375, "mobile"],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: ".local/site005b-homepage-" + name + ".png",
      fullPage: true,
    });
    await page
      .locator(".home-hero")
      .screenshot({ path: ".local/site005b-hero-" + name + ".png" });
  }
});
test("future photos without authorization are not rendered or requested", async ({
  page,
}) => {
  await page.route("**/src/gallery-content.ts*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body:
        (await response.text()) +
        '\n;galleryPhotos[0].authorized=false;galleryPhotos[0].src="/images/not-authorized.png";',
    });
  });
  const urls: string[] = [];
  page.on("request", (r) => urls.push(r.url()));
  await page.goto("/");
  await expect(page.locator(".photo-open")).toHaveCount(13);
  await expect(page.locator(".home-hero-photo img")).toHaveCount(1);
  expect(urls.some((url) => url.includes("not-authorized.png"))).toBe(false);
});

test("build editorial check rejects an unapproved public file", () => {
  const directory = mkdtempSync(".local/media-policy-test-");
  writeFileSync(directory + "/unapproved.png", "fixture, not a photograph");
  const result = spawnSync(
    "node",
    ["scripts/check-production-media.mjs", directory],
    { encoding: "utf8" },
  );
  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain("Arquivo sem autorização editorial");
});
