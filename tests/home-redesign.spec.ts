import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("official external contacts, safe tabs, editorial notes and internal navigation", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5174");
  const whatsapp = page.locator("a[href^='https://wa.me/']");
  await expect(whatsapp).toHaveCount(4);
  for (const link of await whatsapp.all()) {
    const url = new URL((await link.getAttribute("href"))!);
    expect(["/5514998519343", "/5514996587217"]).toContain(url.pathname);
    expect(url.searchParams.get("text")).toMatch(
      /Olá! Vim pelo site da Escola Joyce Helena/,
    );
  }
  await expect(
    page.locator("#contato a[href*='instagram.com']"),
  ).toHaveAttribute("href", "https://www.instagram.com/balletjoycehelena/");
  const maps = page.getByRole("link", { name: /Como chegar/ });
  const url = new URL((await maps.getAttribute("href"))!);
  expect(url.searchParams.get("query")).toContain("Rua Alves Seabra, 4-30");
  expect(url.searchParams.get("query")).toContain("Bauru/SP");
  for (const link of await page.locator("a[target='_blank']").all())
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  await page
    .getByRole("link", { name: "Conheça nossas modalidades ↓" })
    .click();
  await expect(page).toHaveURL(/#modalidades$/);
  await expect(page.locator(".editorial-pending")).toHaveCount(0);
  await expect(page.locator("#quatro-estacoes")).toContainText(
    "Data, horário, local e informações sobre ingressos aguardam divulgação oficial.",
  );
  await expect(page.locator(".photo-open")).toHaveCount(14);
  await expect(page.locator("#joca video")).toHaveCount(0);
});
test("five responsive widths, local hero, full page and event captures", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:5174");
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".home-hero-photo img")).toHaveCSS(
      "object-fit",
      "contain",
    );
  }
  for (const [width, name] of [
    [1440, "desktop"],
    [375, "mobile"],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
    }
    await page.screenshot({
      path: ".local/site005-homepage-" + name + ".png",
      fullPage: true,
    });
    await page
      .locator(".home-hero")
      .screenshot({ path: ".local/site005-hero-" + name + ".png" });
    await page
      .locator("#quatro-estacoes")
      .screenshot({ path: ".local/site005-quatro-estacoes-" + name + ".png" });
  }
  expect(errors).toEqual([]);
  await page.goto("http://127.0.0.1:5174");
  await expect(page.locator(".home-hero-photo img")).toHaveCount(1);
  await expect(page.locator(".hero-photo-pending")).toHaveCount(0);
});
