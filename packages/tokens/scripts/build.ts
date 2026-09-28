import { fileURLToPath } from 'node:url';
import { tokens, writeBuild } from '../src/index.ts';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
writeBuild(dist);
console.log(`harbor-tokens: wrote ${tokens.length} tokens to ${dist}`);
