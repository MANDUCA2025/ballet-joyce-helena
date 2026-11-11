import { test, expect } from "@playwright/test";
// These scenarios exercise the homepage after the session introduction.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    window.sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
});
test("homepage is honest, static and usable on desktop", async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1:5174")) external.push(r.url());
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Baby", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Pré-Ballet", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Infantil", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Preparatório", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".home-hero a[href^='https://wa.me/']"),
  ).toHaveAttribute("href", /5514998519343/);
  await expect(page.locator("#contato a[href*='instagram.com']")).toBeVisible();
  await expect(page.locator("form,input,textarea")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/DANZIA/i);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  for (const img of await page.locator(".photo-open img").all())
    await img.scrollIntoViewIfNeeded();
  await page.locator("#joca").scrollIntoViewIfNeeded();
  await expect(page.getByAltText("Retrato ilustrado da Jóca")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (i) =>
              i instanceof HTMLImageElement && i.complete && i.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.getByRole("heading", { level: 1 }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: ".local/hero-desktop-1440.png" });
  await page.screenshot({
    path: ".local/homepage-desktop-1440.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test("mobile navigation, Escape and responsive layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Abrir menu" });
  await expect(menu).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Navegação principal" }),
  ).toBeHidden();
  await menu.click();
  await expect(
    page.getByRole("button", { name: "Fechar menu" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: "Nossa escola" })
    .click();
  await expect(page).toHaveURL(/#escola$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  for (const img of await page.locator(".photo-open img").all())
    await img.scrollIntoViewIfNeeded();
  await page.locator("#joca").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (i) =>
              i instanceof HTMLImageElement && i.complete && i.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: ".local/hero-mobile-375.png" });
  await page.screenshot({
    path: ".local/homepage-mobile-375.png",
    fullPage: true,
  });
});
test("missing Jóca assets show a clear fallback without broken images", async ({
  page,
}) => {
  await page.route(/\/images\/(?:optimized\/)?joca-/, (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/");
  for (const img of await page.locator(".photo-open img").all())
    await img.scrollIntoViewIfNeeded();
  await page.locator("#joca").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("img", { name: /imagem indisponível/ }),
  ).toHaveCount(2);
  await expect(
    page.getByRole("heading", { name: "Um toque de encanto por aqui." }),
  ).toBeVisible();
});
