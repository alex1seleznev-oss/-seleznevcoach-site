const PROD_HOSTS = new Set(['seleznevcoach.ru', 'www.seleznevcoach.ru']);

export function GET(request: Request) {
  const host = new URL(request.url).hostname.toLowerCase();
  const production = PROD_HOSTS.has(host);

  const body = production
    ? 'User-agent: *\nAllow: /\nDisallow: /api/\nHost: https://seleznevcoach.ru\nSitemap: https://seleznevcoach.ru/sitemap.xml\n'
    : 'User-agent: *\nDisallow: /\n';

  const headers: Record<string, string> = {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'public, max-age=300',
  };

  if (!production) headers['x-robots-tag'] = 'noindex, nofollow, noarchive';

  return new Response(body, { headers });
}
