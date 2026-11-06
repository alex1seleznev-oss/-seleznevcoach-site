'use client';
import { useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

type Photo = {src:string; alt:string; caption:string; position?:string; crop?:{x:number;y:number;width:number;height:number}};
const education:Photo[] = [
 {src:'/media/learning-discussion.webp',alt:'Александр обсуждает материалы с участниками обучения',caption:'Обсуждать. Сопоставлять. Делать выводы.'},
 {src:'/media/learning-seminar.webp',alt:'Александр среди участников учебного занятия',caption:'Продолжать учиться.',position:'45% 45%'},
 {src:'/media/coach-education.webp',alt:'Александр у стенда Олимпийского комитета России с учебными материалами',caption:'Пополнять профессиональный опыт.',position:'50% 35%'},
];
const experience:Photo[] = [
 {src:'/media/archive/forest-run-source.webp',alt:'Александр бежит по лесной тропе на сборах',caption:'Работа на выносливость. Кисловодск.',crop:{x:65,y:462,width:625,height:470}},
 {src:'/media/race-podium.webp',alt:'Александр с участниками соревнований на пьедестале',caption:'После финиша.',position:'50% 35%'},
 {src:'/media/archive/track-start-source.webp',alt:'Александр набирает скорость на беговой дорожке',caption:'Первые шаги. Набрать свой ритм.',crop:{x:70,y:190,width:615,height:785}},
];
function PhotoImage({photo,expanded=false}:{photo:Photo;expanded?:boolean}){
 const c=photo.crop;
 if(!c)return <img src={photo.src} alt={photo.alt} style={{objectPosition:photo.position}} loading="lazy"/>;
 return <span className={`archive-photo-frame ${expanded?'is-expanded':''}`} style={{aspectRatio:`${c.width}/${c.height}`}}>
  <img src={photo.src} alt={photo.alt} loading="lazy" width={707} height={1536}
   style={{width:`${707/c.width*100}%`,left:`${-c.x/c.width*100}%`,top:`${-c.y/c.height*100}%`}}/>
 </span>;
}
function PhotoGallery({photos,className=''}:{photos:Photo[];className?:string}){
 const dialog=useRef<HTMLDialogElement>(null);const [selected,setSelected]=useState<Photo|null>(null);
 return <><div className={`photo-gallery ${className}`}>{photos.map(p=><figure key={p.src}><button className="photo-open" type="button" onClick={()=>{setSelected(p);dialog.current?.showModal()}} aria-label={`Открыть фотографию: ${p.caption}`}><PhotoImage photo={p}/><span className="photo-expand" aria-hidden="true"><ArrowUpRight size={18}/></span></button><figcaption>{p.caption}</figcaption></figure>)}</div><dialog className="photo-dialog" ref={dialog} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}><button className="photo-close" type="button" autoFocus onClick={()=>dialog.current?.close()} aria-label="Закрыть фотографию"><X/></button>{selected&&<figure><PhotoImage photo={selected} expanded/><figcaption>{selected.caption}</figcaption></figure>}</dialog></>;
}
export function EducationPhotos(){return <div className="education-photos"><div className="photo-section-heading"><span className="mono">ПРОФЕССИЯ, В КОТОРОЙ УЧИШЬСЯ ПОСТОЯННО</span><h3>Знания тоже<br/>требуют практики.</h3><p>Разбирать вопросы с коллегами, сопоставлять подходы и возвращаться к практике – часть моей работы тренером.</p></div><PhotoGallery photos={education}/></div>}
export function TrainingPhoto(){return <div className="training-photo-story"><figure><img src="/media/training-warmup.webp" alt="Александр выполняет выпад во время разминки на открытом воздухе" width="1152" height="1536" loading="lazy"/><figcaption className="mono">ПОДГОТОВКА НАЧИНАЕТСЯ ДО ПЕРВОГО КИЛОМЕТРА</figcaption></figure><div><span className="mono">БЕГ И ОБЩАЯ ФИЗИЧЕСКАЯ ПОДГОТОВКА</span><h3>Работа над собой –<br/>не только километры.</h3><p>Разминка, силовые упражнения и восстановление – такие же части подготовки, как отрезки и длительный бег. Их место в плане зависит от вашей задачи и текущей нагрузки.</p><a className="text-link" href="#services">Обсудить формат подготовки <ArrowUpRight size={18}/></a></div></div>}
export function ExperiencePhotos(){return <section className="experience-photos section" aria-labelledby="experience-title"><div className="photo-section-heading"><span className="mono">ЛИЧНЫЙ АРХИВ</span><h2 id="experience-title" className="display">ОПЫТ СКЛАДЫВАЕТСЯ<br/>ИЗ МОМЕНТОВ.</h2><p>Тренировки, старты, обучение. Разные стороны одной работы.</p></div><PhotoGallery photos={experience} className="experience-gallery"/></section>}

export function GroupPhoto(){return <section className="group-photo-story section" aria-labelledby="group-photo-title">
 <figure><img src="/media/archive/training-group.webp" width={1152} height={1536} loading="lazy" alt="Александр Селезнёв с участниками тренировочной группы на трибуне"/><figcaption>После тренировки. Наша группа.</figcaption></figure>
 <div><h2 id="group-photo-title">Общая тренировка.<br/>Личная задача.</h2><p>В группе вместе работаем над техникой, общей физической подготовкой и бегом. Нагрузка учитывает ваш уровень: темп, объём и восстановление согласуем под задачу занятия.</p><p>Очные тренировки в Москве. Время и площадку уточняем перед записью.</p><a className="text-link" href="/training/moscow">Как проходят занятия в Москве <ArrowUpRight size={18}/></a></div>
 </section>}
