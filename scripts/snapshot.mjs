import fs from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = 'https://seleznevcoach.ru';
const ROOT = process.cwd();
const SNAPSHOT_DIR = path.join(ROOT, 'snapshot');
const PUBLIC_DIR = path.join(ROOT, 'public');
const UA = 'SeleznevCoachSnapshot/1.0';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchBuffer(url, init = {}, attempts = 4) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        redirect: 'follow',
        headers: { 'user-agent': UA, ...(init.headers || {}) },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
      return { response, buffer: Buffer.from(await response.arrayBuffer()) };
    } catch (error) {
      lastError = error;
      await sleep(500 * (i + 1));
    }
  }
  throw lastError;
}

function pathnameFromUrl(value) {
  try {
    const u = new URL(value, ORIGIN);
    if (u.origin !== ORIGIN) return null;
    return `${u.pathname}${u.search}`;
  } catch {
    return null;
  }
}

function assetPathFromUrl(value) {
  const p = pathnameFromUrl(value);
  if (!p) return null;
  const pathname = p.split('?')[0];
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/media/') ||
    pathname.startsWith('/fonts/') ||
    pathname === '/favicon.svg' ||
    pathname === '/favicon.ico'
  ) return pathname;
  return null;
}

function collectHtmlAssets(html) {
  const out = new Set();
  const attrRe = /(?:src|href|poster)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attrRe)) {
    const p = assetPathFromUrl(match[1]);
    if (p) out.add(p);
  }

  const srcsetRe = /srcset=["']([^"']+)["']/gi;
  for (const match of html.matchAll(srcsetRe)) {
    for (const item of match[1].split(',')) {
      const raw = item.trim().split(/\s+/)[0];
      const p = assetPathFromUrl(raw);
      if (p) out.add(p);
    }
  }
  return out;
}

function collectCssAssets(css) {
  const out = new Set();
  const re = /url\(([^)]+)\)/gi;
  for (const match of css.matchAll(re)) {
    const raw = match[1].trim().replace(/^['"]|['"]$/g, '');
    if (!raw || raw.startsWith('data:')) continue;
    const p = assetPathFromUrl(raw);
    if (p) out.add(p);
  }
  return out;
}

async function saveAsset(assetPath, queue, seen) {
  if (seen.has(assetPath)) return;
  seen.add(assetPath);

  const { response, buffer } = await fetchBuffer(`${ORIGIN}${assetPath}`);
  const filePath = path.join(PUBLIC_DIR, assetPath.replace(/^\//, ''));
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
  console.log(`asset ${response.status} ${assetPath} ${buffer.length}`);

  const type = response.headers.get('content-type') || '';
  if (type.includes('text/css') || assetPath.endsWith('.css')) {
    const css = buffer.toString('utf8');
    for (const child of collectCssAssets(css)) {
      if (!seen.has(child)) queue.add(child);
    }
  }
}

async function main() {
  await fs.mkdir(SNAPSHOT_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const { buffer: sitemapBuffer } = await fetchBuffer(`${ORIGIN}/sitemap.xml`);
  const sitemap = sitemapBuffer.toString('utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
  const paths = [...new Set(urls.map((u) => new URL(u).pathname))].sort();
  if (!paths.includes('/')) paths.unshift('/');

  const pages = {};
  const assets = new Set();
  for (const pathname of paths) {
    const { response, buffer } = await fetchBuffer(`${ORIGIN}${pathname}`, {
      headers: { accept: 'text/html,application/xhtml+xml' },
    });
    let html = buffer.toString('utf8');
    html = html.replaceAll(`${ORIGIN}/_next/`, '/_next/');
    html = html.replaceAll(`${ORIGIN}/media/`, '/media/');
    html = html.replaceAll(`${ORIGIN}/fonts/`, '/fonts/');
    pages[pathname] = html;
    for (const asset of collectHtmlAssets(html)) assets.add(asset);
    console.log(`page ${response.status} ${pathname} ${buffer.length}`);
  }

  const queue = new Set(assets);
  const seen = new Set();
  while (queue.size) {
    const [asset] = queue;
    queue.delete(asset);
    await saveAsset(asset, queue, seen);
  }

  await fs.writeFile(
    path.join(SNAPSHOT_DIR, 'pages.json'),
    JSON.stringify({ capturedAt: new Date().toISOString(), origin: ORIGIN, pages }, null, 2),
  );
  await fs.writeFile(
    path.join(SNAPSHOT_DIR, 'manifest.json'),
    JSON.stringify({ capturedAt: new Date().toISOString(), pages: paths, assets: [...seen].sort() }, null, 2),
  );

  console.log(`captured ${paths.length} pages and ${seen.size} assets`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
