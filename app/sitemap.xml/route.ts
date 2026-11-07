import { seoTargets } from '../../lib/seo-targets';

const ORIGIN = 'https://seleznevcoach.ru';
const UPDATED = new Set(['/', '/about', '/journal']);
const PROD_HOSTS = new Set(['seleznevcoach.ru', 'www.seleznevcoach.ru']);

function esc(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function absolute(pathname: string) {
  return `${ORIGIN}${pathname === '/' ? '' : pathname}`;
}

function ruEquivalent(pathname: string) {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/';
  return pathname;
}

function enEquivalent(pathname: string) {
  if (pathname === '/') return '/en';
  return `/en${pathname}`;
}

export function GET(request: Request) {
  const host = (request.headers.get('host')?.split(':')[0] || new URL(request.url).hostname).toLowerCase();
  const production = PROD_HOSTS.has(host);

  const paths = Object.entries(seoTargets)
    .filter(([, target]) => target.indexable !== false)
    .map(([pathname]) => pathname)
    .sort((a, b) => a.localeCompare(b, 'en'));

  const body = paths.map((pathname) => {
    const ru = ruEquivalent(pathname);
    const en = enEquivalent(ru);
    const hasRu = Boolean(seoTargets[ru] && seoTargets[ru].indexable !== false);
    const hasEn = Boolean(seoTargets[en] && seoTargets[en].indexable !== false);
    const alternates = hasRu && hasEn
      ? `\n    <xhtml:link rel="alternate" hreflang="ru" href="${esc(absolute(ru))}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${esc(absolute(en))}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(absolute(ru))}"/>`
      : '';

    const lastmod = UPDATED.has(pathname) || /^(?:\/en)?\/journal\//.test(pathname)
      ? '\n    <lastmod>2026-11-07</lastmod>' : '';
    return '  <url>\n    <loc>' + esc(absolute(pathname)) + '</loc>' + lastmod + alternates + '\n  </url>';
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;

  const headers: Record<string, string> = {
    'content-type': 'application/xml; charset=utf-8',
    'cache-control': 'public, max-age=300',
  };
  if (!production) headers['x-robots-tag'] = 'noindex, nofollow, noarchive';

  return new Response(xml, { headers });
}
