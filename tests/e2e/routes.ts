import { components } from './components.data';

/** Pages that must exist. The crawl in site.spec also finds any page linked from these. */
export const routes = [
  '/',
  '/foundations',
  '/foundations/color',
  '/foundations/type-and-space',
  '/foundations/motion',
  '/components',
  ...components.map((c) => `/components/${c.slug}`),
];
