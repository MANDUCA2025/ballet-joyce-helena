import { test, expect } from "@playwright/test";
for (const width of [320, 375, 390, 768, 1024, 1440])
  test(`quick replies and static local conversation ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 850 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() =>
      sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
    );
    const api: string[] = [];
    await page.route("**/api/**", (r) => {
      api.push(r.request().url());
      return r.abort();
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Fale com a Jóca" }).click();
    const quick = page.getByRole("navigation", {
      name: "Sugestões de perguntas",
    });
    await expect(quick.getByRole("button")).toHaveCount(6);
    if ([375, 1440].includes(width)) {
      await quick.scrollIntoViewIfNeeded();
      await page.screenshot({path: `.local/site007a1-atalhos-${width}.png`});
    }
    const enrollment = quick.getByRole("button", {
      name: "Como fazer matrícula",
    });
    await enrollment.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".joca-message.assistant").last()).toContainText(
      "não realiza matrícula",
    );
    await expect(page.getByRole("textbox")).toBeFocused();
    await quick.getByRole("button", { name: "Quanto custa o ballet?" }).click();
    await expect(page.locator(".joca-message.assistant").last()).toContainText(
      "valores ou mensalidades",
    );
    await page.getByRole("textbox").fill("E isso?");
    await page.getByRole("textbox").press("Enter");
    await expect(page.locator(".joca-message.assistant").last()).toContainText(
      "valores ou mensalidades",
    );
    await expect(page.getByRole("dialog")).not.toContainText(
      /Autorizar envio|Simulação local/,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const button of await quick.getByRole("button").all())
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    if ([375, 1440].includes(width))
      await page.screenshot({ path: `.local/site007a1-joca-${width}.png` });
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Fale com a Jóca" }),
    ).toBeFocused();
    await page.getByRole("button", { name: "Fale com a Jóca" }).click();
    await page.getByRole("textbox").fill("E isso?");
    await page.getByRole("textbox").press("Enter");
    await expect(page.locator(".joca-message.assistant").last()).toContainText(
      "Ainda não tenho essa informação",
    );
    expect(api).toEqual([]);
  });
