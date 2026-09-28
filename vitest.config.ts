import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'infra',
          include: ['tests/infra/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'tokens',
          root: 'packages/tokens',
          include: ['test/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'a11y',
          include: ['packages/**/src/**/*.a11y.test.tsx'],
          environment: 'jsdom',
        },
      },
    ],
  },
});
