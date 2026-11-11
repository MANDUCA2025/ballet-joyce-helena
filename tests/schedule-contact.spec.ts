import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import {
  scheduleContactConfig,
  scheduleContactUrl,
} from "../src/schedule-contact";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("four safe modality links and no public schedules or internal notices", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4174");
  const names = ["Baby", "Pré-Ballet", "Infantil", "Preparatório"];
  const buttons = page.getByRole("button", {
    name: "Consultar horários",
    exact: true,
  });
  await expect(buttons).toHaveCount(4);
  for (const [index, name] of names.entries()) {
    const button = buttons.nth(index);
    await button.click();
    const chat = page.getByRole("dialog", { name: "Jóca", exact: true });
    await expect(
      chat.getByText("Gostaria de consultar os horários do " + name, {
        exact: true,
      }),
    ).toBeVisible();
    const link = chat.getByRole("link", { name: "WhatsApp principal" });
    const url = new URL((await link.getAttribute("href"))!);
    expect(url.origin + url.pathname).toBe("https://wa.me/5514998519343");
    expect(url.searchParams.get("text")).toContain(
      "dias e horários das aulas de " + name,
    );
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link).toHaveAttribute("target", "_blank");
    await page.keyboard.press("Escape");
    await expect(button).toBeFocused();
  }
  await expect(page.locator("body")).not.toContainText(
    /Segunda-feira|Quarta-feira|18h|19h|20h|Turma conjunta|Ponta · 2º ano/,
  );
  await expect(page.locator("footer")).toContainText(
    "Desenvolvido por MANDUCA TECH",
  );
  await expect(page.locator("footer")).not.toContainText(
    "Prévia institucional",
  );
  await expect(page.locator(".home-hero-photo figcaption")).toHaveText(
    "Cada conquista merece ser celebrada.",
  );
  await expect(page.locator(".home-hero-photo")).not.toContainText(
    "uso de imagem autorizado",
  );
  await expect(page.locator(".photo-open")).toHaveCount(14);
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  for (const [width, name] of [
    [1440, "desktop"],
    [375, "mobile"],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page
      .locator("#modalidades")
      .screenshot({ path: ".local/site005e-modalidades-" + name + ".png" });
    await page
      .locator("footer")
      .screenshot({ path: ".local/site005e-footer-" + name + ".png" });
  }
});
test("Jóca disabled and editorial schedule absent from build", async ({
  request,
}) => {
  expect(scheduleContactConfig.destination).toBe("joca");
  expect(scheduleContactConfig.jocaEnabled).toBe(true);
  expect(scheduleContactUrl("Baby", "joca")).toBeNull();
  expect(scheduleContactUrl("Baby", "whatsapp")).toContain(
    "https://wa.me/5514998519343",
  );
  for (const entry of readdirSync("dist", {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!entry.isFile() || !entry.name.endsWith(".js")) continue;
    const code = readFileSync(entry.parentPath + "/" + entry.name, "utf8");
    expect(code).not.toMatch(
      /infantil-preparatorio-sabado|ponta-segundo-ano|Segunda-feira|Quarta-feira|novemberSchedule|18h|19h|20h/,
    );
  }
  const response = await request.get(
    "http://127.0.0.1:5174/editorial/november-schedule.ts",
  );
  expect(response.status()).toBe(403);
});
