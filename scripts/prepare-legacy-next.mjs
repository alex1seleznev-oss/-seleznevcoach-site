import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'public', '_next');
const staged = path.join(root, '.legacy-next');

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

await fs.rm(staged, { recursive: true, force: true });
if (await exists(source)) {
  await fs.rename(source, staged);
  console.log('Staged captured /_next assets outside public for Next build.');
} else {
  console.log('No captured public/_next directory found.');
}
