export const origin = 'https://seleznevcoach.ru';
export const authorUrl = `${origin}/about`;
export const personId = `${origin}/#alexander`;

export function isPublicHost(host: string | null | undefined) {
  return host === 'seleznevcoach.ru' || host === 'www.seleznevcoach.ru';
}

export const author = {
  '@type': 'Person',
  '@id': personId,
  name: 'Александр Селезнёв',
  alternateName: 'Alexander Seleznev',
  url: authorUrl,
  image: `${origin}/media/archive/track-portrait.webp`,
  jobTitle: 'Тренер по бегу и общей физической подготовке',
  sameAs: ['https://www.instagram.com/seleznevcoach/'],
  knowsAbout: ['Подготовка бегунов', 'Физиология выносливости', 'Мониторинг тренировочной нагрузки'],
};

export function authorReference(english = false) {
  return { '@type': 'Person', '@id': personId, name: english ? author.alternateName : author.name, url: authorUrl };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
