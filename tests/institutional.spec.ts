import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    window.sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
});
test("institutional draft, pending modality fields and empty authorized gallery", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".draft-label")).toHaveCount(0);
  const cards = page.locator("#modalidades article");
  await expect(cards).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await expect(cards.nth(i).locator("dt")).toHaveText(["Sobre a modalidade"]);
    await expect(cards.nth(i).locator("dd")).toHaveText(["Consulte nossa equipe para conhecer a modalidade mais indicada."]);

  }
  await expect(page.locator("#espetaculos .photo-open")).toHaveCount(8);
  await expect(
    page.locator(".performance-gallery .official-photo img"),
  ).toHaveCount(0);
  await expect(page.locator("#joca video")).toHaveCount(0);
  await expect(
    page.getByText(
      "Atendimento virtual com respostas locais programadas. Sem inteligência artificial.",
    ),
  ).toBeVisible();
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
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
  await page.screenshot({
    path: ".local/site003-homepage-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({
    path: ".local/site003-homepage-mobile.png",
    fullPage: true,
  });
});
test("photo paths remain hidden until authorization; approved image failures retain a clear placeholder", async ({
  page,
}) => {
  await page.route("**/src/gallery-content.ts*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body:
        (await response.text()) +
        "\n;galleryPhotos.forEach(p=>p.authorized=false);",
    });
  });
  // Fixture exists only in the intercepted module during this test; no real content is changed.
  await page.route("**/src/content.ts*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body:
        (await response.text()) +
        `
content.school.photo.src='/images/test-not-authorized.jpg';content.school.photo.authorized=false;content.performances.photos[0].src='/images/test-authorized-missing.jpg';content.performances.photos[0].authorized=true;`,
    });
  });
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.route("**/images/test-authorized-missing.jpg", (r) =>
    r.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/");
  await page.locator("#espetaculos").scrollIntoViewIfNeeded();
  await expect(
    page
      .locator(".performance-gallery")
      .getByText("Fotografia indisponível no momento."),
  ).toBeVisible();
  expect(requests.some((url) => url.includes("test-not-authorized.jpg"))).toBe(
    false,
  );
  expect(
    requests.some((url) => url.includes("test-authorized-missing.jpg")),
  ).toBe(true);
  await expect(
    page.locator(".performance-gallery .official-photo img"),
  ).toHaveCount(0);
});
