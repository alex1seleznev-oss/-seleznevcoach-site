import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Fragment } from 'react';
import { Header, Footer } from '@/components/site/shell';
import { eliteEditions, type EliteSlug } from '@/lib/elite-dossiers/editions';
import { photos } from '@/lib/elite-dossiers/photos';
import type { Dossier } from '@/lib/elite-dossiers/types';
import { editorialDate } from '@/lib/journal-editions';
import { authorReference, isPublicHost, jsonLd, origin } from '@/lib/site-identity';

function Inline({text}: {text: string}) {
  return <>{text.split(/(\[\d+\])/g).map((p, i) => /^\[\d+\]$/.test(p)
    ? <sup key={i}><a href={'#source-'+p.slice(1,-1)} aria-label={'Источник '+p.slice(1,-1)}>{p}</a></sup>
    : <Fragment key={i}>{p}</Fragment>)}</>;
}

export function eliteArticle(slug: EliteSlug, dossier: Dossier) {
  const entry = eliteEditions.find(e => e.slug === slug)!;
  const url = origin+'/journal/'+slug;
  const title = dossier.title;
  const description = dossier.description;
  const cover = origin+entry.image;
  const author = authorReference();
  const date = new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(editorialDate));

  async function generateMetadata(): Promise<Metadata> {
    const index = isPublicHost((await headers()).get('host'));
    return {
      title, description, alternates:{canonical:url}, robots:{index,follow:index},
      openGraph:{type:'article', locale:'ru_RU', title, description, url, images:[{url:cover,alt:entry.imageAlt}], publishedTime:editorialDate, authors:[author.url]},
      twitter:{card:'summary_large_image',title,description,images:[cover]},
    };
  }

  function Page() {
    const schema = [{
      '@context':'https://schema.org','@type':'BlogPosting',headline:title, description,url,
      mainEntityOfPage:url, datePublished:editorialDate, inLanguage:'ru', author,
      articleSection:'Подготовка элитных бегунов',
      image:dossier.athletes.map(a => {
        const p=photos[a.id];
        return {'@type':'ImageObject',contentUrl:origin+p.src,creditText:p.credit,license:p.licenseUrl,caption:p.caption};
      }), citation:dossier.sources.map(([,href])=>href),
    },{
      '@context':'https://schema.org','@type':'BreadcrumbList',
      itemListElement:[['Главная',origin],['Журнал',origin+'/journal'],[title,url]].map(([name,item],i)=>({'@type':'ListItem',position:i+1,name,item})),
    }];

    return <><Header/><main id="main" className="detail-page science-page elite-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/>
      <article>
        <header className="detail-hero section science-hero">
          <a className="detail-back" href="/journal">← В журнал</a>
          <span className="mono">КАК ТРЕНИРОВАЛАСЬ ЭЛИТА / {dossier.distance} / {entry.readMinutes} МИН ЧТЕНИЯ</span>
          <h1>{title}</h1>
          <p>{dossier.opening}</p>
          <p className="journal-byline"><a href="/about" rel="author">{author.name}</a> · <time dateTime={editorialDate}>{date}</time></p>
        </header>
        <div className="detail-content section en-prose science-body">
          <nav className="science-toc elite-toc" aria-label="Содержание статьи">
            <strong>В статье</strong>
            <ol>{dossier.athletes.map(a=><li key={a.id}><a href={'#'+a.id}>{a.name}</a></li>)}
              <li><a href="#compare">Сравнение моделей подготовки</a></li><li><a href="#practice">Для тренера и любителя</a></li></ol>
          </nav>
          <section className="science-section" aria-labelledby="demands">
            <h2 id="demands">Что определяет результат</h2>
            {dossier.physiology.map(p=><p key={p}><Inline text={p}/></p>)}
            <aside className="science-summary" aria-label="Как читать разбор"><strong>Как читать разбор</strong>
              <p>Протокол подтверждает результат и, если опубликованы, сплиты. Интервью и дневники описывают подготовку в конкретный период. Аналитические выводы отмечены отдельно; схема тренера не заменяет личный журнал спортсмена.</p>
            </aside>
          </section>
          {dossier.athletes.map((a,i)=>{
            const p=photos[a.id];
            const categories = [['Физическая',a.physical],['Техническая',a.technical],['Тактическая',a.tactical],['Психическая',a.mental],['Интегральная',a.integrated]];
            return <section className="science-section elite-profile" key={a.id} aria-labelledby={a.id}>
              <div className="elite-profile-lead">
                <div>
                  <span className="mono">0{i+1} / {a.era}</span>
                  <h2 id={a.id}>{a.name}</h2>
                  <p className="elite-result"><Inline text={a.result}/></p>
                  <p><Inline text={a.hook}/></p>
                </div>
                <figure className="elite-photo">
                  <img src={p.src} alt={p.caption} width={p.width} height={p.height} loading="lazy" decoding="async"/>
                  <figcaption>{p.caption} Фото: {p.credit}. <a href={p.original}>Оригинал</a> · <a href={p.licenseUrl}>{p.license}</a>. Версия в WebP.</figcaption>
                </figure>
              </div>
              <h3>Пять сторон подготовки</h3>
              <dl className="elite-preparation">{categories.map(([label,value])=><div key={label}><dt>{label}</dt><dd><Inline text={value}/></dd></div>)}</dl>
              <h3>Этапы и циклы</h3>
              <ol className="elite-phases">{a.phases.map(([label,value])=><li key={label}><strong>{label}</strong><p><Inline text={value}/></p></li>)}</ol>
              <p className="elite-limit"><strong>Граница данных. </strong><Inline text={a.limit}/></p>
              <p className="elite-lesson"><strong>Вывод для тренера. </strong><Inline text={a.lesson}/></p>
            </section>;
          })}
          <section className="science-section" aria-labelledby="compare">
            <h2 id="compare">Четыре модели в сравнении</h2>
            <div className="science-table-scroll" tabIndex={0} aria-label="Таблица сравнения">
              <table className="journal-data-table">
                <caption>Подтверждённые опоры подготовки и пределы сравнения</caption>
                <thead><tr>{['Спортсмен','Приоритет','Что подтверждено','Что ограничивает вывод'].map(x=><th key={x} scope="col">{x}</th>)}</tr></thead>
                <tbody>{dossier.comparison.map(([name,...rest])=><tr key={name}><th scope="row">{name}</th>{rest.map(x=><td key={x}><Inline text={x}/></td>)}</tr>)}</tbody>
              </table>
            </div>
          </section>
          <section className="science-section" aria-labelledby="practice">
            <h2 id="practice">Что взять в свою подготовку</h2>
            {dossier.practice.map(p=><p key={p}><Inline text={p}/></p>)}
          </section>
          <section className="science-section" aria-labelledby="sources">
            <h2 id="sources">Источники и данные</h2>
            <ol className="science-sources">{dossier.sources.map(([label,href,note],i)=><li key={href} id={'source-'+(i+1)}><a href={href}>{label}</a><p>{note}</p></li>)}</ol>
          </section>
          <nav className="reading-callout" aria-label="Другие статьи серии">
            <span className="mono">ДРУГИЕ ДИСТАНЦИИ</span>
            {eliteEditions.filter(e=>e.slug!==slug).map(e=><a key={e.slug} href={'/journal/'+e.slug}>{e.title} →</a>)}
            <a href={'/journal/'+dossier.related[0]}>{dossier.related[1]} →</a>
          </nav>
          <p className="journal-citation">Для ссылки: Селезнёв А. «{title}». {date} <a href={url}>Постоянный адрес статьи</a>.</p>
        </div>
      </article>
    </main><Footer/></>;
  }
  return {generateMetadata, Page};
}
