import { journal } from '@/lib/site-content';
import { ArrowUpRight } from 'lucide-react';

const ordered = [...journal].reverse();

export function JournalCards({limit}: {limit?: number}) {
  const Heading = limit ? 'h3' : 'h2';
  return <div className="journal-grid">{(limit ? ordered.slice(0, limit) : ordered).map(article =>
    <a className="journal-card" key={article.slug} href={`/journal/${article.slug}`}>
      <div className="journal-image">
        <img src={article.image} style={{objectPosition: article.imagePosition}} loading="lazy" alt=""/>
        <span className="journal-issue mono">ЗАМЕТКИ ТРЕНЕРА / {article.number}</span>
      </div>
      <div className="journal-meta mono"><span>{article.category}</span><span>{article.readMinutes} МИН ЧТЕНИЯ</span></div>
      <Heading className="journal-card-title">{article.title}</Heading>
      <div className="journal-card-bottom"><span>Читать статью</span><ArrowUpRight size={20} aria-hidden="true"/></div>
    </a>
  )}</div>;
}
