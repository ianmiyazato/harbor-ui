/**
 * Build-time generator for the component pages:
 * - props: parsed from the React package's TypeScript types with react-docgen-typescript,
 * - tokens: every `--hb-*` variable each component's CSS module reads.
 * Writes src/generated/components.json (git-ignored; regenerated on every build and typecheck).
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import docgen from 'react-docgen-typescript';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '../../../packages/react/src');
const out = resolve(here, '../src/generated/components.json');

/** Component folder → exported components documented on its page. */
const folders: Record<string, string[]> = {
  button: ['Button'],
  'icon-button': ['IconButton'],
  input: ['Input'],
  checkbox: ['Checkbox'],
  switch: ['Switch'],
  badge: ['Badge'],
  skeleton: ['Skeleton'],
  select: ['Select'],
  tabs: ['Tabs', 'TabList', 'Tab', 'TabPanel'],
  dialog: ['Dialog'],
  tooltip: ['Tooltip'],
  toast: ['ToastProvider'],
};

/** Components that compose another component also inherit its tokens. */
const composes: Record<string, string[]> = { 'icon-button': ['button'], toast: ['button'] };

const parser = docgen.withCustomConfig(resolve(src, '../tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Only props Harbor declares: not the hundreds inherited from HTML attributes or Radix.
  propFilter: (prop) =>
    prop.name !== 'asChild' &&
    (!prop.parent || prop.parent.fileName.includes('packages/react/src')),
});

const result: Record<string, unknown> = {};
for (const [folder, names] of Object.entries(folders)) {
  const dir = join(src, folder);
  const files = readdirSync(dir)
    .filter((f) => /^[A-Z]\w+\.tsx$/.test(f) && !f.includes('.states'))
    .map((f) => join(dir, f));
  const docs = parser.parse(files).filter((d) => names.includes(d.displayName));
  const css = [folder, ...(composes[folder] ?? [])]
    .flatMap((f) =>
      readdirSync(join(src, f))
        .filter((name) => name.endsWith('.module.css'))
        .map((name) => readFileSync(join(src, f, name), 'utf8')),
    )
    .join('\n');
  const tokens = [...new Set([...css.matchAll(/var\((--hb-[a-z0-9-]+)/g)].map((m) => m[1]))].sort();
  result[folder] = {
    components: names.map((name) => {
      const doc = docs.find((d) => d.displayName === name);
      return {
        name,
        description: doc?.description ?? '',
        props: Object.values(doc?.props ?? {})
          .map((p) => ({
            name: p.name,
            type: p.type.name,
            required: p.required,
            default:
              String(p.defaultValue?.value ?? p.tags?.default ?? '').replace(/^'(.*)'$/, '$1') ||
              null,
            description: p.description,
          }))
          .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name)),
      };
    }),
    tokens,
  };
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
console.log(`generate-props: ${Object.keys(result).length} component pages → ${out}`);
