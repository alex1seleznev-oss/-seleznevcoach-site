'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function Motion() {
 const progress=useRef<HTMLDivElement>(null);
 useGSAP(()=>{
  const main=document.getElementById('main');if(!main)return;
  let active=true;
  const media=gsap.matchMedia();
  media.add({motion:'(prefers-reduced-motion: no-preference)',desktop:'(min-width: 801px)'},context=>{
   if(!context.conditions?.motion)return;
   const scoped=gsap.context(()=>{
    const q=gsap.utils.selector(main);
    q('.section h2, .coach-copy, .training-photo-story>div').forEach(el=>gsap.fromTo(el,{y:42,opacity:.15},{y:0,opacity:1,duration:.95,ease:'power3.out',clearProps:'transform,opacity',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    q('.service-card, .journal-card, .education-photos figure').forEach((el,i)=>gsap.fromTo(el,{y:55,opacity:.18,rotationX:4,transformPerspective:1100},{y:0,opacity:1,rotationX:0,duration:.9,delay:(i%2)*.1,ease:'power3.out',clearProps:'transform,opacity',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
    if(context.conditions?.desktop)q('.coach-image img, .training-photo-story figure img').forEach(el=>gsap.fromTo(el,{yPercent:-5,scale:1.13},{yPercent:5,scale:1.06,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:.65}}));
    gsap.fromTo(progress.current,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.15}});
   },main);
   return()=>scoped.revert();
  });
  document.fonts.ready.then(()=>{if(active)ScrollTrigger.refresh()});
  const onLoad=()=>ScrollTrigger.refresh();
  main.querySelectorAll('img').forEach(img=>img.addEventListener('load',onLoad));
  return()=>{active=false;media.revert();main.querySelectorAll('img').forEach(img=>img.removeEventListener('load',onLoad))};
 },[]);
 return <div className="reading-progress" ref={progress} aria-hidden="true"/>;
}
