/**
 * Lighthouse CI against the local production build (never Vercel): Home, one component page and the lab.
 * Assertions mirror the plan: performance, accessibility and best practices at 95 or more.
 * Results are uploaded to temporary public storage so the CI log links to the full report.
 */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm --filter @harbor/docs preview',
      startServerReadyPattern: 'localhost:4321',
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/components/button',
        'http://localhost:4321/lab',
      ],
      numberOfRuns: 3,
      settings: { chromeFlags: '--no-sandbox --headless=new' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95, aggregationMethod: 'median-run' }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
