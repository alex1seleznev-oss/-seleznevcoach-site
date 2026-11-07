import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Header, Footer } from '@/components/site/shell';
import { authorReference, isPublicHost, jsonLd, origin } from '@/lib/site-identity';
import { seoTargets } from '@/lib/seo-targets';

const path = '/journal/5k-pace-1524';
const canonical = origin + path;
const title = 'Как рассчитать темп на 5 км: разбор результата 15:24';
const description = seoTargets[path].description;
const cover = origin + '/media/race-autumn.webp';

export async function generateMetadata(): Promise<Metadata> {
  const index = isPublicHost((await headers()).get('host'));
  return {
    title: seoTargets[path].title, description, alternates: {canonical},
    robots: {index, follow: index},
    openGraph: {title, description, url: canonical, type: 'article', locale: 'ru_RU', images: [cover]},
  };
}

function split(seconds: number) {
  const rounded = Math.round(seconds);
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`;
}

export default function PaceArticle() {
  const schema = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: title, description, url: canonical, mainEntityOfPage: canonical,
    datePublished: '2026-11-07', inLanguage: 'ru', image: cover, author: authorReference(),
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [['Главная', origin + '/'], ['Журнал', origin + '/journal'], [title, canonical]].map(
      ([name, item], i) => ({'@type': 'ListItem', position: i + 1, name, item})),
  };
  return <><Header/><main id="main" className="detail-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: jsonLd([schema, breadcrumb])}}/>
    <article>
      <header className="detail-hero section">
        <a className="detail-back" href="/journal">← В журнал</a>
        <span className="mono">ПРАКТИКА / ТЕМП НА 5 КМ</span>
        <h1>{title}</h1>
        <p>Мой личный результат на 5 км — 15:24. Это в среднем 3:04,8 на километр. Покажу, как перевести итоговое время в контрольные отметки и использовать их на старте.</p>
        <p className="journal-byline"><a href="/about" rel="author">Александр Селезнёв</a> · <time dateTime="2026-11-07">7 ноября 2026 г.</time></p>
      </header>
      <div className="detail-content section en-prose">
        <h2>От результата к темпу</h2>
        <p>Сначала переводим итог в секунды: 15 × 60 + 24 = 924 секунды. Делим на 5: получаем 184,8 секунды на километр, или 3:04,8/км. Для отрезка 400 м умножаем 184,8 на 0,4: получается 73,92 секунды, то есть примерно 1:13,9 на круг.</p>
        <h2>Как выглядит равномерная раскладка</h2>
        <p>Это расчёт по итоговому времени. Фактические сплиты моего забега здесь не приведены. Промежуточные отметки округлены до секунды.</p>
        <table className="journal-data-table">
          <caption>Контрольное время от старта при равномерном темпе</caption>
          <thead><tr><th scope="col">Отметка</th>{[924, 1200, 1500].map(goal => <th scope="col" key={goal}>Цель {split(goal)}</th>)}</tr></thead>
          <tbody>{[1, 2, 3, 4, 5].map(km => <tr key={km}><th scope="row">{km} км</th>{[924, 1200, 1500].map(goal => <td key={goal}>{split(goal * km / 5)}</td>)}</tr>)}</tbody>
        </table>
        <h2>Как применять расчёт на старте</h2>
        <p>На дорожке с разметкой можно сверяться со временем кругов. Например, круг за 1:14 в среднем даёт 15:25 на 5000 м: разница с целью — одна секунда за всю дистанцию. На шоссе ориентируйтесь на отметки дистанции и суммарное время: мгновенный темп на часах может колебаться.</p>
        <p>На трассе с подъёмами и ветром равномерный темп требует разных усилий. Используйте таблицу как ориентир: не пытайтесь любой ценой отыграть секунды на подъёме. Выбирайте цель по недавним тренировкам или контрольному старту.</p>
        <div className="reading-callout">
          <span className="mono">СЛЕДУЮЩИЙ ШАГ</span>
          <a href="/#pace-lab">Рассчитать темп для своей цели →</a>
          <a href="/training/5k">Как устроена подготовка к 5 км →</a>
          <a href="/journal/vo2max-and-5000m">От чего зависит результат на 5000 м →</a>
        </div>
        <p className="journal-citation">Для ссылки: Селезнёв А. «{title}». 7 ноября 2026 г. <a href={canonical}>Постоянный адрес статьи</a>.</p>
      </div>
    </article>
  </main><Footer/></>;
}
