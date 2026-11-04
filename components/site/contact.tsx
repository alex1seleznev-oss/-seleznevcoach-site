'use client';
import {useEffect,useState} from 'react';
import {services,siteConfig} from '@/lib/site-content';
import {ContactMethods} from './contact-methods';
import {Arrow,Kicker} from './shell';
export function Contact(){
 const [service,setService]=useState('');
 useEffect(()=>{const select=(event:Event)=>setService((event as CustomEvent<string>).detail);window.addEventListener('choose-service',select);return()=>window.removeEventListener('choose-service',select)},[]);
 return <section className="contact section" id="contact"><Kicker number="07">СЛЕДУЮЩИЙ ШАГ — ВАШ</Kicker><h2 className="display contact-title">БЕЖАТЬ ЛУЧШЕ.<br/><span>С ПОНИМАНИЕМ.</span></h2><div className="contact-grid"><div className="contact-intro"><h3>Начнём с вашей цели.</h3><p>Расскажите, к чему хотите прийти и сколько времени готовы уделять подготовке. Сначала обсудим задачу и подходящий формат — выбирать тариф заранее не нужно.</p><span className="contact-signature">АЛЕКСАНДР<br/>СЕЛЕЗНЁВ<span>/</span></span></div><div className="direct-contact"><span className="mono">ЛИЧНОЕ ОБЩЕНИЕ С ТРЕНЕРОМ</span><h3>Напишите мне.</h3>{service&&<p className="chosen-format">Ваш интерес: <strong>{services.find(s=>s.id===service)?.name}</strong></p>}<ContactMethods service={service}/><p>В первом сообщении достаточно назвать цель и удобный формат: онлайн или очно. За ребёнка обращается родитель или другой законный представитель.</p><p className="contact-privacy">Не присылайте медицинские документы и паспортные данные. <a href="/privacy">Как обрабатываются данные</a></p><a className="text-link" href={siteConfig.telegramChannel} target="_blank" rel="noreferrer">Читать канал RUNADAPT <Arrow/></a></div></div></section>;
}
