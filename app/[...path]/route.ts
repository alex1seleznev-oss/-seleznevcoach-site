import athleteFacts from '../../config/athlete-facts.json';
import snapshot from '../../snapshot/pages.json';
import { defaultOgImage, seoTargets } from '../../lib/seo-targets';
import { seoPages } from '../../lib/seo-pages';
import { extraSeoPages } from '../../lib/seo-pages-extra';
import { author, authorReference, jsonLd } from '../../lib/site-identity';
import { journal } from '../../lib/site-content';

const PUBLIC_ORIGIN = 'https://seleznevcoach.ru';
const allSeoPages = { ...seoPages, ...extraSeoPages };
const capturedPages = snapshot.pages as Record<string, string>;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isProductionHost(request: Request) {
  const host = (request.headers.get('host')?.split(':')[0] || new URL(request.url).hostname).toLowerCase();
  return host === 'seleznevcoach.ru' || host === 'www.seleznevcoach.ru';
}

function injectHead(html: string, markup: string) {
  return html.replace(/<head([^>]*)>/i, `<head$1>${markup}`);
}

function injectBodyEnd(html: string, markup: string) {
  return html.replace(/<\/body>/i, `${markup}</body>`);
}

function prepareSnapshot(html: string) {
  html = html.replaceAll('15:27', athleteFacts.fiveKmPb)
    .replaceAll('/media/mountain-river.jpeg', '/images/generated/premium-athlete-portrait.webp')
    .replaceAll('Александр Селезнёв у горной реки', 'Александр Селезнёв. Редакционный портрет на основе фотографии.')
    .replaceAll('Alexander Seleznev by a mountain river', 'Alexander Seleznev. Editorial portrait based on a photograph.')
    .replaceAll('ЗА ПРЕДЕЛАМИ СТАДИОНА', 'АЛЕКСАНДР СЕЛЕЗНЁВ');
  html = html.replace(/\/_next\/static\//g, '/legacy-next/static/');
  // Update HTML and captured React payload together to keep hydration consistent.
  html = html.replace(/https:\/\/t\.me\/seleznevcoach(?![A-Za-z0-9_])/g, 'https://t.me/seleznevcoach_bot?start=site')
    .replaceAll('Лично тренеру', 'Telegram-бот').replaceAll('Личный Telegram', 'Telegram-бот')
    .replaceAll('Message Alexander on Telegram', 'Open Telegram bot').replaceAll('Message Alexander', 'Open Telegram bot');
  // Captured filenames are fixed; invalidate old browser copies of patched scripts.
  html = html.replace(/(src=["']\/legacy-next\/[^"']+\.js)(["'])/g, '$1?v=premium-20261104$2');
  if (!html.includes('src="/site.js?v=services-1"')) {
    html = injectBodyEnd(html, '<script src="/site.js?v=services-1" defer></script>');
  }
  return html;
}

function stripCustomHydration(html: string) {
  return html
    .replace(/<link\b[^>]*href=["']\/legacy-next\/static\/chunks\/[^"']+["'][^>]*>/gi, '')
    .replace(/<script\b[^>]*src=["']\/legacy-next\/static\/chunks\/[^"']+["'][^>]*><\/script>/gi, '')
    .replace(/<script>\s*(?:\(self\.__next_f=self\.__next_f\|\|\[\]\)|self\.__next_f)[\s\S]*?<\/script>/gi, '');
}

function replaceTitle(html: string, title: string) {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  return injectHead(html, `<title>${title}</title>`);
}

function replaceMeta(html: string, key: 'name' | 'property', attr: string, value: string) {
  const escaped = attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<meta([^>]*?)${key}=["']${escaped}["']([^>]*?)>`, 'i');
  if (re.test(html)) return html.replace(re, `<meta ${key}="${attr}" content="${value}">`);
  return injectHead(html, `<meta ${key}="${attr}" content="${value}">`);
}

function replaceCanonical(html: string, href: string) {
  const re = /<link([^>]*?)rel=["']canonical["']([^>]*?)>/i;
  if (re.test(html)) return html.replace(re, `<link rel="canonical" href="${href}">`);
  return injectHead(html, `<link rel="canonical" href="${href}">`);
}

function setRobotsMeta(html: string, indexable: boolean) {
  html = html
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']googlebot["'][^>]*>/gi, '');
  const content = indexable ? 'index,follow,max-image-preview:large' : 'noindex,nofollow,noarchive';
  return injectHead(html, `<meta name="robots" content="${content}"><meta name="googlebot" content="${content}">`);
}

function russianEquivalent(pathname: string) {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/';
  return pathname;
}

function publicUrl(pathname: string) {
  return `${PUBLIC_ORIGIN}${pathname === '/' ? '' : pathname}`;
}

function replaceMain(html: string, mainHtml: string) {
  return html.replace(/<main\b[\s\S]*?<\/main>/i, mainHtml.trim());
}

function removeJsonLd(html: string) {
  return html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
}

function addJsonLd(html: string, data: unknown) {
  const json = JSON.stringify(data).replace(/</g, '\u003c');
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
  const canonical = publicUrl(pathname);
  const person = {
    '@context': 'https://schema.org',
    ...author,
  };
  const label = routeLabel(pathname);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: `${PUBLIC_ORIGIN}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: pathname.startsWith('/journal/') ? 'Журнал' : 'Подготовка',
        item: pathname.startsWith('/journal/') ? `${PUBLIC_ORIGIN}/journal` : `${PUBLIC_ORIGIN}/training/online`,
      },
      { '@type': 'ListItem', position: 3, name: label, item: canonical },
    ],
  };

  if (pathname.startsWith('/training/')) {
    return [person, breadcrumb, {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: label,
      description: target?.description,
      url: canonical,
      provider: { '@id': `${PUBLIC_ORIGIN}/#alexander` },
      serviceType: 'Персональная подготовка по бегу',
      areaServed: ['Москва', 'Онлайн'],
    }];
  }

  return [person, breadcrumb, {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: target?.title.replace(' | Александр Селезнёв', ''),
    description: target?.description,
    url: canonical,
    mainEntityOfPage: canonical,
    author: authorReference(),
    inLanguage: 'ru',
    image: journalImage(pathname),
  }];
}

