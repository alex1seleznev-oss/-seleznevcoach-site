'use client';
import {useState} from 'react';
import {MapPin, ArrowUpRight} from 'lucide-react';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';
import {trainingLocations} from '@/lib/training-locations';
export function TrainingMap(){
 const [enabled,setEnabled]=useState(false);
 return <div className="training-map"><Tabs defaultValue="bauman"><TabsList className="location-tabs" aria-label="Площадка для тренировки">{trainingLocations.map(p=><TabsTrigger value={p.id} key={p.id}>{p.id==='bauman'?'Манеж Баумана':'Стадион «Энергия»'}</TabsTrigger>)}</TabsList>{trainingLocations.map(p=><TabsContent key={p.id} value={p.id}><div className="location-description"><MapPin aria-hidden="true" size={22}/><div><h3>{p.title}</h3><address>{p.address}</address></div></div><div className="map-surface">{enabled?<iframe key={p.id} src={p.embed} title={`Карта: ${p.title}`} loading="lazy" referrerPolicy="no-referrer" allowFullScreen/>:<div className="map-permission"><MapPin size={32} aria-hidden="true"/><h4>Найдёмся на дорожке.</h4><p>Яндекс Карты загрузятся по вашему выбору. Сервис получит IP-адрес и сведения о браузере и может использовать файлы cookie.</p><button className="button" onClick={()=>setEnabled(true)}>Загрузить Яндекс Карту</button><a href="/cookies">Подробнее о внешних сервисах</a></div>}</div><div className="map-actions"><a href={p.map} target="_blank" rel="noreferrer">Открыть точку в Яндекс Картах <ArrowUpRight size={18}/></a>{enabled&&<button onClick={()=>setEnabled(false)}>Отключить карту</button>}</div></TabsContent>)}</Tabs></div>;
}
