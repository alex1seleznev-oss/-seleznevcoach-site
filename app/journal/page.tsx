import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Header, Footer } from '@/components/site/shell';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { journal } from '@/lib/site-content';
import { isPublicHost, origin } from '@/lib/site-identity';
import { seoTargets } from '@/lib/seo-targets';

export async function generateMetadata(): Promise<Metadata> {
  const index = isPublicHost((await headers()).get('host'));
  return {
    title: seoTargets['/journal'].title,
    description: seoTargets['/journal'].description,
    alternates: {
      canonical: `${origin}/journal`,
      languages: {ru: `${origin}/journal`, en: `${origin}/en/journal`, 'x-default': `${origin}/journal`},
    },
    robots: {index, follow: index},
  };
}

const featuredSlugs = ['strength-training-middle-distance', 'in-season-strength-middle-distance'];
const topics = [
  {id:'strength', label:'Силовая подготовка', includes: (slug: string) => featuredSlugs.includes(slug) || slug === 'strength-training-without-bulk'},
  {id:'elite', label:'Разборы элиты', includes: (slug: string) => /^elite-(100m|400m|800m|10000m|marathon)-training$/.test(slug)},
  {id:'training', label:'Тренировки и физиология', includes: (_slug: string) => false},
  {id:'gear', label:'Экипировка', includes: (slug: string) => ['what-to-wear-running-weather', 'running-shoes-runrepeat-guide'].includes(slug)},
] as const;
const topicId = (slug: string) =>
  topics.find(topic => topic.id !== 'training' && topic.includes(slug))?.id ?? 'training';
const issues = [...journal].reverse();

function IssueMeta({article}: {article: typeof journal[number]}) {
  return <p className="journal-issue-meta"><span>{article.category}</span><span>{article.readMinutes} мин</span></p>;
}

export default function Journal() {
  return <><Header/><main id="main" className="journal-index journal-index-edited section">
    <h1 className="display">ЖУРНАЛ<span className="signal">.</span></h1>
    <p className="journal-index-intro">Наука о беге без лишней теории: физиология выносливости, силовые и скоростные тренировки, экипировка и подготовка к стартам. Автор — <a href="/about">Александр Селезнёв</a>, тренер по бегу и ОФП.</p>
    <nav className="journal-topics" aria-label="Темы журнала"><ul>
      {topics.map(topic => <li key={topic.id}><a href={`#${topic.id}`}>{topic.label}<ArrowDown size={15} aria-hidden="true"/></a></li>)}
    </ul></nav>
    {topics.map(topic => {
      const entries = issues.filter(article => topicId(article.slug) === topic.id);
      const features = featuredSlugs.flatMap(slug => entries.filter(article => article.slug === slug));
      const archive = entries.filter(article => !featuredSlugs.includes(article.slug));
      return <section className="journal-topic" key={topic.id} aria-labelledby={topic.id}>
        <h2 id={topic.id} tabIndex={-1}>{topic.label}</h2>
        {features.length > 0 && <ul className="journal-features">
          {features.map((article, i) => <li key={article.slug}>
            <a className="journal-feature" href={`/journal/${article.slug}`} aria-labelledby={`issue-${article.slug}`}>
              <div className="journal-feature-photo"><img src={article.image} style={{objectPosition:article.imagePosition}} fetchPriority={i === 0 ? 'high' : 'auto'} alt=""/></div>
              <IssueMeta article={article}/>
              <h3 id={`issue-${article.slug}`}>{article.title}</h3>
              <p className="journal-feature-teaser">{article.teaser}</p>
              <span className="journal-feature-action">Читать статью <ArrowUpRight size={18} aria-hidden="true"/></span>
            </a>
          </li>)}
        </ul>}
        <ul className="journal-archive">
          {archive.map(article => <li key={article.slug}>
            <a className="journal-archive-link" href={`/journal/${article.slug}`} aria-labelledby={`issue-${article.slug}`}>
              <div><IssueMeta article={article}/><h3 id={`issue-${article.slug}`}>{article.title}</h3></div>
              <ArrowUpRight size={20} aria-hidden="true"/>
            </a>
          </li>)}
        </ul>
      </section>;
    })}
  </main><Footer/></>;
}
