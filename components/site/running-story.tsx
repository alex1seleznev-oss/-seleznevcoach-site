'use client';
import { useRef, useState } from 'react';
import { ArrowDown, Play, Pause } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);
const scenes = [
  { word:'ЦЕЛЬ.', label:'01 / ЗНАТЬ, КУДА БЕЖИШЬ', image:'/media/race-autumn.webp', position:'50% 35%', caption:'У всех одна дорожка. У каждого – своя исходная точка.' },
  { word:'РИТМ.', label:'02 / ВЫСТРОИТЬ СВОЮ СИСТЕМУ', image:'/media/mountain-track.jpeg', position:'50% 62%', caption:'Подготовка, которая учитывает вашу жизнь.' },
  { word:'ПУТЬ.', label:'03 / ДВИГАТЬСЯ ПОСЛЕДОВАТЕЛЬНО', image:'/media/mountain-run.jpeg', position:'50% 48%', caption:'От отдельной тренировки – к осмысленной подготовке.' },
];

export function RunningStory(){
  const root=useRef<HTMLElement>(null),video=useRef<HTMLVideoElement>(null);
  const [playing,setPlaying]=useState(false);
  useGSAP(()=>{
    const el=root.current!;
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      const q=gsap.utils.selector(el);
      el.classList.add('story-animated');
      const panels=q('.running-scene'),pictures=q('.scene-image'),words=q('.scene-word'),fills=q('.story-progress-fill');
      const tl=gsap.timeline({scrollTrigger:{trigger:el,start:'top 76px',end:'bottom bottom',scrub:.6,invalidateOnRefresh:true},defaults:{ease:'none'}});
      // Each panel slides over the previous scene; its photograph counters the slide.
      gsap.set(panels.slice(1),{y:0,yPercent:102});
      gsap.set(pictures.slice(1),{yPercent:-24,scale:1.12});
      gsap.set(words.slice(1),{yPercent:60,autoAlpha:0});
      tl.to(pictures[0],{scale:1.07,yPercent:-2,duration:1.35},0)
        .to(words[0],{xPercent:-5,duration:1.35},0)
        .to(fills[0],{scaleX:1,duration:1},0);
      [1,2].forEach(i=>{
        const at=i===1?.7:1.9;
        tl.to(panels[i],{yPercent:0,duration:.75,ease:'power2.inOut'},at)
          .to(pictures[i],{yPercent:0,scale:1.02,duration:1.2},at)
          .to(words[i],{yPercent:0,autoAlpha:1,duration:.55,ease:'power2.out'},at+.3)
          .to(fills[i],{scaleX:1,duration:1.1},at+.2);
      });
      tl.to(pictures[2],{scale:1.06,duration:.35},3.05);
      return()=>el.classList.remove('story-animated');
    });
    const ob=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.current?.pause()});ob.observe(el);
    const onVisibility=()=>{if(document.hidden)video.current?.pause()};document.addEventListener('visibilitychange',onVisibility);
    return()=>{mm.revert();ob.disconnect();document.removeEventListener('visibilitychange',onVisibility)};
  },{scope:root});
  return <section className="running-story" id="running-story" ref={root} aria-label="Ваш путь в беге">
    <div className="story-stage">
      <div className="story-top"><span className="mono">ИЗ ТЕОРИИ НА ДОРОЖКУ</span><a href="#services">К форматам работы <ArrowDown size={16}/></a></div>
      <div className="story-scenes" aria-hidden="true">{scenes.map((s,i)=><div className={`running-scene scene-${i}`} key={s.word}>
        <div className="scene-image"><img src={s.image} style={{objectPosition:s.position}} alt="" loading="lazy" width="1024" height="1536"/></div>
        <div className="scene-shade"/><div className="scene-content"><span className="mono">{s.label}</span><div className="scene-word-wrap"><span className="scene-word display">{s.word}</span></div><p>{s.caption}</p></div>
      </div>)}</div>
      <h2 className="sr-only">Ваша цель. Ваш ритм. Ваш путь.</h2><p className="sr-only">У всех одна дорожка. У каждого – своя исходная точка. Подготовка, которая учитывает вашу жизнь.</p>
      <div className="story-video"><video ref={video} src="/media/running.mp4" poster="/media/running-poster.webp" preload="none" playsInline loop muted onPause={()=>setPlaying(false)} onPlay={()=>setPlaying(true)} onError={()=>setPlaying(false)}/><button type="button" aria-label={playing?'Приостановить видео':'Включить видео тренировки'} onClick={()=>{if(playing)video.current?.pause();else video.current?.play().catch(()=>setPlaying(false))}}>{playing?<Pause size={16}/>:<Play size={16}/>}<span>{playing?'Пауза':'На тренировке'}</span></button></div>
      <div className="story-bottom"><span className="mono">АЛЕКСАНДР СЕЛЕЗНЁВ / ОПЫТ В ДВИЖЕНИИ</span><div className="story-progress" aria-hidden="true">{scenes.map(s=><span key={s.word}><i className="story-progress-fill"/></span>)}</div></div>
    </div>
  </section>;
}
