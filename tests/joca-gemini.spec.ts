import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("consent is affirmative, prior local conversation excluded, revoke and close erase AI context", async ({
  page,
}) => {
  const payloads: {
    message: string;
    history: { role: string; text: string }[];
    consent: string;
  }[] = [];
  await page.route("**/api/joca/config", (route) =>
    route.fulfill({ json: { available: true } }),
  );
  await page.route("**/api/joca/chat", async (route) => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill({ json: { text: "Resposta simulada para revisão." } });
  });
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Fale com a Jóca" });
  await launcher.click();
  const input = page.getByRole("textbox", { name: "Mensagem para a Jóca" });
  await input.fill("Olá, conversa anterior somente local");
  await input.press("Enter");
  await expect(
    page.getByText("Ainda não tenho essa informação.", { exact: false }),
  ).toBeVisible();
  expect(payloads).toHaveLength(0);
  await expect(page.getByText(/lidas por revisores humanos/)).toBeVisible();
  await page
    .getByRole("button", {
      name: "Autorizar envio das próximas mensagens à IA",
    })
    .click();
  for (let i = 0; i < 5; i++) {
    await input.fill("Pergunta autorizada " + i);
    await input.press("Enter");
    await expect(page.getByRole("status")).toHaveText(
      "IA Gemini · uso autorizado",
    );
    expect(payloads).toHaveLength(i + 1);
  }
  expect(payloads[0].history).toEqual([]);
  expect(
    payloads.every(
      (p) => p.consent === "gemini-free-v1" && p.history.length <= 6,
    ),
  ).toBe(true);
  expect(payloads[4].history).toHaveLength(6);
  expect(JSON.stringify(payloads)).not.toContain("conversa anterior");
  await page
    .getByRole("button", { name: "Voltar ao atendimento local" })
    .click();
  await input.fill("Onde fica a escola?");
  await input.press("Enter");
  await expect(page.locator(".joca-message.assistant").last()).toContainText(
    "Alves Seabra",
  );
  expect(payloads).toHaveLength(5);
  await page
    .getByRole("button", {
      name: "Autorizar envio das próximas mensagens à IA",
    })
    .click();
  await input.fill("Nova autorização");
  await input.press("Enter");
  await expect(page.getByRole("status")).toHaveText(
    "IA Gemini · uso autorizado",
  );
  expect(payloads[5].history).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(launcher).toBeFocused();
  await launcher.click();
  await expect(
    page.getByRole("button", {
      name: "Autorizar envio das próximas mensagens à IA",
    }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});
test("IA errors fall back locally without rendering server errors or unsafe HTML; no duplicated sends", async ({
  page,
}) => {
  let calls = 0;
  await page.route("**/api/joca/config", (r) =>
    r.fulfill({ json: { available: true } }),
  );
  await page.route("**/api/joca/chat", async (r) => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, 150));
    await r.fulfill({ status: 429, json: { error: "technical-secret" } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Fale com a Jóca" }).click();
  await page
    .getByRole("button", {
      name: "Autorizar envio das próximas mensagens à IA",
    })
    .click();
  const input = page.getByRole("textbox");
  await input.fill("Onde fica a escola?");
  await input.press("Enter");
  await input.press("Enter");
  await expect(page.locator(".joca-message.assistant").last()).toContainText(
    "A IA está indisponível",
  );
  await expect(page.locator(".joca-message.assistant").last()).toContainText(
    "Alves Seabra",
  );
  expect(calls).toBe(1);
  await expect(page.getByRole("dialog")).not.toContainText("technical-secret");
  await page.route("**/api/joca/chat", (r) =>
    r.fulfill({ json: { text: '<img src=x onerror="alert(1)">' } }),
  );
  await input.fill("Oi");
  await input.press("Enter");
  await expect(page.locator(".joca-message.assistant").last()).toContainText(
    "<img",
  );
  await expect(page.locator(".joca-message img")).toHaveCount(0);
});
test("optional consent remains inside scrollable panel on mobile and desktop; default UI unchanged", async ({
  page,
}) => {
  await page.route("**/api/joca/config", (r) =>
    r.fulfill({ json: { available: true } }),
  );
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await expect(page.locator(".home-hero-photo img")).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator(".home-hero-photo img")
          .evaluate((img) => (img as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    await page.getByRole("button", { name: "Fale com a Jóca" }).click();
    const authorize = page.getByRole("button", {
      name: "Autorizar envio das próximas mensagens à IA",
    });
    await expect(authorize).toBeVisible();
    await authorize.scrollIntoViewIfNeeded();
    const rect = await page.getByRole("dialog").boundingBox();
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width);
    await expect(page.getByRole("textbox")).toBeVisible();
    if ([375, 1440].includes(width))
      await page.screenshot({ path: `.local/site006c1-consent-${width}.png` });
    await page.keyboard.press("Escape");
  }
});
test("configuration unavailable and failed browser transport preserve local fallback", async ({
  page,
}) => {
  await page.route("**/api/joca/config", (r) => r.abort());
  await page.goto("/");
  await page.getByRole("button", { name: "Fale com a Jóca" }).click();
  await expect(
    page.getByRole("button", {
      name: "Autorizar envio das próximas mensagens à IA",
    }),
  ).toHaveCount(0);
  const input = page.getByRole("textbox");
  await input.fill("Onde fica a escola?");
  await input.press("Enter");
  await expect(page.locator(".joca-message.assistant").last()).toContainText(
    "Alves Seabra",
  );
  await page.keyboard.press("Escape");
  await page.route("**/api/joca/config", (r) =>
    r.fulfill({ json: { available: true } }),
  );
  await page.route("**/api/joca/chat", (r) => r.abort());
  await page.getByRole("button", { name: "Fale com a Jóca" }).click();
  await page
    .getByRole("button", {
      name: "Autorizar envio das próximas mensagens à IA",
    })
    .click();
  await input.fill("Quero aula experimental");
  await input.press("Enter");
  await expect(page.locator(".joca-message.assistant").last()).toContainText(
    "resposta local",
  );
});

test("client timeout and invalid replies retain local attendance", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = AbortSignal.timeout.bind(AbortSignal);
    AbortSignal.timeout = (ms) => original(ms === 12000 ? 60 : ms);
  });
  await page.route("**/api/joca/config", (r) =>
    r.fulfill({ json: { available: true } }),
  );
  await page.route("**/api/joca/chat", async (r) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await r.fulfill({ json: { text: "Resposta atrasada" } }).catch(() => {});
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Fale com a Jóca" }).click();
  await page
    .getByRole("button", {
      name: "Autorizar envio das próximas mensagens à IA",
    })
    .click();
  const input = page.getByRole("textbox");
  await input.fill("Quais modalidades?");
  await input.press("Enter");
  await expect(page.locator(".joca-message.assistant").last()).toContainText(
    "A IA está indisponível",
  );
  await expect(page.locator(".joca-message.assistant").last()).toContainText(
    "Baby",
  );
  await expect(page.getByRole("dialog")).not.toContainText("Resposta atrasada");
  for (const json of [
    { text: "" },
    { text: "x".repeat(2001) },
    { text: 3 },
    {},
  ]) {
    await page.route("**/api/joca/chat", (r) => r.fulfill({ json }));
    const previous = await page.locator(".joca-message.assistant").count();
    await input.fill("Onde fica?");
    await input.press("Enter");
    await expect(page.locator(".joca-message.assistant")).toHaveCount(
      previous + 1,
    );
    await expect(page.locator(".joca-message.assistant").last()).toContainText(
      "resposta local",
    );
  }
});
