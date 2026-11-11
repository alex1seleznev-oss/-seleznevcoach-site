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
 const swipe=useRef<{x:number;y:number;ignore:boolean}|null>(null);
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

 const choose=contextSafe((index:number|null, directionHint?:number)=>{
  if(index===active||busy.current||!root.current||!copy.current)return;
  const fromIndex=active===null?0:active+1, toIndex=index===null?0:index+1;
  const from=backgrounds.current[fromIndex], to=backgrounds.current[toIndex];
  if(!from||!to)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const direction=directionHint||(toIndex>fromIndex?1:-1);
  busy.current=true;setTransitioning(true);
  gsap.killTweensOf([...backgrounds.current.filter(Boolean),person.current,...root.current.querySelectorAll('.portal-surface')]);
  gsap.set(root.current.querySelectorAll('.portal-surface'),{clearProps:'transform,opacity'});
  if(index!==null){
   const deck=cards.current[index]?.parentElement,card=cards.current[index];
   if(deck&&card&&deck.scrollWidth>deck.clientWidth)deck.scrollTo({left:card.offsetLeft-(deck.clientWidth-card.clientWidth)/2,behavior:reduced?'instant':'smooth'});
  }
  if(reduced){
   backgrounds.current.forEach((bg,i)=>{if(bg)gsap.set(bg,{xPercent:0,opacity:i===toIndex?1:0,zIndex:i===toIndex?1:0,clearProps:'transform'})});
   gsap.set(copy.current,{clearProps:'transform,opacity'});
   gsap.set(person.current,{clearProps:'transform,opacity'});
   setActive(index);busy.current=false;setTransitioning(false);
   return;
  }
  // Keep the old headline in its own layer until it has left the viewport.
  // The live React copy can then update without an abrupt text replacement.
  const liveCopy=copy.current;
  const exitCopy=liveCopy.cloneNode(true) as HTMLDivElement;
  exitCopy.classList.add('experience-copy-exit');
  exitCopy.setAttribute('aria-hidden','true');
  exitCopy.setAttribute('aria-live','off');
  const copyStyle=getComputedStyle(liveCopy);
  exitCopy.style.maxWidth=copyStyle.maxWidth;
  exitCopy.style.width=copyStyle.width;
  const liveHeading=liveCopy.querySelector('h1');
  const exitHeading=exitCopy.querySelector('h1');
  if(liveHeading&&exitHeading){
   const headingStyle=getComputedStyle(liveHeading);
   exitHeading.style.fontSize=headingStyle.fontSize;
   exitHeading.style.lineHeight=headingStyle.lineHeight;
   exitHeading.style.letterSpacing=headingStyle.letterSpacing;
  }
  root.current.appendChild(exitCopy);
  gsap.set(from,{xPercent:0,opacity:1,zIndex:2,visibility:'visible'});
  gsap.set(to,{xPercent:direction*100,opacity:1,zIndex:3,visibility:'visible'});
  gsap.set(exitCopy,{xPercent:0,opacity:1});
  gsap.set(liveCopy,{xPercent:direction*100,opacity:0});
  if(fromIndex===0)gsap.set(person.current,{opacity:1});
  if(toIndex===0)gsap.set(person.current,{xPercent:direction*60,opacity:0});
  setActive(index);
  const finish=()=>{
   backgrounds.current.forEach((bg,i)=>{if(bg)gsap.set(bg,{xPercent:0,opacity:i===toIndex?1:0,zIndex:i===toIndex?1:0,clearProps:'transform,visibility'})});
   gsap.set(liveCopy,{clearProps:'transform,opacity'});
   gsap.set(person.current,{clearProps:'transform,opacity'});
   exitCopy.remove();
   busy.current=false;
   if(mounted.current)setTransitioning(false);
  };
  requestAnimationFrame(()=>{
   if(!mounted.current){finish();return;}
   const tl=gsap.timeline({defaults:{ease:'power3.inOut'},onComplete:finish});
   tl.to(from,{xPercent:-direction*100,duration:1.05},0)
     .to(to,{xPercent:0,duration:1.05},0)
     .to(exitCopy,{xPercent:-direction*110,opacity:0,duration:.82,ease:'power2.in'},0)
     .to(liveCopy,{xPercent:0,opacity:1,duration:.85,ease:'power3.out'},.16);
   if(fromIndex===0)tl.to(person.current,{xPercent:-direction*80,opacity:0,duration:.85},0);
   else if(toIndex===0)tl.to(person.current,{xPercent:0,opacity:1,duration:.9,ease:'power3.out'},.14);
  });
 });
 const selectRelative=(delta:number)=>choose(active===null?(delta>0?0:formats.length-1):(active+delta+formats.length)%formats.length,delta>0?1:-1);
 const resetPointer=()=>{moveEnvironmentX.current?.(0);moveEnvironmentY.current?.(0);movePersonX.current?.(0);moveSpaceY.current?.(0)};
 return <section id="athlete" ref={root} className={`experience-hero ${current?'is-active':'is-overview'}`} aria-label="Форматы подготовки" aria-busy={transitioning} onTouchStart={event=>{const t=event.touches[0];if(!t)return;swipe.current={x:t.clientX,y:t.clientY,ignore:t.clientX<28||Boolean((event.target as HTMLElement).closest('.portal-deck'))};}} onTouchEnd={event=>{const start=swipe.current;swipe.current=null;const t=event.changedTouches[0];if(!start||start.ignore||!t)return;const dx=t.clientX-start.x,dy=t.clientY-start.y;if(Math.abs(dx)>=65&&Math.abs(dx)>Math.abs(dy)*1.4)selectRelative(dx<0?1:-1);}} onTouchCancel={()=>{swipe.current=null}} onPointerMove={event=>{
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
