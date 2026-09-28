import { defineConfig } from 'vite';

/**
 * Library build: ES modules only, one file per source module so consumers tree-shake
 * to exactly the components they import. React and Radix stay external.
 */
export default defineConfig({
  css: {
    modules: {
      generateScopedName: 'hb-[local]-[hash:base64:5]',
    },
  },
  build: {
    lib: {
      entry: { index: 'src/index.ts', states: 'src/states.ts' },
      formats: ['es'],
      cssFileName: 'styles',
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@radix-ui\//],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