function journalImage(pathname: string) {
  const cover = journal.find(article => pathname.endsWith('/journal/' + article.slug))?.image;
  return cover ? publicUrl(cover) : defaultOgImage;
}

function addArticleAttribution(html: string, pathname: string) {
  const english = pathname.startsWith('/en/');
  const canonical = publicUrl(pathname);
  const displayName = english ? author.alternateName : author.name;
  html = html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, (tag, raw: string) => {
    try {
      const data = JSON.parse(raw);
      if (data['@type'] === 'Person') {
        return '<script type="application/ld+json">' + jsonLd({'@context': 'https://schema.org', ...author}) + '</script>';
      }
      if (data['@type'] === 'BlogPosting') {
        return '<script type="application/ld+json">' + jsonLd({
          ...data, url: canonical, mainEntityOfPage: canonical,
          image: journalImage(pathname), author: authorReference(english),
        }) + '</script>';
      }
    } catch { /* Preserve unrelated captured markup. */ }
    return tag;
  });
  html = html.replace(/<main\b[\s\S]*?<\/main>/i, main => main
    .replace(/<span class="mono">АЛЕКСАНДР СЕЛЕЗНЁВ \/ ЗАМЕТКИ ТРЕНЕРА[\s\S]*?<\/span>/, '')
    .replace('</header>', '<p class="journal-byline"><a href="/about" rel="author">' + displayName + '</a></p></header>'));
  if (!english) {
    const title = journal.find(article => pathname.endsWith('/journal/' + article.slug))?.title;
    if (title) {
      html = html.replace('</main>', '<div class="section"><p class="journal-citation">Для ссылки: Селезнёв А. «' + title + '». <a href="' + canonical + '">Постоянный адрес статьи</a>.</p><p><a href="/journal">Все статьи о беге →</a></p></div></main>');
    }
  }
  return injectHead(html, '<link rel="stylesheet" href="/editorial-seo.css">');
}

