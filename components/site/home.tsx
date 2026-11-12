'use client';

import {ArrowUpRight} from 'lucide-react';
import {ExperienceHero} from './experience-hero';
import {Header,Footer,Motion} from './shell';
import {Contact} from './contact';
import {journal} from '@/lib/site-content';
import athleteFacts from '../../config/athlete-facts.json';

const formats=[
 {number:'01',name:'Персональное ведение',category:'БЕГ / ОНЛАЙН',description:'План, обратная связь и корректировка нагрузки под вашу цель.',image:'/media/mountain-run.jpeg',position:'center 42%',href:'/services/personal'},
 {number:'02',name:'Тренировки в Москве',category:'БЕГ / ОЧНО',description:'Техника, беговая работа и физическая подготовка на дорожке.',image:'/media/archive/training-group.webp',position:'center 40%',href:'/training/moscow'},
 {number:'03',name:'ОФП и СФП',category:'ТЕННИС / ФУТБОЛ',description:'Скорость, сила и координация под требования вашего спорта.',image:'/media/training-warmup.webp',position:'center 48%',href:'/services/sport-conditioning'},
 {number:'04',name:'Детям от 5 лет',category:'ДВИЖЕНИЕ / РАЗВИТИЕ',description:'Бег и физическая подготовка с учётом возраста и возможностей.',image:'/images/services/kids.webp',position:'center',href:'/services/kids'}
] as const;

const principles=[
 {number:'01',name:'Оценить',description:'Цель, тренировочная история, результаты и текущие ограничения.'},
 {number:'02',name:'Построить',description:'Объём, интенсивность, восстановление и задачи каждого занятия.'},
 {number:'03',name:'Адаптировать',description:'Самочувствие, RPE, сон и динамика работоспособности.'}
] as const;

const featuredArticle=journal.find(article=>article.slug==='5k-pace-1524');

export function Home(){
 return <>
  <Header/>
  <main id="main" className="editorial-home">
   <ExperienceHero/>
   <section className="editorial-about" id="coach" aria-labelledby="editorial-about-title">
    <div className="editorial-about-media">
     <img className="editorial-about-photo" src="/media/race-autumn.webp" alt="Александр Селезнёв во время бегового соревнования" loading="lazy" decoding="async" width="1152" height="1536"/>
     <div className="editorial-about-inset"><img src="/media/learning-portrait.webp" alt="Александр на образовательном мероприятии" loading="lazy" decoding="async" width="1152" height="1536"/><span>ПРАКТИКА И ЗНАНИЯ</span></div>
     <span className="editorial-photo-credit">01 / ТРЕНЕР И СПОРТСМЕН</span>
    </div>
    <div className="editorial-about-copy">
     <p className="editorial-eyebrow"><span>01 / ОБО МНЕ</span><span>АЛЕКСАНДР СЕЛЕЗНЁВ</span></p>
     <h2 id="editorial-about-title">БЕГУ.<br/>ТРЕНИРУЮ.<br/><em>ИЗУЧАЮ.</em></h2>
     <p className="editorial-lead">Тренер по бегу и ОФП. Действующий спортсмен. Исследую, как нагрузка и восстановление влияют на подготовку.</p>
     <p className="editorial-secondary">Не просто выдаю план: объясняю, зачем нужна тренировка, и корректирую работу по вашей реакции.</p>
     <div className="editorial-stats" aria-label="Опыт и результаты">
      <div><strong>{athleteFacts.fiveKmPb}</strong><span>5000 М / ЛИЧНЫЙ РЕКОРД</span></div>
      <div><strong>2017</strong><span>НАЧАЛО ТРЕНЕРСКОЙ РАБОТЫ</span></div>
      <div><strong>КМС / МС</strong><span>ЛЁГКАЯ АТЛЕТИКА / СЛУЖЕБНЫЙ БИАТЛОН</span></div>
     </div>
     <a className="editorial-inline-link" href="/about">Подробнее обо мне <ArrowUpRight aria-hidden="true" size={20}/></a>
    </div>
   </section>
   <section className="editorial-method" id="method" aria-labelledby="editorial-method-title">
    <img className="editorial-method-image" src="/media/mountain-track.jpeg" alt="" loading="lazy" decoding="async" width="1536" height="1152"/>
    <div className="editorial-method-content">
     <p className="editorial-eyebrow"><span>02 / МЕТОД</span><span>SCIENCE · SYSTEM · RESULT</span></p>
     <div className="editorial-method-heading">
      <h2 id="editorial-method-title">У КАЖДОЙ<br/>ТРЕНИРОВКИ<br/><em>ЕСТЬ ПРИЧИНА.</em></h2>
      <p>Результат строится не из случайных километров, а из последовательных решений.</p>
     </div>
     <div className="editorial-principles">
      {principles.map(item=><div key={item.number}><span>{item.number}</span><h3>{item.name}</h3><p>{item.description}</p></div>)}
     </div>
     <p className="editorial-method-note">Данные помогают принимать решения, но не заменяют тренерскую оценку.</p>
    </div>
   </section>
   <section className="editorial-formats" id="services" aria-labelledby="editorial-formats-title">
    <div className="editorial-section-head">
     <div><p className="editorial-eyebrow">03 / ФОРМАТЫ РАБОТЫ</p><h2 id="editorial-formats-title">ВАША ЦЕЛЬ.<br/><em>НАША РАБОТА.</em></h2></div>
     <p>От первого занятия до подготовки к ключевому старту. Выберите подходящий формат.</p>
    </div>
    <div className="editorial-format-grid">
     {formats.map(item=><a className="editorial-format-card" key={item.number} href={item.href} aria-label={item.name}>
      <img src={item.image} style={{objectPosition:item.position}} alt="" loading="lazy" decoding="async" width="900" height="1200"/>
      <span className="editorial-format-overlay" aria-hidden="true"/>
      <span className="editorial-format-top"><span>{item.number} / 04</span><ArrowUpRight size={22} aria-hidden="true"/></span>
      <span className="editorial-format-bottom"><span className="editorial-format-category">{item.category}</span><strong>{item.name}</strong><span className="editorial-format-description">{item.description}</span></span>
     </a>)}
    </div>
   </section>
   {featuredArticle&&<section className="editorial-journal" id="journal" aria-labelledby="editorial-journal-title">
    <div className="editorial-journal-intro"><p className="editorial-eyebrow">04 / ЖУРНАЛ</p><h2 id="editorial-journal-title">НЕ ТОЛЬКО<br/><em>БЕЖАТЬ.</em><br/>ПОНИМАТЬ.</h2><a className="editorial-inline-link" href="/journal">Все статьи <ArrowUpRight size={20} aria-hidden="true"/></a></div>
    <a className="editorial-journal-feature" href={`/journal/${featuredArticle.slug}`}>
     <div className="editorial-journal-photo"><img src="/media/coach.webp" alt="Александр Селезнёв на беговой дорожке" loading="lazy" decoding="async" width="1152" height="1536"/><span>ИЗ ПРАКТИКИ / 5000 М</span></div>
     <div className="editorial-journal-info"><span>РАЗБОР · {featuredArticle.readMinutes} МИН</span><h3>{featuredArticle.title}</h3><p>{featuredArticle.teaser}</p><span className="editorial-journal-more">Читать материал <ArrowUpRight size={20} aria-hidden="true"/></span></div>
    </a>
   </section>}
   <Contact/>
  </main>
  <Footer/>
  <Motion/>
 </>;
}
