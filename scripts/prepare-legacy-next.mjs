import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'public', '_next');
const legacy = path.join(root, 'public', 'legacy-next');

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

await fs.rm(legacy, { recursive: true, force: true });
if (await exists(source)) {
  await fs.rename(source, legacy);
  console.log('Moved captured /_next assets to /legacy-next for standalone serving.');
} else {
  console.log('No captured public/_next directory found.');
}
