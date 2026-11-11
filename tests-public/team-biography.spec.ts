import {test,expect} from "@playwright/test";
import {createHash} from "node:crypto";
import {content} from "../src/content";
import {answerQuestion} from "../src/joca/chat-service";
const official=["Joyce Helena — Fundadora e Professora.","Ester Rodrigues — Professora.","Mary — Auxiliar.","Natália Ramos — Administração Geral."];
test("biography exactly matches preserved original and official team has no invented roles",()=>{
 // SHA-256 da narrativa preservada e aprovada por AUT-SITE-007C-001.
 const digest=createHash("sha256").update(JSON.stringify([content.founder.summary,content.founder.story])).digest("hex");
 expect(digest).toBe("51e38a389b1b4a6b56e4ea89457fb18994e44eac77947b98c2dd2a58aa113385");
 expect(content.team.members.map(m=>`${m.name} — ${m.role}.`)).toEqual(official);
 expect(content.team.paragraphs.join(" ")).not.toContain("duas professoras");
 expect(content.modalities.items.every(m=>m.ageRange===null)).toBe(true);
});
test("Joca recognizes supplied team names and functions without personal contacts or biography",()=>{
 for(const q of ["Quem são as professoras?","Quem é Ester Rodrigues?","Ester","Quem é Mary?","Qual a função da Mary?","Quem é Natália Ramos?","Quem cuida da administração?","Como falar com a equipe?"]) {
  const reply=answerQuestion(q);
  for(const line of official)expect(reply.text,q).toContain(line);
  expect(reply.text).not.toMatch(/duas professoras|Desde criança|Natural de Bauru/);
  expect(reply.links?.[0].url).toMatch(/^https:\/\/wa.me\/5514998519343/);
 }
 expect(answerQuestion("Quem é Joyce Helena?").text).toContain("Joyce Helena — Fundadora e Professora");
 expect(answerQuestion("Qual o CPF de Mary?").text).toContain("Não solicito nem forneço dados pessoais");
});
for(const width of [375,1440])test(`restored biography and team static keyboard view ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:"reduce"});
 await page.addInitScript(()=>sessionStorage.setItem("joyce-helena:intro-seen:v1","1"));
 const api:string[]=[];await page.route("**/api/**",r=>{api.push(r.request().url());return r.abort();});
 await page.goto("/");
 const founder=page.locator("#fundadora");const toggle=founder.getByRole("button");
 await toggle.focus();await page.keyboard.press("Enter");
 await expect(toggle).toHaveAttribute("aria-expanded","true");
 await expect(founder.locator(".story-expanded p")).toHaveText(content.founder.story);
 await founder.locator("img").evaluate((i:HTMLImageElement)=>i.decode());
 await founder.screenshot({path:`.local/site007b1-fundadora-${width}.png`});
 await toggle.focus();await page.keyboard.press("Space");await expect(toggle).toHaveAttribute("aria-expanded","false");
 const team=page.locator("#equipe");await team.getByRole("button").focus();await page.keyboard.press("Enter");
 for(const line of official)await expect(team.getByText(line,{exact:true})).toBeVisible();
 await team.locator("img").evaluate((i:HTMLImageElement)=>i.decode());
 await team.screenshot({path:`.local/site007b1-equipe-${width}.png`});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole("button",{name:"Fale com a Jóca"}).click();
 await page.getByRole("textbox").fill("Quem é Mary?");await page.getByRole("textbox").press("Enter");
 await expect(page.locator(".joca-message.assistant").last()).toContainText("Mary — Auxiliar.");
 expect(api).toEqual([]);
});
