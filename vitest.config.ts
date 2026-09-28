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
