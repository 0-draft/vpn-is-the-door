import { defineConfig, devices } from "@playwright/test";

const port = 4322;
const origin = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  // trailing slash matters: relative goto("ja/") must resolve under the base path
  use: { baseURL: `${origin}/vpn-is-the-door/`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm exec astro preview --port ${port} --host 127.0.0.1`,
    url: `${origin}/vpn-is-the-door/`,
    reuseExistingServer: !process.env.CI,
  },
});