function applyCustomRouteSeo(html: string, pathname: string) {
  const canonical = publicUrl(pathname);
  html = replaceCanonical(html, canonical);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = html.replace(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["'][^"']+["'][^>]*>/gi, '');
  html = html.replace(/<link[^>]+hreflang=["'][^"']+["'][^>]+rel=["']alternate["'][^>]*>/gi, '');
  return injectHead(html, `<link rel="alternate" hreflang="ru" href="${canonical}"><link rel="alternate" hreflang="x-default" href="${canonical}">`);
}

function fixCustomLanguageSwitch(html: string) {
  return html.replace(
    /<nav class="language-switch"[\s\S]*?<\/nav>/i,
    '<nav class="language-switch" aria-label="Язык сайта"><span lang="ru" aria-current="page">Русский</span></nav>'
  );
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
  const image = journalImage(pathname);
  html = replaceMeta(html, 'property', 'og:image', image);
  html = replaceMeta(html, 'name', 'twitter:image', image);
  if (!/hreflang=["']x-default["']/i.test(html)) {
    html = injectHead(html, `<link rel="alternate" hreflang="x-default" href="${publicUrl(russianEquivalent(pathname))}">`);
  }
  return html;
}

export async function GET(request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const params = await context.params;
  const pathname = params.path?.length ? `/${params.path.join('/')}` : '/';
  const productionHost = isProductionHost(request);
  const customPage = allSeoPages[pathname];
  const sourcePath = customPage?.shellPath || pathname;
  let html = capturedPages[sourcePath];

  if (!html) {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'x-robots-tag': 'noindex, nofollow, noarchive',
      },
    });
  }

  html = prepareSnapshot(html);
  if (pathname === '/training/moscow') {
    html = html.replaceAll('/media/training-warmup.webp', '/media/archive/training-group.webp')
      .replaceAll('Разминка и работа над движениями на тренировке', 'Александр Селезнёв с участниками тренировочной группы');
  }
  if (pathname === '/en') {
    html = html.replaceAll('/images/generated/premium-athlete-portrait.webp', '/media/archive/track-portrait.webp')
      .replaceAll('Alexander Seleznev. Editorial portrait based on a photograph.', 'Alexander Seleznev at the athletics stadium');
  }

  if (pathname === '/' || pathname === '/en') html = injectHead(html, '<link rel="preload" as="image" href="/images/generated/premium-stadium-hero.webp" fetchpriority="high">');
  html = html.replace('</head>', '<link rel="preload" href="/fonts/onest-variable.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/motion-refresh.css?v=scene-20261104"><link rel="stylesheet" href="/premium-sports.css?v=faq-1"><link rel="stylesheet" href="/service-finish.css?v=photos-2"></head>');
  html = injectBodyEnd(html, '<script src="/vendor/gsap/gsap.min.js" defer></script><script src="/vendor/gsap/ScrollTrigger.min.js" defer></script><script src="/premium-sports.js?v=premium-20261104c" defer></script>');

  if (customPage) {
    html = stripCustomHydration(html);
    html = replaceMain(html, customPage.mainHtml);
    html = removeJsonLd(html);
    for (const item of customStructuredData(pathname)) html = addJsonLd(html, item);
    html = applyCustomRouteSeo(html, pathname);
    html = fixCustomLanguageSwitch(html);
  }

  if (/^(?:\/en)?\/journal\//.test(pathname)) {
    html = addArticleAttribution(stripCustomHydration(html), pathname);
  }
  html = addSeoEnhancements(html, pathname);
  const indexable = productionHost && seoTargets[pathname]?.indexable !== false;
  html = setRobotsMeta(html, indexable);

  const headers: Record<string, string> = {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'private, no-store, max-age=0',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-content-type-options': 'nosniff',
  };
  if (!indexable) headers['x-robots-tag'] = 'noindex, nofollow, noarchive';

  return new Response(html, { status: 200, headers });
}
