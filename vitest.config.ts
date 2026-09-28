import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['packages/react/src/**/*.{ts,tsx}', 'packages/tokens/src/**/*.ts'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.d.ts', '**/index.ts', 'packages/react/src/states.ts'],
      reporter: ['text-summary', 'json-summary', 'html'],
      reportsDirectory: 'coverage',
      thresholds: {
        'packages/react/src/**': { statements: 90, lines: 90 },
        'packages/tokens/src/**': { statements: 100, lines: 100 },
      },
    },
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
        extends: './packages/react/vite.config.ts',
        test: {
          name: 'react',
          root: 'packages/react',
          include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.ts'],
          exclude: ['src/**/*.a11y.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['test/setup.ts'],
          css: { include: /.+/, modules: { classNameStrategy: 'non-scoped' } },
        },
      },
      {
        extends: './packages/react/vite.config.ts',
        test: {
          name: 'a11y',
          root: 'packages/react',
          include: ['src/**/*.a11y.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['test/setup.ts'],
          css: { include: /.+/, modules: { classNameStrategy: 'non-scoped' } },
        },
      },
    ],
  },
});
