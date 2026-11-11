import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { answerQuestion } from "../src/joca/chat-service";
const removed = /2 a 3 anos|4 a 6 anos|7 a 10 anos|10 a 13 anos|4 a 17 anos|Há sobreposição/;
test("withdrawn editorial facts are absent from public bundle and local answers", () => {
  const code = readdirSync("dist/assets").filter(p => p.endsWith(".js")).map(p => readFileSync("dist/assets/" + p, "utf8")).join("\n");
  expect(code).not.toMatch(removed);
  expect(code).toContain("Conheça nossa fundadora");
  for (const question of ["Quais modalidades existem?", "3 anos", "6 anos", "10 anos", "14 anos", "Quem é Joyce?", "Quando Joyce começou a dançar?", "Quanto custa?", "Quais horários?", "Tem vaga?", "Quero matrícula", "Qual formação da Joyce?"]) {
    const reply = answerQuestion(question).text;
    expect(reply).not.toMatch(removed);
    expect(reply).not.toMatch(/R\$|\d{1,2}h|matrícula confirmada|vaga garantida/);
  }
  for (const age of [2, 3, 4, 6, 7, 10, 13, 17]) {
    const reply = answerQuestion(`Qual turma para ${age} anos?`).text;
    expect(reply).toContain("Consulte nossa equipe");
    expect(reply).not.toMatch(/Baby|Pré-Ballet|Infantil|Preparatório/);
  }
});
for (const width of [375, 1440]) test(`editorial public view and local chat ${width}`, async ({ page }) => {
  await page.setViewportSize({width, height:900});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.addInitScript(() => sessionStorage.setItem("joyce-helena:intro-seen:v1", "1"));
  const api: string[] = [];
  await page.route("**/api/**", route => { api.push(route.request().url()); return route.abort(); });
  await page.goto("/");
  await expect(page.locator("body")).not.toContainText(removed);
  await expect(page.locator("#fundadora button")).toHaveCount(1);
  await expect(page.locator("#fundadora")).toContainText("Joyce Helena dos Santos");
  await expect(page.locator("#modalidades")).not.toContainText("Faixa etária");
  await expect(page.locator("#modalidades").getByRole("button", {name:"Consultar horários"})).toHaveCount(4);
  await page.locator("#modalidades").screenshot({path:`.local/site007a-modalidades-${width}.png`});
  await page.locator("#fundadora").screenshot({path:`.local/site007a-fundadora-${width}.png`});
  await page.getByRole("button", {name:"Fale com a Jóca"}).click();
  await page.getByRole("textbox").fill("Qual modalidade para 10 anos?");
  await page.getByRole("textbox").press("Enter");
  await expect(page.locator(".joca-message.assistant").last()).toContainText("Não definimos turmas por idade");
  await expect(page.getByRole("dialog")).not.toContainText(/Autorizar envio|Simulação local/);
  await page.screenshot({path:`.local/site007a-joca-${width}.png`});
  expect(api).toEqual([]);
});
