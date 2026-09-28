import type { ThemeName, Token } from './types.ts';

const refPattern = /\{([a-z0-9.-]+)\}/g;

export function isThemed(value: Token['value']): value is Record<ThemeName, string> {
  return typeof value === 'object' && 'light' in value;
}

/** `color.text.muted` → `--hb-color-text-muted`. */
export function cssVarName(name: string): string {
  return `--hb-${name.replaceAll('.', '-')}`;
}

/** Token names referenced as `{palette.x.y}` anywhere in a token's value. */
export function referencesOf(token: Token): string[] {
  const values = isThemed(token.value) ? Object.values(token.value) : [token.value];
  return values
    .filter((v): v is string => typeof v === 'string')
    .flatMap((v) => [...v.matchAll(refPattern)].map((m) => m[1] as string));
}

export function createResolver(tokens: Token[]) {
  const byName = new Map(tokens.map((t) => [t.name, t]));

  return function resolve(name: string, theme: ThemeName): string | number {
    const token = byName.get(name);
    if (!token) throw new Error(`Unknown token: ${name}`);
    const raw = isThemed(token.value) ? token.value[theme] : token.value;
    if (typeof raw !== 'string') {
      if (typeof raw === 'number') return raw;
      throw new Error(`Token ${name} has no scalar value`);
    }
    const whole = /^\{([a-z0-9.-]+)\}$/.exec(raw);
    if (whole) return resolve(whole[1] as string, theme);
    return raw.replace(refPattern, (_, ref: string) => String(resolve(ref, theme)));
  };
}
