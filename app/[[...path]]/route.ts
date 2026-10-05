import { defaultOgImage, seoTargets } from '../../lib/seo-targets';
import { seoPages } from '../../lib/seo-pages';
import { extraSeoPages } from '../../lib/seo-pages-extra';

const ORIGIN = 'https://seleznevcoach.ru';
const allSeoPages = { ...seoPages, ...extraSeoPages };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function replaceTitle(html: string, title: string) {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  }
  return html.replace(/<head([^>]*)>/i, `<head$1><title>${title}</title>`);
}

function replaceMeta(html: string, key: 'name' | 'property', attr: string, value: string) {
  const escaped = attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<meta([^>]*?)${key}=["']${escaped}["']([^>]*?)>`, 'i');
  if (re.test(html)) {
    return html.replace(re, `<meta ${key}="${attr}" content="${value}">`);
  }
  return html.replace(/<head([^>]*)>/i, `<head$1><meta ${key}="${attr}" content="${value}">`);
}

function replaceCanonical(html: string, href: string) {
  const re = /<link([^>]*?)rel=["']canonical["']([^>]*?)>/i;
  if (re.test(html)) return html.replace(re, `<link rel="canonical" href="${href}">`);
  return injectHead(html, `<link rel="canonical" href="${href}">`);
}

function injectHead(html: string, markup: string) {
  return html.replace(/<head([^>]*)>/i, `<head$1>${markup}`);
}

function injectPreviewGuards(html: string) {
  html = html
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']googlebot["'][^>]*>/gi, '');

  return injectHead(
    html,
    '<meta name="robots" content="noindex,nofollow,noarchive"><meta name="googlebot" content="noindex,nofollow,noarchive">'
  );
}

function rewriteProductionAssets(html: string) {
  const assetRoots = ['/_next/', '/media/', '/fonts/', '/favicon.svg'];

  for (const root of assetRoots) {
    const escaped = root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const attrs = new RegExp(`(src|href|poster)=(['"])${escaped}`, 'gi');
    html = html.replace(attrs, (_match, attr, quote) => `${attr}=${quote}${ORIGIN}${root}`);
  }

  html = html.replace(
    /(srcset)=(['"])([^'"]+)(['"])/gi,
    (_match, attr, quote, value, closingQuote) => {
      const rewritten = value
        .split(',')
        .map((part: string) => {
          const trimmed = part.trim();
          const space = trimmed.indexOf(' ');
          const url = space === -1 ? trimmed : trimmed.slice(0, space);
          const descriptor = space === -1 ? '' : trimmed.slice(space);
          if (url.startsWith('/_next/') || url.startsWith('/media/') || url.startsWith('/fonts/')) {
            return `${ORIGIN}${url}${descriptor}`;
          }
          return trimmed;
        })
        .join(', ');
      return `${attr}=${quote}${rewritten}${closingQuote}`;
    }
  );

  return html;
}

function russianEquivalent(pathname: string) {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/';
  return pathname;
}

function futureUrl(pathname: string) {
  return `${ORIGIN}${pathname === '/' ? '' : pathname}`;
}

function replaceMain(html: string, mainHtml: string) {
  return html.replace(/<main\b[\s\S]*?<\/main>/i, mainHtml.trim());
}

function stripHydrationScripts(html: string) {
  return html
    .replace(/<script\b[^>]*src=["'][^"']*\/_next\/[^"']*["'][^>]*><\/script>/gi, '')
    .replace(/<script>\s*\(self\.__next_f[\s\S]*?<\/script>/gi, '')
    .replace(/<script>\s*self\.__next_f[\s\S]*?<\/script>/gi, '');
}

function removeJsonLd(html: string) {
  return html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
}

function addJsonLd(html: string, data: unknown) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return html.replace(/<body([^>]*)>/i, `<body$1><script type="application/ld+json">${json}</script>`);
}

function routeLabel(pathname: string) {
  const labels: Record<string, string> = {
    '/training/3k': 'Подготовка к 3 км',
    '/training/5k': 'Подготовка к 5 км',
    '/training/10k': 'Подготовка к 10 км',
    '/training/half-marathon': 'Подготовка к полумарафону',
    '/training/marathon': 'Подготовка к марафону',
    '/journal/heart-rate-zones-running': 'Пульсовые зоны для бега',
  };
  return labels[pathname] || seoTargets[pathname]?.title.replace(' | Александр Селезнёв', '') || 'Подготовка';
}

function customStructuredData(pathname: string) {
  const target = seoTargets[pathname];
  const canonical = futureUrl(pathname);
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${ORIGIN}/#alexander`,
    name: 'Александр Селезнёв',
    url: ORIGIN,
    jobTitle: 'Тренер по бегу и общей физической подготовке',
    sameAs: ['https://t.me/seleznevcoach', 'https://t.me/runadapt', 'https://www.instagram.com/seleznevcoach/'],
  };

  const label = routeLabel(pathname);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: `${ORIGIN}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: pathname.startsWith('/journal/') ? 'Журнал' : 'Подготовка',
        item: pathname.startsWith('/journal/') ? `${ORIGIN}/journal` : `${ORIGIN}/training/online`,
      },
      { '@type': 'ListItem', position: 3, name: label, item: canonical },
    ],
  };

  if (pathname.startsWith('/training/')) {
    return [
      person,
      breadcrumb,
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: label,
        description: target?.description,
        url: canonical,
        provider: { '@id': `${ORIGIN}/#alexander` },
        serviceType: 'Персональная подготовка по бегу',
        areaServed: ['Москва', 'Онлайн'],
      },
    ];
  }

  return [
    person,
    breadcrumb,
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: target?.title.replace(' | Александр Селезнёв', ''),
      description: target?.description,
      url: canonical,
      mainEntityOfPage: canonical,
      author: { '@id': `${ORIGIN}/#alexander` },
      image: defaultOgImage,
    },
  ];
}

