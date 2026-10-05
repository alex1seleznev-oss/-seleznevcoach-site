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

const chunksDir = path.join(legacy, 'static', 'chunks');
if (await exists(chunksDir)) {
  for (const name of await fs.readdir(chunksDir)) {
    if (!name.startsWith('webpack-') || !name.endsWith('.js')) continue;
    const file = path.join(chunksDir, name);
    const sourceText = await fs.readFile(file, 'utf8');
    const patched = sourceText
      .replaceAll('s.p="/_next/"', 's.p="/legacy-next/"')
      .replaceAll("s.p='/_next/'", "s.p='/legacy-next/'");
    if (patched !== sourceText) {
      await fs.writeFile(file, patched);
      console.log(`Patched legacy webpack public path in ${name}.`);
    }
  }
}
