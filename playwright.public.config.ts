import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests-public",
  workers: 1,
  use: { baseURL: "http://127.0.0.1:4175", channel: "msedge" },
  webServer: {
    command: "python -m http.server 4175 --bind 127.0.0.1 --directory dist",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: false,
  },
  reporter: "list",
});
