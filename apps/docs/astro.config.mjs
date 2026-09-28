import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// Fully static output: no adapter, no server functions. React hydrates only live demos.
export default defineConfig({
  site: 'https://harbor-ui.vercel.app',
  output: 'static',
  trailingSlash: 'never',
  integrations: [react(), mdx()],
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
