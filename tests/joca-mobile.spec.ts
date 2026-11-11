import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("sheet spacing, focus and independent scroll at five widths", async ({
  page,
}) => {
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Fale com a Jóca" });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 812 });
    const launch = await launcher.boundingBox();
    expect(launch!.x + launch!.width).toBeLessThanOrEqual(width - 12);
    expect(launch!.y + launch!.height).toBeLessThanOrEqual(800);
    if (width < 768) {
      expect(launch!.width).toBeLessThan(190);
      expect(launch!.height).toBeGreaterThanOrEqual(44);
    }
    await launcher.click();
    const chat = page.getByRole("dialog", { name: "Jóca", exact: true }),
      input = chat.getByRole("textbox");
    await expect(
      width < 768
        ? chat.getByRole("button", { name: "Fechar conversa com a Jóca" })
        : input,
    ).toBeFocused();
    const rect = await chat.boundingBox();
    expect(rect!.x).toBeGreaterThanOrEqual(12);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width - 12);
    if (width < 768) {
      expect(rect!.height).toBeLessThanOrEqual(720);
      expect(rect!.y + rect!.height).toBeCloseTo(800, 0);
    }
    for (let i = 0; i < 4; i++) {
      await input.fill("Quais modalidades existem?");
      await input.press("Enter");
      await expect(chat.locator(".assistant").last()).toContainText("Baby");
    }
    const header = await chat.locator("header").boundingBox(),
      compose = await input.boundingBox();
    await chat.locator(".joca-messages").evaluate((el) => {
      el.scrollTop = 0;
    });
    expect((await chat.locator("header").boundingBox())!.y).toBe(header!.y);
    expect((await input.boundingBox())!.y).toBe(compose!.y);
    expect(
      await chat.evaluate((el) => el.scrollHeight <= el.clientHeight + 1),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(launcher).toBeFocused();
  }
});
test("visualViewport keyboard and pan keep input and close control visible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() => {
    const viewport = new EventTarget();
    Object.assign(viewport, {
      height: 812,
      width: 375,
      offsetTop: 0,
      offsetLeft: 0,
    });
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: viewport,
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Fale com a Jóca" }).click();
  const chat = page.getByRole("dialog", { name: "Jóca", exact: true }),
    input = chat.getByRole("textbox");
  await input.focus();
  await page.evaluate(() => {
    Object.assign(window.visualViewport!, { height: 340, offsetTop: 48 });
    window.visualViewport!.dispatchEvent(new Event("resize"));
    window.visualViewport!.dispatchEvent(new Event("scroll"));
  });
  await expect
    .poll(() => chat.evaluate((el) => el.getBoundingClientRect().bottom))
    .toBeLessThanOrEqual(376);
  expect((await chat.boundingBox())!.y).toBeGreaterThanOrEqual(60);
  const box = await input.boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(376);
  await expect(input).toBeFocused();
  await input.fill("Como consultar horários?");
  await input.press("Enter");
  await expect(chat.locator(".assistant").last()).toContainText("WhatsApp");
  await page.screenshot({
    path: ".local/site006b-chat-keyboard-simulated.png",
  });
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Fale com a Jóca" }),
  ).toBeFocused();
});
test("viewport fallback and desktop/mobile screenshots", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: undefined,
    }),
  );
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Fale com a Jóca" });
  for (const [width, name] of [
    [1440, "desktop"],
    [375, "mobile"],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("heading", { level: 1 }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: ".local/site006b-launcher-" + name + ".png",
    });
    await launcher.click();
    const chat = page.getByRole("dialog", { name: "Jóca", exact: true });
    await chat.getByRole("textbox").fill("Olá");
    await chat.getByRole("textbox").press("Enter");
    await expect(chat.locator(".assistant").last()).toContainText("Que bom");
    await page.screenshot({ path: ".local/site006b-chat-" + name + ".png" });
    await page.setViewportSize({ width, height: 420 });
    await expect
      .poll(() => chat.evaluate((el) => el.getBoundingClientRect().bottom))
      .toBeLessThanOrEqual(421);
    expect((await chat.getByRole("textbox").boundingBox())!.y).toBeGreaterThan(
      0,
    );
    await page.keyboard.press("Escape");
  }
});
