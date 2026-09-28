import { describe, expect, it } from 'vitest';
import { categories, cssVarName, referencesOf, resolve, themes, tokens } from '../src/index.ts';
import type { ThemedValue } from '../src/index.ts';

const byName = new Map(tokens.map((t) => [t.name, t]));
const semantic = tokens.filter((t) => t.tier === 'semantic');
const primitives = tokens.filter((t) => t.tier === 'primitive');

describe('token schema', () => {
  it('defines a real token set', () => {
    expect(primitives.length).toBeGreaterThan(50);
    expect(semantic.length).toBeGreaterThan(60);
  });

  it('gives every token a name, value, description and known category', () => {
    for (const t of tokens) {
      expect(t.name, 'name').toMatch(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/);
      expect(t.value, `${t.name} value`).not.toBeUndefined();
      expect(t.value, `${t.name} value`).not.toBe('');
      expect(t.description.length, `${t.name} description`).toBeGreaterThanOrEqual(12);
      expect(categories, `${t.name} category`).toContain(t.category);
    }
  });

  it('has no duplicate token names', () => {
    const dupes = tokens.map((t) => t.name).filter((n, i, all) => all.indexOf(n) !== i);
    expect(dupes).toEqual([]);
  });

  it('has no two tokens that collide as CSS variables', () => {
    const vars = tokens.map((t) => cssVarName(t.name));
    expect(new Set(vars).size).toBe(vars.length);
    expect(cssVarName('color.text.muted')).toBe('--hb-color-text-muted');
  });

  it('keeps primitives to the palette and semantic tokens to everything else', () => {
    for (const t of primitives) expect(t.name.startsWith('palette.'), t.name).toBe(true);
    for (const t of semantic) expect(t.name.startsWith('palette.'), t.name).toBe(false);
  });

  it('defines every themed token for light, dark and high contrast', () => {
    for (const t of tokens.filter((t) => typeof t.value === 'object' && 'light' in t.value)) {
      expect(Object.keys(t.value).sort(), t.name).toEqual([...themes].sort());
    }
    for (const t of semantic.filter((t) => t.category === 'color')) {
      expect(typeof t.value === 'object' && 'light' in t.value, `${t.name} is themed`).toBe(true);
    }
  });

  it('only references tokens that exist (no dangling references)', () => {
    for (const t of tokens) {
      for (const ref of referencesOf(t)) {
        expect(byName.has(ref), `${t.name} → {${ref}}`).toBe(true);
        expect(byName.get(ref)?.tier, `${t.name} must reference a primitive`).toBe('primitive');
      }
    }
  });

  it('has no orphans: every palette scale and base color is used by a semantic token', () => {
    const referenced = new Set(semantic.flatMap(referencesOf));
    const groups = new Map<string, string[]>();
    for (const p of primitives) {
      const group = p.name.split('.').slice(0, 2).join('.');
      groups.set(group, [...(groups.get(group) ?? []), p.name]);
    }
    for (const [group, names] of groups) {
      const isScale = names.length >= 11;
      if (isScale) {
        expect(
          names.some((n) => referenced.has(n)),
          `${group} scale is unused`,
        ).toBe(true);
      } else {
        for (const n of names) expect(referenced.has(n), `${n} is unused`).toBe(true);
      }
    }
  });

  it('refuses to resolve unknown tokens and values with no single scalar', () => {
    expect(() => resolve('color.does-not-exist', 'light')).toThrow(/Unknown token/);
    expect(() => resolve('motion.spring.snappy', 'light')).toThrow(/no scalar value/);
    expect(resolve('space.4', 'dark')).toBe(16);
  });

  it('resolves semantic colors per theme to literal hex values', () => {
    for (const t of semantic.filter((t) => t.category === 'color')) {
      for (const theme of themes) {
        expect(String(resolve(t.name, theme)), `${t.name} (${theme})`).toMatch(
          /^#[0-9A-F]{6}([0-9A-F]{2})?$/,
        );
      }
    }
  });
});

