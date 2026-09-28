import { defineConfig, devices } from '@playwright/test';

/**
 * Every browser test runs against the local production build (`pnpm build` then `astro preview`),
 * never against Vercel. `e2e` runs on every PR; `visual` runs only on PRs into main.
 */
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'e2e', testDir: 'tests/e2e', use: { ...devices['Desktop Chrome'] } },
    { name: 'visual', testDir: 'tests/visual', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm --filter @harbor/docs preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
