const { defineConfig, devices } = require("@playwright/test");

const PORT = Number(process.env.PLAYWRIGHT_ADMIN_REAL_PORT || 8000);
const baseURL =
  process.env.PLAYWRIGHT_ADMIN_BASE_URL || `http://127.0.0.1:${PORT}`;
const apiURL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://localhost:3000";

module.exports = defineConfig({
  testDir: "./e2e-real",
  timeout: 60 * 1000,
  workers: 1,
  expect: {
    timeout: 15 * 1000,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_OPTIONS: "--openssl-legacy-provider",
      VUE_APP_URL: apiURL,
      VUE_APP_API_URL: apiURL,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
