import { test, expect } from "@playwright/test";
import { content } from "../src/content";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    window.sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("founder story expands by keyboard, preserves supplied history and collapses", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("#fundadora");
  const open = section.getByRole("button", { name: "Conheça nossa fundadora" });
  await expect(open).toHaveAttribute("aria-expanded", "false");
  const panel = page.locator("#" + (await open.getAttribute("aria-controls")));
  await expect(panel).toBeHidden();
  await open.focus();
  await page.keyboard.press("Enter");
  await expect(
    section.getByRole("button", { name: "Recolher história da fundadora" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  await expect(panel.locator("p")).toHaveText(content.founder.story);
  await expect(
    section.getByRole("button", { name: "Recolher história da fundadora" }),
  ).toBeFocused();
  await page.keyboard.press("Space");
  await expect(panel).toBeHidden();
  await page
    .getByRole("button", { name: "Saiba mais sobre nossa equipe" })
    .click();
  await expect(
    page.getByText(content.team.paragraphs[4], { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Recolher apresentação da equipe" })
    .click();
  await expect(
    page.getByText(content.team.paragraphs[4], { exact: true }),
  ).toBeHidden();
});
test("official photo failures keep the three sections available", async ({
  page,
}) => {
  await page.route("**/images/joyce-helena-*.png", (r) =>
    r.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/");
  for (const id of ["escola", "fundadora", "equipe"]) {
    const section = page.locator("#" + id);
    await section.scrollIntoViewIfNeeded();
    await expect(
      section.getByText("Fotografia indisponível no momento.", { exact: true }),
    ).toBeVisible();
    await expect(section.locator(".official-photo img")).toHaveCount(0);
  }
  await expect(
    page.getByRole("button", { name: "Conheça nossa fundadora" }),
  ).toBeEnabled();
});
test("responsive institutional sections and desktop/mobile captures", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
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
    for (const id of ["escola", "fundadora", "equipe"]) {
      const section = page.locator("#" + id);
      await section.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          section
            .locator(".official-photo img")
            .evaluateAll((imgs) =>
              imgs.every(
                (i) =>
                  i instanceof HTMLImageElement &&
                  i.complete &&
                  i.naturalWidth > 0,
              ),
            ),
        )
        .toBe(true);
      await section.screenshot({ path: `.local/site004-${id}-${name}.png` });
    }
    await page
      .locator(".school-presentation")
      .screenshot({ path: `.local/site004-sections-${name}.png` });
  }
});
