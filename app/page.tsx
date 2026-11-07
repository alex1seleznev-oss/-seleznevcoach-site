import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {Home} from '../components/site/home';
import {author, isPublicHost, jsonLd} from '../lib/site-identity';
import {seoTargets} from '../lib/seo-targets';
type Props={searchParams:Promise<Record<string,string|string[]|undefined>>};
export async function generateMetadata({searchParams}:Props):Promise<Metadata>{
 const host=(await headers()).get('host')?.split(':')[0];
 const production=isPublicHost(host);
 const preview=(await searchParams).preview==='mobile';
 return {title:seoTargets['/'].title,description:seoTargets['/'].description,alternates:{canonical:'https://seleznevcoach.ru',languages:{ru:'https://seleznevcoach.ru',en:'https://seleznevcoach.ru/en','x-default':'https://seleznevcoach.ru'}},robots:{index:production&&!preview,follow:production&&!preview},openGraph:{title:'Александр Селезнёв | Тренер по бегу',description:'У каждой тренировки должна быть причина.',url:'https://seleznevcoach.ru',type:'website',locale:'ru_RU',images:['/images/generated/premium-stadium-hero.webp']}};
}
export default async function Page({searchParams}:Props){
 // A faithful small-screen rendering for visual QA, never linked in the product UI.
 if((await searchParams).preview==='mobile')return <main style={{display:'grid',placeItems:'center',minHeight:'100svh',background:'#dde1e3'}}><iframe src="/" title="Мобильная версия сайта" style={{width:390,maxWidth:'100%',height:844,border:0,background:'#f6f7f8'}}/></main>;
 const schema={'@context':'https://schema.org','@graph':[author,{'@type':'WebSite',name:'Александр Селезнёв — тренер по бегу',url:'https://seleznevcoach.ru/',publisher:{'@id':author['@id']}}]};
 return <><link rel="preload" as="image" href="/images/generated/immersive-arena.webp" fetchPriority="high"/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/><Home/></>;
}
