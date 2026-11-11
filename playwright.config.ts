import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  use: { baseURL: "http://127.0.0.1:5174", channel: "msedge" },
  webServer: [
    {
      command: "npm run worker:mock",
      url: "http://127.0.0.1:8787/__local_health",
      reuseExistingServer: true,
      env: { WRANGLER_SEND_METRICS: "false" },
    },
    {
      command: "npm run dev",
      url: "http://127.0.0.1:5174",
      reuseExistingServer: true,
    },
    {
      command: "npm run preview",
      url: "http://127.0.0.1:4174",
      reuseExistingServer: true,
    },
  ],
  reporter: "list",
});
