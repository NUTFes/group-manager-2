const { defineConfig, devices } = require("@playwright/test");

const PORT = Number(process.env.PLAYWRIGHT_ADMIN_PORT || 3200);
const API_PORT = Number(process.env.PLAYWRIGHT_ADMIN_API_PORT || 3201);
const baseURL =
  process.env.PLAYWRIGHT_ADMIN_BASE_URL || `http://127.0.0.1:${PORT}`;
const apiURL =
  process.env.PLAYWRIGHT_ADMIN_API_URL || `http://127.0.0.1:${API_PORT}`;

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 30 * 1000,
  workers: 1,
  expect: {
    timeout: 5 * 1000,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: `PLAYWRIGHT_ADMIN_API_PORT=${API_PORT} node e2e/mock-api.js`,
      url: `${apiURL}/_e2e/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30 * 1000,
    },
    {
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
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
