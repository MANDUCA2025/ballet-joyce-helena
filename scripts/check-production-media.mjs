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
const derivatives = JSON.parse(
  readFileSync("src/responsive-images.json", "utf8"),
);
for (const [source, image] of Object.entries(derivatives)) {
  if (!assets.has(source.slice(1)))
    throw new Error("Original não autorizado: " + source);
  for (const variant of image.variants) {
    assets.set(variant.src.slice(1), variant);
  }
}
const videoDerivatives = JSON.parse(
  readFileSync("src/video-derivatives.json", "utf8"),
);
const originalVideo = assets.get(videoDerivatives.source.slice(1));
if (!originalVideo || originalVideo.sha256 !== videoDerivatives.sourceSha256)
  throw new Error("Video derivative source must match an authorized original");
for (const asset of videoDerivatives.assets) assets.set(asset.path, asset);
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
