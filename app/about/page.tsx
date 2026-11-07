import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Header, Footer } from '@/components/site/shell';
import athleteFacts from '@/config/athlete-facts.json';
import { author, authorUrl, isPublicHost, jsonLd, origin } from '@/lib/site-identity';
import { journal } from '@/lib/site-content';
import { seoTargets } from '@/lib/seo-targets';

export async function generateMetadata(): Promise<Metadata> {
  const index = isPublicHost((await headers()).get('host'));
  const {title, description} = seoTargets['/about'];
  return {
    title, description, alternates: {canonical: authorUrl},
    robots: {index, follow: index},
    openGraph: {title, description, url: authorUrl, type: 'profile', locale: 'ru_RU', images: [author.image]},
  };
}

export default function About() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: authorUrl,
    mainEntity: author,
  };
  return <><Header/><main id="main" className="detail-page author-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: jsonLd(schema)}}/>
    <header className="detail-hero section">
      <a className="detail-back" href="/">← На главную</a>
      <span className="mono">ТРЕНЕР ПО БЕГУ И ОФП · МОСКВА / ОНЛАЙН</span>
      <h1>Александр Селезнёв</h1>
      <p>Тренер по бегу с 2017 года, действующий спортсмен и автор статей о подготовке бегунов.</p>
    </header>
    <div className="detail-content section author-content">
      <figure className="author-portrait">
        <img src="/media/archive/track-portrait.webp" width="1200" height="1800" alt="Александр Селезнёв на стадионе после забега"/>
        <figcaption>Александр Селезнёв на стадионе. Фото из личного архива.</figcaption>
      </figure>
      <div className="en-prose">
        <h2>Образование и работа</h2>
        <p>Бакалавр физической культуры РУС «ГЦОЛИФК». Продолжаю обучение в магистратуре по спорту высших достижений. Прошёл профессиональную переподготовку по специальности «тренер по триатлону».</p>
        <p>Работаю с бегунами очно в Москве и онлайн. Изучаю, как данные о нагрузке, самочувствии и восстановлении помогают корректировать подготовку бегунов-любителей.</p>
        <h2>Спортивные результаты</h2>
        <p>Кандидат в мастера спорта по лёгкой атлетике. Мастер спорта по служебному биатлону.</p>
        <dl className="author-records">
          <div><dt>800 м</dt><dd>1:53,9</dd></div>
          <div><dt>1000 м</dt><dd>2:30,9</dd></div>
          <div><dt>5 км</dt><dd>{athleteFacts.fiveKmPb}</dd></div>
        </dl>
        <p><a href="/training/moscow">Очные тренировки в Москве</a> · <a href="/training/online">Онлайн-подготовка</a></p>
      </div>
    </div>
    <section className="detail-content section en-prose" aria-labelledby="author-articles">
      <h2 id="author-articles">Статьи Александра Селезнёва</h2>
      <ul>{[...journal].reverse().map(article => <li key={article.slug}><a href={`/journal/${article.slug}`}>{article.title}</a></li>)}</ul>
      <h2>Для редакций и авторов</h2>
      <p>Краткая справка: Александр Селезнёв — тренер по бегу и ОФП, КМС по лёгкой атлетике. При цитировании статьи укажите имя автора, название материала и ссылку на статью.</p>
      <p>Официальный сайт: <a href={origin}>seleznevcoach.ru</a>. По вопросам публикаций: <a href="/contacts">контакты</a>.</p>
    </section>
  </main><Footer/></>;
}
