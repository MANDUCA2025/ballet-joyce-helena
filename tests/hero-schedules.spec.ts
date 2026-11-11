import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { content } from "../src/content";
import {
  novemberSchedule,
  jointSaturday,
} from "../editorial/november-schedule";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("hero original integrity, public build and previous photograph remain intact", async ({
  page,
}) => {
  const proof = JSON.parse(
    readFileSync(".local/site005c-integrity.json", "utf8"),
  );
  for (const path of [
    proof.original,
    "public/images/hero-joyce-helena.png",
    "dist/images/hero-joyce-helena.png",
  ]) {
    expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe(
      proof.sha256,
    );
  }
  await page.goto("http://127.0.0.1:4174");
  const photo = page.locator(".home-hero-photo img");
  await expect(photo).toHaveAttribute("src", "/images/hero-joyce-helena.png");
  await expect
    .poll(() => photo.evaluate((i) => (i as HTMLImageElement).naturalWidth))
    .toBe(proof.width);
  await expect(photo).toHaveCSS("object-fit", "contain");
  await expect(
    page.locator(".photo-open img[src='/images/escola/aula-acolhimento.png']"),
  ).toHaveCount(1);
  await expect(page.locator(".photo-open")).toHaveCount(14);
});
test("November schedule, shared class and pending second-year Ponta", async ({
  page,
}) => {
  await page.goto("/");
  const expected = [
    ["Segunda-feira", "18h", "Quarta-feira", "18h", "Sábado", "10h"],
    ["Terça-feira", "19h", "Quinta-feira", "19h", "Sábado", "9h"],
    ["Segunda-feira", "19h", "Quarta-feira", "19h", "Sábado", "11h"],
    [
      "Terça e quinta-feira",
      "20h",
      "Sábado",
      "11h",
      "Ponta · 2º ano",
      "A confirmar",
    ],
  ];
  for (const [index, rows] of Object.values(novemberSchedule).entries()) {
    expect(
      rows.flatMap((row) => [row.days, row.time ?? "A confirmar"]),
    ).toEqual(expected[index]);
  }
  await expect(page.locator(".schedule-list")).toHaveCount(0);
  expect(novemberSchedule.Infantil[2]).toBe(jointSaturday);
  expect(novemberSchedule.Preparatório[1]).toBe(jointSaturday);
  expect(novemberSchedule.Preparatório[2].time).toBeNull();
});
test("minimal schedule data and no spreadsheet exported", () => {
  const allowed = ["id", "days", "time", "note"];
  for (const rows of Object.values(novemberSchedule))
    for (const row of rows) {
      expect(Object.keys(row).every((key) => allowed.includes(key))).toBe(true);
    }
  const schedule = JSON.stringify(novemberSchedule);
  expect(schedule).not.toMatch(
    /mensalidade|pagamento|cpf|aluna|matrícula|status/i,
  );
  expect(Object.keys(novemberSchedule)).toEqual([
    "Baby",
    "Pré-Ballet",
    "Infantil",
    "Preparatório",
  ]);
  for (const base of ["src", "public", "dist"]) {
    expect(
      readdirSync(base, { recursive: true }).some((name) =>
        /\.(xlsx?|csv)$/i.test(String(name)),
      ),
    ).toBe(false);
  }
  expect(content.hero.photo.authorized).toBe(true);
});
test("header logo, responsive schedules and desktop/mobile captures", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const logo = page.locator(".identity img");
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("src", "/images/logo-joyce-helena.jpg");
    await expect(logo).toHaveCSS("width", width >= 960 ? "88px" : "60px");
    await expect(logo).toHaveCSS("height", width >= 960 ? "88px" : "60px");
    await expect(page.locator(".identity small")).toHaveCSS(
      "font-size",
      width >= 960 ? "12px" : "10px",
    );
    const header = await page.locator(".site-header").boundingBox();
    expect(header!.height).toBeLessThan(140);
  }
  for (const [width, name] of [
    [1440, "desktop"],
    [375, "mobile"],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page
      .locator(".site-header")
      .screenshot({ path: ".local/site005c-header-" + name + ".png" });
    await page
      .locator(".home-hero")
      .screenshot({ path: ".local/site005c-hero-" + name + ".png" });
    await page
      .locator("#modalidades")
      .screenshot({ path: ".local/site005c-horarios-" + name + ".png" });
  }
});
