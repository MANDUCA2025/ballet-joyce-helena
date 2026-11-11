import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
test("bundle público não contém integrações, segredos, endereços locais ou código servidor", () => {
  const files = readdirSync("dist", { recursive: true }).map(String);
  expect(
    files.some((p) =>
      /(^|[/\\])(\.env|\.dev.vars|server|workers|functions|editorial|\.local|RELATORIO)/.test(
        p,
      ),
    ),
  ).toBe(false);
  const code = files
    .filter((p) => /\.(js|css|html)$/.test(p))
    .map((p) => readFileSync("dist/" + p, "utf8"))
    .join("\n");
  expect(code).not.toMatch(
    /\/api\/joca\/|localhost|127\.0\.0\.1|GEMINI_API_KEY|LOCAL_BRIDGE_TOKEN|generativelanguage\.googleapis|env\.AI\.run|Iniciar simulação local|Autorizar envio das próximas mensagens à IA/,
  );
});
for (const width of [320, 375, 768, 1024, 1440])
  test(`produção estática ${width}px: navegação, mídias e Jóca somente local`, async ({
    page,
  }) => {
    const issues: string[] = [],
      forbidden: string[] = [];
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() =>
      sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (
        url.origin !== "http://127.0.0.1:4175" ||
        url.pathname.startsWith("/api/")
      ) {
        forbidden.push(url.pathname);
        await route.abort();
      } else await route.continue();
    });
    page.on("pageerror", (error) => issues.push(error.message));
    page.on("response", (r) => {
      if (r.status() >= 400)
        issues.push(String(r.status()) + " " + new URL(r.url()).pathname);
    });
    await page.goto("/");
    const menu = page.getByRole("button", { name: /Abrir menu/ });
    if (await menu.isVisible()) {
      await menu.click();
      await page
        .getByRole("link", { name: "Modalidades", exact: true })
        .first()
        .click();
    }
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((el) => (el as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const brokenAnchors = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((a) => a.getAttribute("href")!)
          .filter(
            (href) =>
              href.length > 1 &&
              !document.getElementById(decodeURIComponent(href.slice(1))),
          ),
      );
    expect(brokenAnchors).toEqual([]);
    for (const name of ["Baby", "Pré-Ballet", "Infantil", "Preparatório"]) {
      const card = page
        .locator("article")
        .filter({ has: page.getByRole("heading", { name, exact: true }) });
      await card.getByRole("button", { name: "Consultar horários" }).click();
      const chat = page.getByRole("dialog", { name: "Jóca", exact: true });
      await expect(
        chat.locator(".joca-message.assistant").last(),
      ).toContainText("WhatsApp");
      await expect(
        chat.getByRole("link", { name: /WhatsApp principal/ }),
      ).toHaveAttribute("href", new RegExp("^https://wa.me/5514998519343"));
      await expect(chat).not.toContainText(
        /simulação|Google Gemini|Cloudflare|Autorizar envio/,
      );
      await page.keyboard.press("Escape");
      await expect(
        card.getByRole("button", { name: "Consultar horários" }),
      ).toBeFocused();
    }
    const launcher = page.getByRole("button", { name: "Fale com a Jóca" });
    await launcher.click();
    const input = page.getByRole("textbox");
    await input.fill("Onde fica a escola?");
    await input.press("Enter");
    await expect(page.locator(".joca-message.assistant").last()).toContainText(
      "Alves Seabra",
    );
    if ([375, 1440].includes(width))
      await page.screenshot({ path: `.local/site007-joca-${width}.png` });
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("link", { name: /@balletjoycehelena/ }).first(),
    ).toHaveAttribute("href", "https://www.instagram.com/balletjoycehelena/");
    expect(issues).toEqual([]);
    expect(forbidden).toEqual([]);
  });
test("vídeo original funciona no servidor estático sem backend", async ({
  page,
}) => {
  await page.goto("/");
  const video = page.locator("video");
  await expect(video).toBeVisible();
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).readyState))
    .toBeGreaterThanOrEqual(2);
  await page.getByRole("button", { name: /Pular apresentação/ }).click();
  await expect(
    page.getByRole("button", { name: "Fale com a Jóca" }),
  ).toBeVisible();
});
