import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const stagedStatic = path.join(root, '.legacy-next', 'static');
const nextStatic = path.join(root, '.next', 'static');

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

if (await exists(stagedStatic)) {
  await fs.mkdir(nextStatic, { recursive: true });
  await fs.cp(stagedStatic, nextStatic, { recursive: true, force: false, errorOnExist: false });
  console.log('Merged captured legacy Next static assets into .next/static.');
} else {
  console.log('No staged legacy Next static assets to merge.');
}
