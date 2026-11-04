import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {Home} from '../components/site/home';
type Props={searchParams:Promise<Record<string,string|string[]|undefined>>};
export async function generateMetadata({searchParams}:Props):Promise<Metadata>{
 const host=(await headers()).get('host')?.split(':')[0];
 const production=host==='seleznevcoach.ru'||host==='www.seleznevcoach.ru';
 const preview=(await searchParams).preview==='mobile';
 return {title:'Тренер по бегу онлайн и в Москве — Александр Селезнёв',description:'Индивидуальная подготовка бегунов, ОФП и СФП. Онлайн-ведение и очные тренировки в Москве с Александром Селезнёвым.',alternates:{canonical:'https://seleznevcoach.ru',languages:{ru:'https://seleznevcoach.ru',en:'https://seleznevcoach.ru/en'}},robots:{index:production&&!preview,follow:production&&!preview},openGraph:{title:'Александр Селезнёв | Тренер по бегу',description:'У каждой тренировки должна быть причина.',url:'https://seleznevcoach.ru',type:'website',locale:'ru_RU',images:['/images/generated/premium-stadium-hero.webp']}};
}
export default async function Page({searchParams}:Props){
 // A faithful small-screen rendering for visual QA, never linked in the product UI.
 if((await searchParams).preview==='mobile')return <main style={{display:'grid',placeItems:'center',minHeight:'100svh',background:'#dde1e3'}}><iframe src="/" title="Мобильная версия сайта" style={{width:390,maxWidth:'100%',height:844,border:0,background:'#f6f7f8'}}/></main>;
 const person={'@context':'https://schema.org','@type':'Person','@id':'https://seleznevcoach.ru/#alexander',name:'Александр Селезнёв',url:'https://seleznevcoach.ru',jobTitle:'Тренер по бегу и общей физической подготовке',sameAs:['https://t.me/runadapt','https://www.instagram.com/seleznevcoach/']};
 return <><link rel="preload" as="image" href="/images/generated/premium-stadium-hero.webp" fetchPriority="high"/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(person).replace(/</g,'\\u003c')}}/><Home/></>;
}
