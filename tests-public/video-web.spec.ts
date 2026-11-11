import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import derivatives from "../src/video-derivatives.json" with { type: "json" };

test("web MP4 preserves original hash and begins with its index", () => {
  const hash = (path: string) =>
    createHash("sha256").update(readFileSync(path)).digest("hex");
  expect(hash("public" + derivatives.source)).toBe(derivatives.sourceSha256);
  for (const asset of derivatives.assets) {
    expect(hash("public/" + asset.path)).toBe(asset.sha256);
    expect(hash("dist/" + asset.path)).toBe(asset.sha256);
  }
  const video = readFileSync("dist/videos/joca-apresentacao-web.mp4");
  const boxes: string[] = [];
  for (let p = 0; p + 8 <= video.length;) {
    boxes.push(video.toString("ascii", p + 4, p + 8));
    const size = video.readUInt32BE(p);
    expect(size).toBeGreaterThanOrEqual(8);
    p += size;
  }
  expect(boxes.indexOf("moov")).toBeLessThan(boxes.indexOf("mdat"));
  expect(video.length).toBeLessThan(
    readFileSync("public" + derivatives.source).length * 0.7,
  );
});

for (const width of [375, 1440]) {
  test(
    "poster, accessible skip and muted web playback " + width,
    async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.route("**/joca-apresentacao-web.mp4", async (r) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await r.continue();
      });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const video = page.locator("video");
      await expect(video).toHaveAttribute(
        "poster",
        "/videos/joca-apresentacao-poster.webp",
      );
      await expect
        .poll(() =>
          page.evaluate(async () => {
            const img = new Image();
            img.src = document.querySelector("video")!.poster;
            await img.decode();
            return img.naturalWidth;
          }),
        )
        .toBe(1280);
      await expect(
        page.getByRole("button", { name: /Pular/ }),
      ).toBeInViewport();
      await page.screenshot({ path: `.local/site007c3a-poster-${width}.png` });
      await expect
        .poll(
          () => video.evaluate((v) => (v as HTMLVideoElement).currentTime),
          { timeout: 10000 },
        )
        .toBeGreaterThan(0);
      expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(
        true,
      );
      await page.getByRole("button", { name: /Pular/ }).click();
      await expect(page.locator("main")).toBeVisible();
    },
  );
}

test("skip is usable while download never completes", async ({ page }) => {
  await page.route("**/joca-apresentacao-web.mp4", () => {});
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Pular/ }).click();
  await expect(page.locator("main")).toBeVisible();
});
