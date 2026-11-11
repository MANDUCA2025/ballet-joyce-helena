import process from "node:process";
import { URL } from "node:url";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile, access, readFile } from "node:fs/promises";
const paths = [
  new URL("../.local/cloudflare/bridge-token", import.meta.url),
  new URL("../workers/joca-ai-teste/.dev.vars", import.meta.url),
];
const exists = await Promise.all(
  paths.map((p) =>
    access(p).then(
      () => true,
      () => false,
    ),
  ),
);
if (exists.every(Boolean)) {
  const token = (await readFile(paths[0], "utf8")).trim();
  const vars = await readFile(paths[1], "utf8");
  if (
    token.length < 32 ||
    !vars.split(/\r?\n/).includes("LOCAL_BRIDGE_TOKEN=" + token)
  )
    throw new Error("Ponte local inconsistente; arquivos preservados.");
  console.log("Configura��o local existente preservada.");
  process.exit(0);
}
if (exists.some(Boolean))
  throw new Error(
    "Configura��o parcial encontrada; arquivos preservados para revis�o.",
  );
await mkdir(new URL("../.local/cloudflare/", import.meta.url), {
  recursive: true,
});
const token = randomBytes(32).toString("hex");
await writeFile(paths[0], token, { flag: "wx", mode: 0o600 });
await writeFile(
  paths[1],
  `LOCAL_BRIDGE_TOKEN=${token}\nALLOW_REAL_INFERENCE=false\nLICENSE_PRIVACY_REVIEWED=false\nACCOUNT_QUOTA_VERIFIED=false\n`,
  { flag: "wx", mode: 0o600 },
);
console.log(
  "Ponte local preparada. Token não exibido. Inferência real desativada.",
);
