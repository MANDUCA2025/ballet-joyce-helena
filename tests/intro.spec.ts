import { test, expect } from "@playwright/test";
const key = "joyce-helena:intro-seen:v1";
test("first visit, actual video, manual audio, keyboard skip and same-session return", async ({
  page,
}) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const video = page.locator("video");
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(0);
  const metadata = await video.evaluate((v) => {
    const p = v as HTMLVideoElement;
    return {
      width: p.videoWidth,
      height: p.videoHeight,
      duration: p.duration,
      muted: p.muted,
    };
  });
  console.log("Official video metadata:", metadata);
  expect(metadata.width / metadata.height).toBeCloseTo(16 / 9, 2);
  expect(metadata.muted).toBe(true);
  await expect(
    page.getByRole("button", { name: "Pular apresentação" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Ativar som" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Desativar som" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(
    false,
  );
  await page.getByRole("button", { name: "Pular apresentação" }).click();
  await expect(dialog).toHaveCount(0);
  expect(
    await page.evaluate((k) => window.sessionStorage.getItem(k), key),
  ).toBe("1");
  await page.reload();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: /Assistir à apresentação/ }).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /Assistir à apresentação/ }),
  ).toBeFocused();
});
test("automatically reveals homepage after actual video ending", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 15000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
test("missing video and blocked autoplay cannot block entry", async ({
  page,
}) => {
  await page.route("**/videos/joca-apresentacao-web.mp4", (r) =>
    r.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.unroute("**/videos/joca-apresentacao-web.mp4");
  await page.addInitScript(() => {
    window.sessionStorage.clear();
    window.HTMLMediaElement.prototype.play = () =>
      Promise.reject(new Error("Autoplay blocked"));
  });
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Iniciar apresentação" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pular apresentação" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
test("reduced motion offers manual intro, replay remains available, storage denial is safe", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Iniciar apresentação" }),
  ).toBeVisible();
  expect(
    await page.locator("video").evaluate((v) => (v as HTMLVideoElement).paused),
  ).toBe(true);
  await page.getByRole("button", { name: "Pular apresentação" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    });
  });
  await page.reload();
  await page.getByRole("button", { name: "Pular apresentação" }).click();
  await page.getByRole("button", { name: /Assistir à apresentação/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Pular apresentação" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
for (const [width, height, name] of [
  [1440, 1000, "desktop"],
  [375, 812, "mobile"],
] as const) {
  test(`intro screenshot and proportions ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const video = page.locator("video");
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
      .toBeGreaterThan(0.5);
    const box = await video.boundingBox();
    expect(box!.width / box!.height).toBeCloseTo(16 / 9, 1);
    expect(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await expect(
      page.getByRole("button", { name: "Pular apresentação" }),
    ).toBeInViewport();
    await page.screenshot({ path: `.local/site002-intro-${name}.png` });
  });
}

test("slow video never expires before playback and unfinished visit is not marked seen", async ({
  page,
}) => {
  await page.route("**/videos/joca-apresentacao-web.mp4", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await route.continue();
  });
  await page.goto("/");
  await page.waitForTimeout(4300);
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate((k) => sessionStorage.getItem(k), key)).toBeNull();
  await expect(page.locator("main")).toHaveCount(0);
  await expect
    .poll(
      () =>
        page
          .locator("video")
          .evaluate((v) => (v as HTMLVideoElement).currentTime),
      { timeout: 10000 },
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Pular apresentação" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("manual start recovers blocked autoplay and new browser session shows intro", async ({
  page,
  browser,
}) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!navigator.userActivation.isActive)
        return Promise.reject(new DOMException("Blocked", "NotAllowedError"));
      return play.call(this);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Iniciar apresentação" }).click();
  await expect
    .poll(() =>
      page
        .locator("video")
        .evaluate((v) => (v as HTMLVideoElement).currentTime),
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Pular apresentação" }).click();
  const fresh = await browser.newContext();
  try {
    const other = await fresh.newPage();
    await other.goto("http://127.0.0.1:5174");
    await expect(other.getByRole("dialog")).toBeVisible();
    expect(
      await other.evaluate((k) => sessionStorage.getItem(k), key),
    ).toBeNull();
  } finally {
    await fresh.close();
  }
});

test("unfinished reload and section navigation do not replay; a new tab has its own session", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate((k) => sessionStorage.getItem(k), key)).toBeNull();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".joca-opening")).toHaveCount(0);
  expect(await page.evaluate((k) => sessionStorage.getItem(k), key)).toBeNull();
  await page.locator('a[href="#modalidades"]').first().click();
  await expect(page).toHaveURL(/#modalidades$/);
  await expect(page.locator(".joca-opening")).toHaveCount(0);
  await page.getByRole("button", { name: /Assistir/ }).click();
  await expect(page.locator(".joca-opening")).toBeVisible();
  await page.getByRole("button", { name: /Pular/ }).click();
  expect(await page.evaluate((k) => sessionStorage.getItem(k), key)).toBe("1");
  const tab = await context.newPage();
  try {
    await tab.goto("/");
    await expect(tab.locator(".joca-opening")).toBeVisible();
    expect(
      await tab.evaluate((k) => sessionStorage.getItem(k), key),
    ).toBeNull();
  } finally {
    await tab.close();
  }
});

test("media failure releases the site without recording completion or retrying on reload", async ({
  page,
}) => {
  await page.route("**/videos/joca-apresentacao-web.mp4", (r) =>
    r.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  expect(await page.evaluate((k) => sessionStorage.getItem(k), key)).toBeNull();
  await page.reload();
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator(".joca-opening")).toHaveCount(0);
});
