import { test, expect } from "@playwright/test";
import { answerQuestion } from "../src/joca/chat-service";
import { readFileSync, readdirSync } from "node:fs";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test("local FAQ knowledge and conservative age guidance", () => {
  for (const [question, answer] of [
    ["Quais modalidades existem?", "Baby; Pré-Ballet"],
    ["Minha filha tem 3 anos", "Consulte nossa equipe"],
    ["Qual turma para 10 anos?", "Consulte nossa equipe"],
    ["Qual modalidade para 10 anos?", "Consulte nossa equipe"],
    ["Ela tem 14 anos", "Consulte nossa equipe"],
    ["Onde fica a escola?", "Rua Alves Seabra, 4-30"],
    ["Como consultar horários?", "não posso confirmar horários ou vagas"],
    ["Quero aula experimental", "nem garante vaga"],
    ["Como entrar em contato?", "(14) 99851-9343"],
    ["Qual é o Instagram?", "@balletjoycehelena"],
    ["Quais são os espetáculos?", "Quatro Estações"],
    ["Quem fundou a escola?", "Joyce Helena dos Santos"],
    ["Quanto custa?", "Ainda não tenho essa informação"],
  ]) {
    expect(answerQuestion(question).text.toLowerCase()).toContain(
      answer.toLowerCase(),
    );
  }
  expect(answerQuestion("Qual modalidade para 10 anos?").text).toContain(
    "Não definimos turmas por idade",
  );
  expect(answerQuestion("Qual modalidade para 6 anos?").text).toContain(
    "Consulte nossa equipe",
  );
});
test("chat sends local replies, safe handoff, keyboard, privacy and reload reset", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1")) external.push(r.url());
  });
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Fale com a Jóca" });
  await launcher.focus();
  await page.keyboard.press("Enter");
  const chat = page.getByRole("dialog", { name: "Jóca", exact: true });
  await expect(chat).toBeVisible();
  const input = chat.getByRole("textbox", { name: "Mensagem para a Jóca" });
  await expect(input).toBeFocused();
  await expect(chat).toContainText(
    "respostas locais programadas, sem inteligência artificial",
  );
  await expect(chat).toContainText("Não envie documentos");
  for (const question of [
    "Quais modalidades existem?",
    "Qual modalidade para 10 anos?",
    "Como consultar horários?",
    "Onde fica a escola?",
  ]) {
    await input.fill(question);
    await input.press("Enter");
    await expect(chat.locator(".joca-message.assistant").last()).toHaveText(
      new RegExp(
        question.includes("Onde")
          ? "Rua Alves Seabra"
          : question.includes("horários")
            ? "WhatsApp"
            : question.includes("10")
              ? "Consulte nossa equipe"
              : "Baby",
      ),
    );
  }
  const messageCount = await chat.locator(".joca-message").count();
  await input.fill("  ");
  await expect(
    chat.getByRole("button", { name: "Enviar", exact: true }),
  ).toBeDisabled();
  await expect(chat.locator(".joca-message")).toHaveCount(messageCount);
  for (const link of await chat.locator("a").all())
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(
    await chat.getByRole("link", { name: "Alternativo" }).getAttribute("href"),
  ).toContain("5514996587217");
  await page.keyboard.press("Escape");
  await expect(chat).toBeHidden();
  await expect(launcher).toBeFocused();
  await launcher.click();
  await chat
    .getByRole("button", { name: "Fechar conversa com a Jóca" })
    .focus();
  await page.keyboard.press("Shift+Tab");
  await expect(input).toBeFocused(); // Enviar disabled, input is last focusable
  await page.keyboard.press("Escape");
  expect(external).toEqual([]);
  expect(await page.evaluate(() => Object.keys(window.localStorage))).toEqual(
    [],
  );
  expect(await page.evaluate(() => Object.keys(window.sessionStorage))).toEqual(
    ["joyce-helena:intro-seen:v1"],
  );
  await page.reload();
  await launcher.click();
  await expect(chat.locator(".joca-message")).toHaveCount(1);
});
test("fixed avatar and responsive chat screenshots, viewport height and safe content", async ({
  page,
}) => {
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Fale com a Jóca" });
  await expect(launcher).toHaveCSS("position", "fixed");
  for (const [width, name] of [
    [1440, "desktop"],
    [375, "mobile"],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    const before = await launcher.boundingBox();
    await page.evaluate(() => window.scrollTo(0, 2000));
    const after = await launcher.boundingBox();
    expect(after!.y).toBeCloseTo(before!.y, 0);
    await expect(launcher.locator("img")).toHaveCSS(
      "width",
      width === 1440 ? "60px" : "42px",
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: ".local/site006a-avatar-" + name + ".png" });
    await launcher.click();
    const chat = page.getByRole("dialog", { name: "Jóca", exact: true });
    const input = chat.getByRole("textbox");
    await input.fill("Quais modalidades existem?");
    await input.press("Enter");
    await expect(chat.locator(".assistant").last()).toContainText("Baby");
    await input.fill("Como consultar horários?");
    await input.press("Enter");
    await expect(chat.locator(".assistant").last()).toContainText("WhatsApp");
    await page.screenshot({ path: ".local/site006a-chat-" + name + ".png" });
    await page.keyboard.press("Escape");
  }
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 500 });
    await launcher.click();
    const rect = await page
      .getByRole("dialog", { name: "Jóca", exact: true })
      .boundingBox();
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width);
    expect(rect!.y + rect!.height).toBeLessThanOrEqual(501);
    await page.keyboard.press("Escape");
  }
});
test("build has no secret, remote AI call or editorial schedule", () => {
  for (const file of readdirSync("dist/assets")) {
    if (!file.endsWith(".js")) continue;
    const code = readFileSync("dist/assets/" + file, "utf8");
    expect(code).not.toMatch(
      /sk-[A-Za-z0-9_-]{20,}|api.openai.com|api.anthropic.com|novemberSchedule|ponta-segundo-ano/,
    );
  }
});

test("unknown questions and service failure keep official contacts available", async ({
  page,
}) => {
  await page.route("**/src/joca/chat-service.ts*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body:
        (await response.text()) +
        "\n;localChatService.reply=async()=>{throw new Error('test failure');};",
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Fale com a Jóca" }).click();
  const chat = page.getByRole("dialog", { name: "Jóca", exact: true });
  await chat.getByRole("textbox").fill("Gostaria de informações");
  await chat.getByRole("button", { name: "Enviar", exact: true }).click();
  await expect(chat.locator(".assistant").last()).toContainText(
    "Não consegui preparar a resposta",
  );
  await expect(
    chat.getByRole("link", { name: "WhatsApp principal" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Fale com a Jóca" }),
  ).toBeFocused();
});
