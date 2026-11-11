import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("background lock restores exact scroll and launcher focus over repeated openings", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 1800));
  const y = await page.evaluate(() => window.scrollY);
  const marker = await page.locator("#modalidades").boundingBox();
  const launcher = page.getByRole("button", { name: "Fale com a Jóca" });
  for (let i = 0; i < 3; i++) {
    await launcher.click();
    await expect(page.locator(".joca-launcher")).toBeHidden();
    await expect(page.locator("body")).toHaveCSS("position", "fixed");
    expect((await page.locator("#modalidades").boundingBox())!.y).toBeCloseTo(
      marker!.y,
      0,
    );
    await page.mouse.move(10, 10);
    await page.mouse.wheel(0, 700);
    expect((await page.locator("#modalidades").boundingBox())!.y).toBeCloseTo(
      marker!.y,
      0,
    );
    await page.keyboard.press("Escape");
    await expect(launcher).toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBe(y);
    await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
  }
});
test("pending response respects reader position, duplicate guard and latest action", async ({
  page,
}) => {
  await page.route("**/src/joca/chat-service.ts*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body:
        (await response.text()) +
        "\n;localChatService.reply=async()=>{await new Promise(r=>setTimeout(r,500));return {text:'Resposta de teste para leitura. '.repeat(20)};};",
    });
  });
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/");
  await page.getByRole("button", { name: "Fale com a Jóca" }).click();
  const chat = page.getByRole("dialog", { name: "Jóca", exact: true }),
    input = chat.getByRole("textbox"),
    log = chat.getByRole("log");
  expect(await log.evaluate((el) => el.scrollTop)).toBe(0);
  await expect(chat.getByText(/Que alegria ter você aqui/)).toBeVisible();
  for (let i = 0; i < 3; i++) {
    await input.fill("pergunta " + i);
    await input.press("Enter");
    await expect(chat.locator(".assistant")).toHaveCount(i + 2);
  }
  await input.fill("pergunta única");
  await chat.locator("form").evaluate((form) => {
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
  });
  await expect(chat.getByText("pergunta única", { exact: true })).toHaveCount(
    1,
  );
  await expect(chat.getByRole("status")).toContainText("Consultando");
  await log.evaluate((el) => {
    el.scrollTop = 0;
    el.dispatchEvent(new Event("scroll"));
  });
  await expect(chat.locator(".assistant")).toHaveCount(5);
  expect(await log.evaluate((el) => el.scrollTop)).toBe(0);
  await chat.getByRole("button", { name: "Ver última resposta" }).click();
  await expect
    .poll(() =>
      log.evaluate((el) => el.scrollHeight - el.clientHeight - el.scrollTop),
    )
    .toBeLessThan(2);
  await expect(chat.getByRole("status")).not.toContainText("Consultando");
  await expect(input).toHaveAttribute("maxlength", "500");
  await input.fill("  ");
  await expect(
    chat.getByRole("button", { name: "Enviar", exact: true }),
  ).toBeDisabled();
});
test("failed service retry without duplicate user message; no late reply after closing", async ({
  page,
}) => {
  await page.route("**/src/joca/chat-service.ts*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body:
        (await response.text()) +
        "\n;let calls=0;localChatService.reply=async()=>{calls++;await new Promise(r=>setTimeout(r,250));if(calls===1)throw Error('test');return {text:'Resposta recuperada'};};",
    });
  });
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Fale com a Jóca" });
  await launcher.click();
  const chat = page.getByRole("dialog", { name: "Jóca", exact: true }),
    input = chat.getByRole("textbox");
  await input.fill("Consultar");
  await input.press("Enter");
  await chat.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(chat.locator(".user")).toHaveCount(1);
  await expect(chat.locator(".assistant").last()).toContainText(
    "Resposta recuperada",
  );
  await input.fill("Cancelar");
  await input.press("Enter");
  await page.keyboard.press("Escape");
  await expect(launcher).toBeFocused();
  await page.waitForTimeout(300);
  await launcher.click();
  await expect(
    chat.getByText("Resposta recuperada", { exact: true }),
  ).toHaveCount(1);
});
test("six widths, landscape, reduced height, keyboard cycle and captures", async ({
  page,
}, info) => {
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Fale com a Jóca" });
  for (const [width, height] of [
    [320, 568],
    [375, 667],
    [390, 844],
    [768, 600],
    [1024, 700],
    [1440, 900],
    [844, 280],
    [667, 260],
  ]) {
    await page.setViewportSize({ width, height });
    await launcher.click();
    const chat = page.getByRole("dialog", { name: "Jóca", exact: true });
    const box = await chat.boundingBox(),
      field = await chat.getByRole("textbox").boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(height);
    expect(field!.y + field!.height).toBeLessThanOrEqual(box!.y + box!.height);
    expect(
      await chat.getByRole("log").evaluate((el) => el.clientHeight),
    ).toBeGreaterThan(20);
    await chat
      .getByRole("button", { name: "Fechar conversa com a Jóca" })
      .focus();
    await page.keyboard.press("Shift+Tab");
    await expect(chat.getByRole("textbox")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      chat.getByRole("button", { name: "Fechar conversa com a Jóca" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
  }
  for (const [width, height, name] of [
    [1440, 900, "desktop"],
    [390, 844, "mobile"],
    [844, 320, "landscape"],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await launcher.click();
    await page.screenshot({
      path:
        ".local/site006b1-" +
        (info.project.name || "edge") +
        "-" +
        name +
        ".png",
    });
    await page.keyboard.press("Escape");
  }
});
test("listener cleanup, visualViewport keyboard, zoom 200 percent and contrast", async ({
  page,
  context,
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    const target = new EventTarget(),
      listeners = new Set<EventListenerOrEventListenerObject>();
    Object.assign(target, {
      width: 390,
      height: 844,
      offsetTop: 0,
      offsetLeft: 0,
    });
    const add = target.addEventListener.bind(target),
      remove = target.removeEventListener.bind(target);
    target.addEventListener = (type, listener, options) => {
      if (listener) listeners.add(listener);
      add(type, listener, options);
    };
    target.removeEventListener = (type, listener, options) => {
      if (listener) listeners.delete(listener);
      remove(type, listener, options);
    };
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: target,
    });
    Object.defineProperty(window, "auditViewportListeners", {
      value: () => listeners.size,
    });
  });
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Fale com a Jóca" });
  for (let i = 0; i < 3; i++) {
    await launcher.click();
    expect(
      await page.evaluate(() =>
        Reflect.get(window, "auditViewportListeners")(),
      ),
    ).toBe(1);
    await page.evaluate(() => {
      Object.assign(window.visualViewport!, { height: 300, offsetTop: 40 });
      window.visualViewport!.dispatchEvent(new Event("resize"));
    });
    const chat = page.getByRole("dialog", { name: "Jóca", exact: true });
    await expect
      .poll(() => chat.evaluate((el) => el.getBoundingClientRect().bottom))
      .toBeLessThanOrEqual(328);
    await chat.getByRole("textbox").fill("Olá");
    await chat.getByRole("textbox").press("Enter");
    await expect(chat.locator(".assistant").last()).toContainText("Que bom");
    await page.screenshot({
      path:
        ".local/site006b1-" + (info.project.name || "edge") + "-keyboard.png",
    });
    await page.keyboard.press("Escape");
    expect(
      await page.evaluate(() =>
        Reflect.get(window, "auditViewportListeners")(),
      ),
    ).toBe(0);
  }
  // New page with the real visualViewport: browser page scaling, not CSS zoom.
  const zoomPage = await context.newPage();
  await zoomPage.addInitScript(() =>
    sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await zoomPage.goto("/");
  const cdp = await context.newCDPSession(zoomPage);
  await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
  await zoomPage
    .getByRole("button", { name: "Fale com a Jóca" })
    .evaluate((el: HTMLButtonElement) => el.click());
  await expect
    .poll(() => zoomPage.evaluate(() => window.visualViewport!.scale))
    .toBe(2);
  const zoomChat = zoomPage.getByRole("dialog", { name: "Jóca", exact: true });
  await expect
    .poll(() => zoomChat.evaluate((el) => el.getBoundingClientRect().width))
    .toBeLessThanOrEqual(zoomPage.viewportSize()!.width / 2);
  await zoomPage.screenshot({
    path: ".local/site006b1-" + (info.project.name || "edge") + "-zoom200.png",
  });
  const contrast = await zoomChat.evaluate((element) => {
    const luminance = (css: string) => {
      const rgb = css
        .match(/[0-9.]+/g)!
        .slice(0, 3)
        .map(Number)
        .map((c) => {
          const value = c / 255;
          return value <= 0.04045
            ? value / 12.92
            : Math.pow((value + 0.055) / 1.055, 2.4);
        });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };
    const text = element.querySelector(".joca-message p")!,
      bubble = text.parentElement!;
    const a = luminance(window.getComputedStyle(text).color),
      b = luminance(window.getComputedStyle(bubble).backgroundColor);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
  await zoomPage.close();
});
