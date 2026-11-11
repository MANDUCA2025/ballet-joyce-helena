import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({
  ...base,
  projects: [{ name: "chrome", use: { ...base.use, channel: "chrome" } }],
  testMatch: [
    "**/joca-audit.spec.ts",
    "**/joca-mobile.spec.ts",
    "**/joca-chat.spec.ts",
  ],
});