function applyCustomRouteSeo(html: string, pathname: string) {
  const canonical = futureUrl(pathname);

  html = replaceCanonical(html, canonical);
  html = replaceMeta(html, 'property', 'og:url', canonical);

  html = html.replace(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["'][^"']+["'][^>]*>/gi, '');
  html = html.replace(/<link[^>]+hreflang=["'][^"']+["'][^>]+rel=["']alternate["'][^>]*>/gi, '');
  html = injectHead(html, `<link rel="alternate" hreflang="ru" href="${canonical}"><link rel="alternate" hreflang="x-default" href="${canonical}">`);

  return html;
}

function addSeoEnhancements(html: string, pathname: string) {
  const target = seoTargets[pathname];
  if (target) {
    html = replaceTitle(html, target.title);
    html = replaceMeta(html, 'name', 'description', target.description);
    html = replaceMeta(html, 'property', 'og:title', target.title);
    html = replaceMeta(html, 'property', 'og:description', target.description);
    html = replaceMeta(html, 'name', 'twitter:title', target.title);
    html = replaceMeta(html, 'name', 'twitter:description', target.description);
  }

  html = replaceMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = replaceMeta(html, 'property', 'og:image', defaultOgImage);
  html = replaceMeta(html, 'name', 'twitter:image', defaultOgImage);

  if (!/hreflang=["']x-default["']/i.test(html)) {
    const xDefaultPath = russianEquivalent(pathname);
    html = injectHead(html, `<link rel="alternate" hreflang="x-default" href="${futureUrl(xDefaultPath)}">`);
  }

  return html;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path?: string[] }> }
) {
  const params = await context.params;
  const pathname = params.path?.length ? `/${params.path.join('/')}` : '/';
  const incoming = new URL(request.url);
  const customPage = allSeoPages[pathname];
  const upstreamPath = customPage?.shellPath || pathname;
  const target = `${ORIGIN}${upstreamPath}${customPage ? '' : incoming.search}`;

  const upstream = await fetch(target, {
    cache: 'no-store',
    headers: {
      'user-agent': request.headers.get('user-agent') || 'SeleznevCoachPreview/1.0',
      accept: request.headers.get('accept') || 'text/html,application/xhtml+xml',
      rsc: customPage ? '' : request.headers.get('rsc') || '',
      'next-router-state-tree': customPage ? '' : request.headers.get('next-router-state-tree') || '',
      'next-url': customPage ? '' : request.headers.get('next-url') || '',
    },
  });

  const contentType = upstream.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: {
        'content-type': contentType || 'application/octet-stream',
        'x-robots-tag': 'noindex, nofollow, noarchive',
        'cache-control': 'private, no-store, max-age=0',
      },
    });
  }

  let html = await upstream.text();
  html = injectPreviewGuards(html);

  if (customPage) {
    html = replaceMain(html, customPage.mainHtml);
    html = stripHydrationScripts(html);
    html = removeJsonLd(html);
    for (const item of customStructuredData(pathname)) html = addJsonLd(html, item);
    html = applyCustomRouteSeo(html, pathname);
  }

  html = rewriteProductionAssets(html);
  html = addSeoEnhancements(html, pathname);

  return new Response(html, {
    status: customPage ? 200 : upstream.status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow, noarchive',
      'cache-control': 'private, no-store, max-age=0',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'x-content-type-options': 'nosniff',
    },
  });
}
