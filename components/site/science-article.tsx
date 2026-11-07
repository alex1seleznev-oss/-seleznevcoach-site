import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Fragment } from 'react';
import { Header, Footer } from '@/components/site/shell';
import { editorialDate, journalEditions, type JournalEditionSlug } from '@/lib/journal-editions';
import { authorReference, isPublicHost, jsonLd, origin } from '@/lib/site-identity';
import type { Story } from '@/lib/journal-stories/types';

function Inline({text}: {text: string}) {
  return <>{text.split(/(\[\d+\])/g).map((part, i) => {
    const citation = part.match(/^\[(\d+)\]$/);
    return citation ? <sup key={i}><a aria-label={`Источник ${citation[1]}`} href={`#source-${citation[1]}`}>{part}</a></sup> : <Fragment key={i}>{part}</Fragment>;
  })}</>;
}

export function scienceArticle(slug: JournalEditionSlug, story: Story) {
  const entry = journalEditions.find(article => article.slug === slug)!;
  const url = `${origin}/journal/${entry.slug}`;
  const image = origin + entry.image;
  const author = authorReference();
  const title = entry.title;
  const description = entry.teaser;
  const dateLabel = new Intl.DateTimeFormat('ru-RU', {day:'numeric', month:'long', year:'numeric', timeZone:'UTC'}).format(new Date(editorialDate));

  async function generateMetadata(): Promise<Metadata> {
    const index = isPublicHost((await headers()).get('host'));
    return {
      title: `${title} | Александр Селезнёв`, description, alternates: {canonical:url},
      robots: {index, follow:index},
      openGraph: {title, description, url, images:[{url:image, alt:entry.imageAlt}], type:'article', locale:'ru_RU', publishedTime:editorialDate, authors:[author.url]},
      twitter: {card:'summary_large_image', title, description, images:[image]},
    };
  }

  function Page() {
    const blog = {
      '@context':'https://schema.org', '@type':'BlogPosting', headline:title, description, url,
      mainEntityOfPage:url, inLanguage:'ru', image, author, datePublished:editorialDate,
      articleSection:entry.category, citation:story.sources.map(source => source.href),
    };
    const breadcrumb = {
      '@context':'https://schema.org', '@type':'BreadcrumbList',
      itemListElement:[['Главная', origin], ['Журнал', origin+'/journal'], [title, url]].map(([name,item],i) => ({'@type':'ListItem',position:i+1,name,item})),
    };
    return <><Header/><main id="main" className="detail-page science-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd([blog,breadcrumb])}}/>
      <article>
        <header className="detail-hero section science-hero">
          <a className="detail-back" href="/journal">← В журнал</a>
          <span className="mono">{entry.category} / {entry.readMinutes} МИН ЧТЕНИЯ</span>
          <h1>{title}</h1>
          <p>{story.opening}</p>
          <p className="journal-byline"><a href="/about" rel="author">{author.name}</a> · <time dateTime={editorialDate}>{dateLabel}</time></p>
        </header>
        <div className="detail-content section en-prose science-body">
          <figure className="science-cover">
            <img src={entry.image} alt={entry.imageAlt} style={{objectPosition:entry.imagePosition}} loading="lazy"/>
            {entry.generated && <figcaption>Иллюстрация создана с помощью ИИ.{slug === 'running-shoes-runrepeat-guide' && ' На изображении условные модели, не участники сравнения.'}</figcaption>}
          </figure>
          <aside className="science-summary" aria-label="Короткий ответ"><strong>Короткий ответ</strong><p><Inline text={story.takeaway}/></p></aside>
          <nav className="science-toc" aria-label="Содержание статьи">
            <strong>В статье</strong>
            <ol>{story.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>)}</ol>
          </nav>
          {story.sections.map(section => <section className="science-section" key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id}>{section.heading}</h2>
            {section.paragraphs.map(p => <p key={p}><Inline text={p}/></p>)}
            {section.list && <ul>{section.list.map(p => <li key={p}><Inline text={p}/></li>)}</ul>}
            {section.table && <div className="science-table-scroll" tabIndex={0} role="region" aria-label={section.table.caption}><table className="journal-data-table">
              <caption>{section.table.caption}</caption>
              <thead><tr>{section.table.columns.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>{section.table.rows.map(([head,...row]) => <tr key={head}><th scope="row"><Inline text={head}/></th>{row.map((c,i) => <td key={i}><Inline text={c}/></td>)}</tr>)}</tbody>
            </table></div>}
          </section>)}
          <aside className="science-summary" aria-label="Надёжность выводов"><strong>Что можно заключить</strong><p><Inline text={story.evidence}/></p></aside>
          <section className="science-section" aria-labelledby="sources"><h2 id="sources">Источники</h2>
            <ol className="science-sources">{story.sources.map((source,i) => <li key={source.href} id={`source-${i+1}`}><a href={source.href}>{source.label}</a><p>{source.note}</p></li>)}</ol>
          </section>
          <div className="reading-callout"><span className="mono">ЧИТАТЬ ДАЛЬШЕ</span>{story.related.map(r => <a key={r.slug} href={`/journal/${r.slug}`}>{r.label} →</a>)}</div>
          <p className="journal-citation">Для ссылки: Селезнёв А. «{title}». {dateLabel} <a href={url}>Постоянный адрес статьи</a>.</p>
        </div>
      </article>
    </main><Footer/></>;
  }
  return {Page, generateMetadata};
}
