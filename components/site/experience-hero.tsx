'use client';
import {useRef,useState} from 'react';
import {ArrowUpRight,ChevronLeft,ChevronRight,RotateCcw} from 'lucide-react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {AthleteCutout} from './athlete-cutout';
gsap.registerPlugin(useGSAP);
const formats=[
 {id:'personal',title:'Бег.',card:'БЕГ',tag:'Онлайн + Москва',description:'Подготовка под вашу цель, график и тренировочный опыт.',image:'/media/race-autumn.webp',position:'50% 34%',detail:'Персональная подготовка'},
 {id:'sport-conditioning',title:'Сила движения.',card:'ОФП / СФП',tag:'Теннис · Футбол',description:'Скорость, координация, сила и выносливость под задачи вашего спорта.',image:'/media/training-warmup.webp',position:'50% 42%',detail:'90 минут · 4 990 ₽ + аренда'},
 {id:'kids',title:'Движение с детства.',card:'ДЕТЯМ',tag:'От 5 лет',description:'Бег, ОФП и СФП с учётом возраста и возможностей ребёнка. Первое занятие вместе с родителем.',image:'/images/generated/track-panorama.webp',position:'65% center',detail:'90 минут · 4 990 ₽ + аренда'},
 {id:'performance',title:'К своему результату.',card:'НА СТАРТ',tag:'Подготовка к результату',description:'Последовательная работа от оценки исходной формы до ключевого старта.',image:'/media/athlete.webp',position:'50% 28%',detail:'Планирование · Обратная связь'},
];
export function ExperienceHero(){
 const root=useRef<HTMLElement>(null),environment=useRef<HTMLDivElement>(null),person=useRef<HTMLDivElement>(null),space=useRef<HTMLDivElement>(null),copy=useRef<HTMLDivElement>(null);
 const backgrounds=useRef<(HTMLDivElement|null)[]>([]),cards=useRef<(HTMLButtonElement|null)[]>([]);
 const busy=useRef(false),mounted=useRef(true),moveEnvironmentX=useRef<((v:number)=>void)|null>(null),moveEnvironmentY=useRef<((v:number)=>void)|null>(null),movePersonX=useRef<((v:number)=>void)|null>(null),moveSpaceY=useRef<((v:number)=>void)|null>(null);
 const [active,setActive]=useState<number|null>(null),[transitioning,setTransitioning]=useState(false);
 const current=active===null?null:formats[active];
 const {contextSafe}=useGSAP(()=>{
  mounted.current=true;
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const intro=gsap.timeline({defaults:{ease:'power3.out'}});
   intro.fromTo(root.current!.querySelectorAll('.portal-surface'),{y:100,z:-350,rotationY:28,opacity:0},{y:0,z:0,rotationY:0,opacity:1,duration:1.25,stagger:.1,clearProps:'transform,opacity'},.1)
    .fromTo(person.current,{y:35,opacity:0},{y:0,opacity:1,duration:1.2,clearProps:'transform,opacity'},.15)
    .fromTo(copy.current,{y:20,opacity:.3},{y:0,opacity:1,duration:.9,clearProps:'transform,opacity'},0);
   return()=>intro.revert();
  });
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',()=>{
   moveEnvironmentX.current=gsap.quickTo(environment.current,'x',{duration:1,ease:'power3.out'});
   moveEnvironmentY.current=gsap.quickTo(environment.current,'y',{duration:1,ease:'power3.out'});
   movePersonX.current=gsap.quickTo(person.current,'x',{duration:.8,ease:'power3.out'});
   moveSpaceY.current=gsap.quickTo(space.current,'rotationY',{duration:.8,ease:'power3.out'});
   return()=>{moveEnvironmentX.current=null;moveEnvironmentY.current=null;movePersonX.current=null;moveSpaceY.current=null};
  });
  return()=>{mounted.current=false;media.revert()};
 },{scope:root});
 const choose=contextSafe((index:number|null)=>{
  if(index===active||busy.current||!root.current)return;
  const targetIndex=index===null?0:index+1;
  const target=backgrounds.current[targetIndex];if(!target)return;
  busy.current=true;setTransitioning(true);
  const bounds=root.current.getBoundingClientRect();
  const source=index===null?null:cards.current[index]?.getBoundingClientRect();
  const top=source?Math.max(0,source.top-bounds.top):bounds.height*.42;
  const right=source?Math.max(0,bounds.right-source.right):bounds.width*.36;
  const bottom=source?Math.max(0,bounds.bottom-source.bottom):bounds.height*.42;
  const left=source?Math.max(0,source.left-bounds.left):bounds.width*.36;
  gsap.killTweensOf([person.current,...root.current.querySelectorAll('.portal-surface')]);
  gsap.set(person.current,{clearProps:'opacity,y'});
  gsap.set(root.current.querySelectorAll('.portal-surface'),{clearProps:'transform,opacity'});
  setActive(index);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(index!==null){const deck=cards.current[index]?.parentElement,card=cards.current[index];if(deck&&card&&deck.scrollWidth>deck.clientWidth)deck.scrollTo({left:card.offsetLeft-(deck.clientWidth-card.clientWidth)/2,behavior:reduced?'instant':'smooth'})}
  gsap.killTweensOf(backgrounds.current.filter(Boolean));
  gsap.set(target,{zIndex:2,opacity:1});
  gsap.fromTo(target,{clipPath:`inset(${top}px ${right}px ${bottom}px ${left}px round 4px)`},{clipPath:'inset(0px 0px 0px 0px round 0px)',duration:reduced?0:1.08,ease:'power3.inOut',onComplete:()=>{
   backgrounds.current.forEach((bg,i)=>{if(bg)gsap.set(bg,{opacity:i===targetIndex?1:0,zIndex:i===targetIndex?1:0,clearProps:'clipPath'})});
   busy.current=false;if(mounted.current)setTransitioning(false);
  }});
  if(!reduced)gsap.fromTo(copy.current!.querySelectorAll('h1, .experience-description, .experience-detail'),{y:24,opacity:0},{y:0,opacity:1,stagger:.06,duration:.65,delay:.15,ease:'power3.out',clearProps:'transform,opacity'});
 });
 const selectRelative=(delta:number)=>choose(active===null?(delta>0?0:formats.length-1):(active+delta+formats.length)%formats.length);
 const resetPointer=()=>{moveEnvironmentX.current?.(0);moveEnvironmentY.current?.(0);movePersonX.current?.(0);moveSpaceY.current?.(0)};
 return <section id="athlete" ref={root} className={`experience-hero ${current?'is-active':'is-overview'}`} aria-label="Форматы подготовки" aria-busy={transitioning} onPointerMove={event=>{
  if(event.pointerType!=='mouse')return;
  const box=event.currentTarget.getBoundingClientRect(),x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;
  moveEnvironmentX.current?.(-x*18);moveEnvironmentY.current?.(-y*10);movePersonX.current?.(x*22);moveSpaceY.current?.(-x*5);
 }} onPointerLeave={resetPointer}>
  <div className="experience-environment" ref={environment} aria-hidden="true">
   <div className="experience-background experience-background-base" ref={el=>{backgrounds.current[0]=el}}><img src="/images/generated/immersive-arena.webp" width="1672" height="941" fetchPriority="high" alt=""/></div>
   {formats.map((format,i)=><div key={format.id} className="experience-background" ref={el=>{backgrounds.current[i+1]=el}}><img src={format.image} style={{objectPosition:format.position}} alt="" loading="lazy"/></div>)}
  </div>
  <div className="experience-light" aria-hidden="true"/>
  <div className="experience-person" ref={person}><AthleteCutout/></div>
  <div className="experience-copy" ref={copy} aria-live="polite" aria-atomic="true">
   <p className="experience-byline">АЛЕКСАНДР СЕЛЕЗНЁВ <span>/ ТРЕНЕР ПО БЕГУ</span></p>
   <h1>{current?current.title:<>У каждой тренировки<br/>должна быть причина.</>}</h1>
   <p className="experience-description">{current?current.description:'Выберите свой формат подготовки.'}</p>
   {current&&<p className="experience-detail">{current.detail}</p>}
  </div>
  <div className="experience-control-panel">
   <span className="experience-count">{active===null?'4 формата':`${String(active+1).padStart(2,'0')} / 04`}</span>
   <button type="button" aria-label="Предыдущий формат" onClick={()=>selectRelative(-1)} disabled={transitioning}><ChevronLeft size={20}/></button>
   <button type="button" aria-label="Следующий формат" onClick={()=>selectRelative(1)} disabled={transitioning}><ChevronRight size={20}/></button>
   {current&&<button type="button" className="experience-overview" aria-label="Показать все форматы" onClick={()=>choose(null)} disabled={transitioning}><RotateCcw size={15}/><span>Все форматы</span></button>}
  </div>
  <div className="portal-space" ref={space}><div className="portal-deck" role="group" aria-label="Выберите формат подготовки" onKeyDown={event=>{
   if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;
   event.preventDefault();const delta=event.key==='ArrowRight'?1:-1;const next=active===null?(delta>0?0:3):(active+delta+4)%4;choose(next);cards.current[next]?.focus({preventScroll:true});
  }}>{formats.map((format,i)=><button key={format.id} ref={el=>{cards.current[i]=el}} type="button" className={`portal-card ${active===i?'is-selected':''}`} aria-label={`Выбрать формат: ${format.card}`} aria-pressed={active===i} onClick={()=>choose(i)} disabled={transitioning}>
   <span className="portal-surface"><img src={format.image} style={{objectPosition:format.position}} alt="" loading="lazy"/><span className="portal-shade"/><span className="portal-number">0{i+1}</span><span className="portal-content"><strong>{format.card}</strong><span>{format.tag}</span></span><span className="portal-arrow" aria-hidden="true"><ArrowUpRight size={19}/></span></span>
  </button>)}</div></div>
  <div className="experience-footer"><a className="experience-cta" href="#contact" onClick={()=>{if(current)window.dispatchEvent(new CustomEvent('choose-service',{detail:current.id}))}}>Обсудить мою цель <ArrowUpRight size={20}/></a><span className="experience-location">Онлайн / Москва</span></div>
 </section>;
}
