import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Header, Footer, Kicker } from '@/components/site/shell';
import { JournalCards } from '@/components/site/journal-cards';
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

export default function Journal() {
  return <><Header/><main id="main" className="journal-index section">
    <Kicker number="06" light>ЗАМЕТКИ ТРЕНЕРА / АЛЕКСАНДР СЕЛЕЗНЁВ</Kicker>
    <h1 className="display">ЖУРНАЛ<span className="signal">.</span></h1>
    <p className="journal-index-intro">Наука о беге без лишней теории: физиология выносливости, силовые и скоростные тренировки, экипировка и подготовка к стартам. Автор — <a href="/about">Александр Селезнёв</a>, тренер по бегу и ОФП.</p>
    <JournalCards/>
  </main><Footer/></>;
}
