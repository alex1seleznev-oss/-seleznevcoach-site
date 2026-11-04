'use client';
import { useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

type Photo = {src:string; alt:string; caption:string; position?:string};
const education:Photo[] = [
 {src:'/media/learning-discussion.webp',alt:'Александр обсуждает материалы с участниками обучения',caption:'Обсуждать. Сопоставлять. Делать выводы.'},
 {src:'/media/learning-seminar.webp',alt:'Александр среди участников учебного занятия',caption:'Продолжать учиться.',position:'45% 45%'},
 {src:'/media/coach-education.webp',alt:'Александр у стенда Олимпийского комитета России с учебными материалами',caption:'Пополнять профессиональный опыт.',position:'50% 35%'},
];
const experience:Photo[] = [
 {src:'/media/race-autumn.webp',alt:'Александр бежит по осенней трассе в красной форме',caption:'На дистанции.',position:'50% 42%'},
 {src:'/media/race-podium.webp',alt:'Александр с участниками соревнований на пьедестале',caption:'После финиша.',position:'50% 35%'},
 {src:'/media/learning-portrait.webp',alt:'Александр на занятии вместе с другими участниками',caption:'Снова за знаниями.',position:'50% 45%'},
];
function PhotoGallery({photos,className=''}:{photos:Photo[];className?:string}){
 const dialog=useRef<HTMLDialogElement>(null);const [selected,setSelected]=useState<Photo|null>(null);
 return <><div className={`photo-gallery ${className}`}>{photos.map(p=><figure key={p.src}><button className="photo-open" type="button" onClick={()=>{setSelected(p);dialog.current?.showModal()}} aria-label={`Открыть фотографию: ${p.caption}`}><img src={p.src} alt={p.alt} style={{objectPosition:p.position}} loading="lazy"/><span className="photo-expand" aria-hidden="true"><ArrowUpRight size={18}/></span></button><figcaption>{p.caption}</figcaption></figure>)}</div><dialog className="photo-dialog" ref={dialog} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close()}}><button className="photo-close" type="button" autoFocus onClick={()=>dialog.current?.close()} aria-label="Закрыть фотографию"><X/></button>{selected&&<figure><img src={selected.src} alt={selected.alt}/><figcaption>{selected.caption}</figcaption></figure>}</dialog></>;
}
export function EducationPhotos(){return <div className="education-photos"><div className="photo-section-heading"><span className="mono">ПРОФЕССИЯ, В КОТОРОЙ УЧИШЬСЯ ПОСТОЯННО</span><h3>Знания тоже<br/>требуют практики.</h3><p>Разбирать вопросы с коллегами, сопоставлять подходы и возвращаться к практике – часть моей работы тренером.</p></div><PhotoGallery photos={education}/></div>}
export function TrainingPhoto(){return <div className="training-photo-story"><figure><img src="/media/training-warmup.webp" alt="Александр выполняет выпад во время разминки на открытом воздухе" width="1152" height="1536" loading="lazy"/><figcaption className="mono">ПОДГОТОВКА НАЧИНАЕТСЯ ДО ПЕРВОГО КИЛОМЕТРА</figcaption></figure><div><span className="mono">БЕГ И ОБЩАЯ ФИЗИЧЕСКАЯ ПОДГОТОВКА</span><h3>Работа над собой –<br/>не только километры.</h3><p>Разминка, силовые упражнения и восстановление – такие же части подготовки, как отрезки и длительный бег. Их место в плане зависит от вашей задачи и текущей нагрузки.</p><a className="text-link" href="#services">Обсудить формат подготовки <ArrowUpRight size={18}/></a></div></div>}
export function ExperiencePhotos(){return <section className="experience-photos section" aria-labelledby="experience-title"><div className="photo-section-heading"><span className="mono">ЛИЧНЫЙ АРХИВ</span><h2 id="experience-title" className="display">ОПЫТ СКЛАДЫВАЕТСЯ<br/>ИЗ МОМЕНТОВ.</h2><p>Тренировки, старты, обучение. Разные стороны одной работы.</p></div><PhotoGallery photos={experience} className="experience-gallery"/></section>}