describe('spec anchors', () => {
  it('uses teal #1F6F5C as the primary with a 50–950 scale', () => {
    expect(resolve('palette.teal.600', 'light')).toBe('#1F6F5C');
    const steps = primitives.filter((t) => t.name.startsWith('palette.teal.')).map((t) => t.name);
    expect(steps.map((n) => Number(n.split('.')[2]))).toEqual([
      50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
    ]);
    expect(resolve('color.action.primary', 'light')).toBe('#1F6F5C');
  });

  it('has warm neutrals and success, warning, danger and info scales', () => {
    for (const hue of ['neutral', 'green', 'amber', 'red', 'blue']) {
      expect(byName.has(`palette.${hue}.500`), hue).toBe(true);
    }
    for (const status of ['success', 'warning', 'danger', 'info']) {
      expect(byName.has(`color.status.${status}.fg`), status).toBe(true);
      expect(byName.has(`color.status.${status}.bg`), status).toBe(true);
    }
  });

  it('maps surfaces: light #FAFAF7, dark #121214, high contrast black', () => {
    expect(resolve('color.surface.default', 'light')).toBe('#FAFAF7');
    expect(resolve('color.surface.default', 'dark')).toBe('#121214');
    expect(resolve('color.surface.default', 'hc')).toBe('#000000');
    expect(resolve('color.text.default', 'hc')).toBe('#FFFFFF');
    expect(resolve('color.border.focus', 'hc')).toBe('#FFD23F');
  });

  it('exposes the semantic names the components are written against', () => {
    for (const name of [
      'color.surface.default',
      'color.text.muted',
      'color.action.primary',
      'color.border.focus',
    ]) {
      expect(byName.get(name)?.tier, name).toBe('semantic');
    }
  });

  it('uses the 12/13/14/16/20/24/32/40/56 type scale with a line height per step', () => {
    const sizes = tokens.filter((t) => t.name.startsWith('font.size.'));
    expect(sizes.map((t) => t.value)).toEqual([12, 13, 14, 16, 20, 24, 32, 40, 56]);
    for (const size of sizes) {
      const step = size.name.split('.')[2];
      const leading = byName.get(`font.leading.${step}`);
      expect(leading, `font.leading.${step}`).toBeDefined();
      expect(Number(leading?.value)).toBeGreaterThanOrEqual(Number(size.value));
    }
    for (const family of ['display', 'ui', 'code']) {
      expect(byName.has(`font.family.${family}`), family).toBe(true);
    }
    expect(String(byName.get('font.family.display')?.value)).toContain('Bricolage Grotesque');
    expect(String(byName.get('font.family.ui')?.value)).toContain('Geist');
    expect(String(byName.get('font.family.code')?.value)).toContain('Geist Mono');
  });

  it('uses a 4px space scale from 4 to 64', () => {
    const space = tokens.filter((t) => t.category === 'space').map((t) => Number(t.value));
    expect(Math.min(...space)).toBe(4);
    expect(Math.max(...space)).toBe(64);
    for (const v of space) expect(v % 4).toBe(0);
  });

  it('uses radius sm 6, md 8, lg 12, xl 16 and full', () => {
    const radius = Object.fromEntries(
      tokens.filter((t) => t.category === 'radius').map((t) => [t.name, t.value]),
    );
    expect(radius).toMatchObject({
      'radius.sm': 6,
      'radius.md': 8,
      'radius.lg': 12,
      'radius.xl': 16,
      'radius.full': 9999,
    });
  });

  it('themes elevation so shadows work on dark and high-contrast surfaces', () => {
    const elevation = tokens.filter((t) => t.category === 'elevation');
    expect(elevation.length).toBeGreaterThanOrEqual(3);
    for (const t of elevation) {
      const v = t.value as ThemedValue;
      expect(v.light).not.toBe(v.dark);
    }
  });
});
