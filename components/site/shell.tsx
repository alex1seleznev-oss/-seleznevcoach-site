'use client';
import { useRef } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
export const sections = [['athlete','Главная'],['coach','Обо мне'],['method','Подход'],['services','Услуги'],['pace-lab','Темп'],['journal','Журнал']];
export function Arrow({className=''}:{className?:string}) { return <ArrowUpRight className={className} aria-hidden="true" size={20}/>; }
export function Header() {
 const dialog=useRef<HTMLDialogElement>(null);
 const close=()=>dialog.current?.close();
 return <><a className="skip-link" href="#main">К содержимому</a><header className="site-header"><a href="/#athlete" className="wordmark" aria-label="Александр Селезнёв — главная">AS<span>/</span></a><nav className="desktop-nav" aria-label="Основная навигация">{sections.map(([id,name])=><a key={id} href={`/#${id}`}>{name}</a>)}</nav><nav className="language-switch" aria-label="Язык сайта"><a href="/" hrefLang="ru" lang="ru" aria-current="page">Русский</a><span aria-hidden="true">/</span><a href="/en" hrefLang="en" lang="en">English</a></nav><a className="header-cta" href="/#contact">Начать работу <Arrow/></a><button type="button" className="mobile-menu" aria-label="Открыть меню" aria-haspopup="dialog" onClick={()=>dialog.current?.showModal()}><Menu size={24}/></button></header><dialog ref={dialog} className="native-menu" role="dialog" aria-modal="true" aria-labelledby="native-menu-title" onClick={event=>{if(event.target===event.currentTarget)close()}}><div className="native-menu-top"><h2 id="native-menu-title">Навигация</h2><button type="button" onClick={close} aria-label="Закрыть меню" autoFocus><X/></button></div><nav aria-label="Мобильная навигация">{[...sections,['contact','Связаться']].map(([id,name],i)=><a href={`/#${id}`} key={id} onClick={close}><span>{String(i+1).padStart(2,'0')}</span>{name}<Arrow/></a>)}</nav><a className="native-menu-journal" href="/journal">Все статьи журнала <Arrow/></a></dialog></>;
}
export { SiteFooter as Footer } from './site-footer';
export function Kicker({number,children,light=false}:{number:string,children:React.ReactNode,light?:boolean}) { return <div className={`kicker ${light?'on-light':''}`}><span className="index">{number}</span><span>{children}</span></div>; }
export { Motion } from './motion';
export function Counter({value,label}:{value:string,label:string}) {
 return <div className="record"><span className="mono">{label}</span><span className="record-value" aria-label={value}>{value}</span><span className="record-caption">ЛИЧНЫЙ РЕЗУЛЬТАТ</span></div>;
}
