import { test, expect } from "@playwright/test";
import { content } from "../src/content";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    window.sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("restored founder story and official team keyboard expansion", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("#fundadora");
  await expect(section.locator(".founder-summary")).toHaveText(
    content.founder.summary,
  );
  const toggle = section.getByRole("button");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(section.locator(".story-expanded p")).toHaveText(
    content.founder.story,
  );
  await page.keyboard.press("Space");
  await expect(section.locator(".story-expanded")).toBeHidden();
  await page
    .getByRole("button", { name: "Saiba mais sobre nossa equipe" })
    .focus();
  await page.keyboard.press("Enter");
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
  await page.route(/\/images\/(?:optimized\/)?joyce-helena-/, (r) =>
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
  await expect(page.locator("#fundadora .founder-summary")).toBeVisible();
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
