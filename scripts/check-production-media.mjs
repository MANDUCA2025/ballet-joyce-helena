import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, relative } from "node:path";
import { argv } from "node:process";
const registry = JSON.parse(
  readFileSync("src/media-authorization.json", "utf8"),
);
const root = resolve(argv[2] ?? "dist");
const assets = new Map(
  registry.assets.filter((a) => a.authorized === true).map((a) => [a.path, a]),
);
const found = new Set();
for (const entry of readdirSync(root, {
  recursive: true,
  withFileTypes: true,
})) {
  if (!entry.isFile()) continue;
  const file = resolve(entry.parentPath, entry.name),
    path = relative(root, file).replaceAll("\\", "/");
  if (
    root === resolve("dist") &&
    (path === "index.html" || /^assets\/[^/]+\.(js|css)$/.test(path))
  )
    continue;
  const item = assets.get(path);
  if (!item) throw new Error("Arquivo sem autorização editorial: " + path);
  if (/\.(png|jpe?g)\.(png|jpe?g)$/i.test(path))
    throw new Error("Extensão duplicada: " + path);
  if (
    createHash("sha256").update(readFileSync(file)).digest("hex") !==
    item.sha256
  )
    throw new Error("SHA-256 diferente do aprovado: " + path);
  found.add(path);
}
for (const path of assets.keys())
  if (!found.has(path)) throw new Error("Mídia autorizada ausente: " + path);
console.log("Mídias autorizadas verificadas por SHA-256: " + found.size);
