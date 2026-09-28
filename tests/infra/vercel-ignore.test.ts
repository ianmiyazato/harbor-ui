import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

/**
 * Vercel's "Ignored Build Step": exit 0 skips the build, exit 1 builds.
 * The script is our last line of defence for the 5-deploy budget, so it gets real tests
 * against a throwaway git repo shaped like this monorepo.
 */
const script = resolve(__dirname, '../../apps/docs/scripts/vercel-ignore.sh');

let repo: string;

function git(...args: string[]) {
  execFileSync('git', args, { cwd: repo, stdio: 'ignore' });
}

function commit(file: string, message: string) {
  const full = join(repo, file);
  mkdirSync(resolve(full, '..'), { recursive: true });
  writeFileSync(full, `${Math.random()}\n`);
  git('add', '-A');
  git('commit', '-q', '-m', message);
}

function runIgnore(env: Record<string, string>) {
  const result = spawnSync('bash', [script], {
    cwd: join(repo, 'apps/docs'),
    env: { PATH: process.env.PATH ?? '', ...env },
    encoding: 'utf8',
  });
  return { code: result.status, out: result.stdout };
}

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'harbor-ignore-'));
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'test');
  commit('apps/docs/package.json', 'chore: init');
});

describe('vercel-ignore.sh', () => {
  it('builds a production deploy marked [deploy] that changes apps/docs', () => {
    commit('apps/docs/src/page.astro', 'release: M4 docs site [deploy]');
    expect(runIgnore({ VERCEL_ENV: 'production' }).code).toBe(1);
  });

  it('builds a production deploy marked [deploy] that changes packages/', () => {
    commit('packages/tokens/src/index.ts', 'release: M5 lab [deploy]');
    expect(runIgnore({ VERCEL_ENV: 'production' }).code).toBe(1);
  });

  it('skips when the commit has no [deploy] marker', () => {
    commit('packages/react/src/button.tsx', 'release: M2 components');
    const result = runIgnore({ VERCEL_ENV: 'production' });
    expect(result.code).toBe(0);
    expect(result.out).toMatch(/no \[deploy\] marker/);
  });

  it('skips when nothing under apps/docs or packages changed', () => {
    commit('docs/adr/0001.md', 'docs: adr [deploy]');
    const result = runIgnore({ VERCEL_ENV: 'production' });
    expect(result.code).toBe(0);
    expect(result.out).toMatch(/no changes/);
  });

  it('skips every non-production (preview) build', () => {
    commit('apps/docs/src/page.astro', 'feat: page [deploy]');
    const result = runIgnore({ VERCEL_ENV: 'preview' });
    expect(result.code).toBe(0);
    expect(result.out).toMatch(/not production/);
  });

  it('prefers the Vercel-provided commit message when present', () => {
    commit('apps/docs/src/page.astro', 'local message');
    expect(
      runIgnore({ VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_MESSAGE: 'Merge [deploy]' }).code,
    ).toBe(1);
  });
});
