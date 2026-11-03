'use strict';
const $=id=>document.getElementById(id);
const sample=`Что записать после интервалов?

01. План на тренировку
Запиши дистанцию, число повторений и длительность отдыха. Потом можно будет сравнить замысел с тем, что получилось.

02. Каждый отрезок
Сохрани время по кругам. Средний темп скрывает разницу между ровной работой и слишком быстрым началом.

03. Паузы тоже важны
Отметь, как восстанавливался между отрезками: стоял, шёл или бежал трусцой.

04. Ощущения своими словами
На каком повторении стало трудно? Получилось ли сохранить расслабленные плечи и свободный шаг?

Что ты изменишь в следующий раз?
Оставь в дневнике одну короткую заметку, к которой вернёшься перед следующей такой работой.`;
const makePost=(source,caption='')=>({id:crypto.randomUUID(),source,caption,theme:0,photo:'',time:'',selected:false});
let posts=[makePost(sample,'Сразу после финиша детали помнятся лучше. Что ты обычно записываешь после интервальной тренировки?')],index=0,slide=0,db,storageError=false;
const themes=[['Стадион','#173f35','#f3f5d9','#d9e783'],['Бумага','#f4efd9','#183e35','#a56336'],['Ночь','#242b3a','#faf3e8','#b6c8fe']];
const current=()=>posts[index], title=p=>p.source.trim().split('\n')[0]||'Без названия';
function blocks(source){let [first,...rest]=source.trim().split('\n');return [first,...rest.join('\n').trim().split(/\n\s*\n/)].filter(x=>x.trim()).map(x=>x.trim())}
function note(s){$('status').textContent=s}
function persist(){if(!db)return;const tx=db.transaction('studio','readwrite');tx.objectStore('studio').put({posts,index},'work');tx.oncomplete=()=>{storageError=false;$('saved').textContent='Сохранено на устройстве'};tx.onerror=()=>{storageError=true;$('saved').textContent='Ошибка сохранения';note('Не удалось сохранить черновик. Скачай ZIP перед закрытием.')}}
function list(){const sel=$('posts');sel.replaceChildren(...posts.map((p,i)=>new Option((i+1)+'. '+title(p),i)));sel.value=index}
function refresh(){list();$('source').value=current().source;$('caption').value=current().caption;$('clearPhoto').hidden=!current().photo;$('photo').value='';[...$('themes').children].forEach((b,i)=>b.setAttribute('aria-pressed',i===current().theme));preview()}
let cachedSrc='',cachedImage;
async function photo(src){if(!src)return null;if(src===cachedSrc)return cachedImage;const img=new Image();img.src=src;await img.decode();cachedSrc=src;cachedImage=img;return img}
function lines(ctx,value,width){const result=[];let line='';for(const word of value.split(/\s+/)){let next=line?line+' '+word:word;if(ctx.measureText(next).width<=width){line=next;continue}if(line)result.push(line);line='';for(const ch of word){if(line&&ctx.measureText(line+ch).width>width){result.push(line);line=''}line+=ch}}if(line)result.push(line);return result}
async function draw(canvas,p,n){const all=blocks(p.source),context=canvas.getContext('2d'),[name,bg,fg,accent]=themes[p.theme];const img=await photo(p.photo);context.fillStyle=bg;context.fillRect(0,0,1080,1350);
if(img){const scale=Math.max(1080/img.width,1350/img.height);context.drawImage(img,(1080-img.width*scale)/2,(1350-img.height*scale)/2,img.width*scale,img.height*scale);context.fillStyle='rgba(9,24,20,.68)';context.fillRect(0,0,1080,1350)}
const ink=img?'#fffaf0':fg,detail=img?'#deecaa':accent;
context.strokeStyle=detail;context.globalAlpha=.46;context.lineWidth=3;
for(let i=0;i<7;i++){context.beginPath();context.ellipse(1060,220,280+i*33,430+i*33,.48,0,2*Math.PI);context.stroke()}context.globalAlpha=1;
context.fillStyle=ink;context.font='600 26px sans-serif';context.fillText('АКАДЕМИЯ БЕГА',78,100);
context.fillStyle=detail;context.font='600 28px monospace';context.fillText(n===0?'ЗАПИСКИ ТРЕНЕРА':('РАЗБОР  /  '+String(n).padStart(2,'0')),78,358);
const [head,...tail]=(all[n]||'Твоя обложка').split('\n');let heading,body,size=n===0?103:77,bodySize;
do{bodySize=Math.round(size*.64);context.font='bold '+size+'px sans-serif';heading=lines(context,head,915);context.font=bodySize+'px sans-serif';body=lines(context,tail.join(' '),915);if(heading.length*size*1.12+body.length*bodySize*1.36<=680)break;size-=2}while(size>=30);
if(size<30)throw Error('Слишком много текста на слайде '+(n+1)+'. Раздели его пустой строкой.');
let y=466;context.fillStyle=ink;context.font='bold '+size+'px sans-serif';for(const line of heading){context.fillText(line,76,y);y+=size*1.12}y+=28;context.font=bodySize+'px sans-serif';for(const line of body){context.fillText(line,78,y);y+=bodySize*1.36}
context.fillStyle=detail;context.fillRect(78,1195,924,3);context.fillStyle=ink;context.font='500 27px sans-serif';context.fillText('@seleznevcoach',78,1263);context.textAlign='right';context.fillText(String(n+1).padStart(2,'0')+' / '+String(all.length||1).padStart(2,'0'),1000,1263);context.textAlign='left'}
let renderId=0;
async function preview(){const token=++renderId,all=blocks(current().source);slide=Math.min(Math.max(0,slide),Math.max(0,all.length-1));$('page').textContent=(all.length?slide+1:0)+' / '+all.length;$('prev').disabled=!slide;$('next').disabled=slide>=all.length-1;const c=document.createElement('canvas');c.width=1080;c.height=1350;try{await draw(c,current(),slide);if(token===renderId)$('cover').getContext('2d').drawImage(c,0,0)}catch(e){note(e.message)}}
$('prev').onclick=()=>{slide--;preview()};$('next').onclick=()=>{slide++;preview()};
$('posts').onchange=e=>{index=Number(e.target.value);slide=0;refresh();persist()};
$('source').oninput=()=>{current().source=$('source').value;list();preview();persist()};
$('caption').oninput=()=>{current().caption=$('caption').value;persist()};
themes.forEach(([name,bg],i)=>{const b=document.createElement('button'),sw=document.createElement('i');sw.style.background=bg;b.append(sw,name);b.onclick=()=>{current().theme=i;refresh();persist()};$('themes').append(b)});
$('photo').onchange=async e=>{const p=current(),file=e.target.files[0];if(!file)return;const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await img.decode();const scale=Math.min(1,1600/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));c.getContext('2d').drawImage(img,0,0,c.width,c.height);p.photo=c.toDataURL('image/jpeg',.88);refresh();persist()}catch{note('Не удалось прочитать фото. Выбери JPEG, PNG или WebP.')}finally{URL.revokeObjectURL(url)}};
$('clearPhoto').onclick=()=>{current().photo='';refresh();persist()};
function tab(id){document.querySelectorAll('main section').forEach(s=>s.hidden=s.id!==id);document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));note('');if(id==='publish')queue()}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
function assignment(){const topics=$('topics').value.trim().split(/\n+/).filter(Boolean);if(!topics.length||topics.length>20)throw Error('Укажи от 1 до 20 тем.');return 'Напиши '+topics.length+' каруселей на русском для бегунов-любителей, по одной на каждую тему. Голос тренера Александра Селезнёва. На пост 6–10 слайдов. Первая строка — заголовок обложки. Затем пустая строка перед каждым слайдом: короткий заголовок, перенос строки и до 200 знаков пояснения. Последний слайд — практический вопрос. В конце с новой строки «Подпись:» и подпись к посту. Между постами отдельная строка из трёх дефисов. Обычный текст без Markdown и вводных слов. Объясняй механизм, давай конкретный пример, не выдумывай исследования, результаты клиентов или цитаты. Темы:\n'+topics.join('\n')}
$('prompt').onclick=async()=>{try{const s=assignment();try{await navigator.clipboard.writeText(s);note('Задание скопировано. Вставь его в ChatGPT.')}catch{window.prompt('Скопируй задание',s)}}catch(e){note(e.message)}};
function parseSeries(s){const chunks=s.trim().split(/^\s*---\s*$/m).map(x=>x.trim()).filter(Boolean);if(!chunks.length||chunks.length>20)throw Error('Нужна серия из 1–20 постов.');return chunks.map((x,i)=>{const match=/^Подпись:\s*/im.exec(x);const source=match?x.slice(0,match.index).trim():x;const p=makePost(source,match?x.slice(match.index+match[0].length).trim():'');validate(p,i);return p})}
function validate(p,i){const count=blocks(p.source).length;if(count<2||count>10)throw Error('Для поста «'+title(p).slice(0,60)+'» нужно 2–10 слайдов. Сейчас '+count+'.');if(p.caption.length>2200)throw Error('Сократи подпись до 2200 знаков.')}
$('importBatch').onclick=()=>{try{const added=parseSeries($('batch').value);index=posts.length;posts.push(...added);slide=0;persist();refresh();tab('editor');$('batch').value='';note('Добавлено постов: '+added.length)}catch(e){note(e.message)}};
function queue(){const box=$('queue');box.replaceChildren();posts.forEach((p,i)=>{const row=document.createElement('div');row.className='queueItem';const check=document.createElement('input');check.type='checkbox';check.id='p'+i;check.checked=p.selected;check.onchange=()=>{p.selected=check.checked;persist()};const label=document.createElement('label');label.htmlFor=check.id;label.textContent=title(p);const time=document.createElement('input');time.type='datetime-local';time.value=p.time;time.setAttribute('aria-label','Время выхода по Москве: '+title(p));time.onchange=()=>{p.time=time.value;persist()};row.append(check,label,time);box.append(row)})}
const enc=new TextEncoder(),crcTable=Array.from({length:256},(_,k)=>{for(let b=0;b<8;b++)k=(k>>>1)^((k&1)?0xedb88320:0);return k>>>0});
function checksum(bytes){let c=0xffffffff;for(const b of bytes)c=(c>>>8)^crcTable[(c^b)&255];return (c^0xffffffff)>>>0}
function zip(files){const parts=[],directory=[];let offset=0,dirSize=0;
for(const [name,data] of files){const filename=enc.encode(name),bytes=typeof data==='string'?enc.encode(data):data;const crc=checksum(bytes);
const local=new Uint8Array(30+filename.length),l=new DataView(local.buffer);l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x800,true);l.setUint32(14,crc,true);l.setUint32(18,bytes.length,true);l.setUint32(22,bytes.length,true);l.setUint16(26,filename.length,true);local.set(filename,30);
const central=new Uint8Array(46+filename.length),d=new DataView(central.buffer);d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint32(16,crc,true);d.setUint32(20,bytes.length,true);d.setUint32(24,bytes.length,true);d.setUint16(28,filename.length,true);d.setUint32(42,offset,true);central.set(filename,46);directory.push(central);dirSize+=central.length;parts.push(local,bytes);offset+=local.length+bytes.length}
const end=new Uint8Array(22),view=new DataView(end.buffer);view.setUint32(0,0x06054b50,true);view.setUint16(8,files.length,true);view.setUint16(10,files.length,true);view.setUint32(12,dirSize,true);view.setUint32(16,offset,true);return new Blob([...parts,...directory,end],{type:'application/zip'})}
async function exportPosts(batch){const selected=structuredClone(batch?posts.filter(p=>p.selected):[current()]);if(!selected.length||selected.length>20)throw Error('Выбери от 1 до 20 постов.');selected.forEach(validate);
if(batch&&selected.some(p=>!p.time||Date.parse(p.time+':00+03:00')<=Date.now()))throw Error('Для каждого выбранного поста укажи будущее время по Москве.');
const files=[],plan=[],canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
for(let j=0;j<selected.length;j++){const p=selected[j],count=blocks(p.source).length,images=[];note('Собираю пост '+(j+1)+' из '+selected.length+'…');for(let i=0;i<count;i++){await draw(canvas,p,i);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.88));if(!blob)throw Error('Не удалось подготовить изображение.');const name='media/'+p.id+'/'+String(i+1).padStart(2,'0')+'.jpg';files.push([name,new Uint8Array(await blob.arrayBuffer())]);images.push(name)}files.push(['texts/'+p.id+'.txt',p.source+'\n\nПодпись: '+p.caption]);plan.push({id:p.id,title:title(p),caption:p.caption,at:p.time?p.time+':00+03:00':null,images})}
if(batch){files.push(['schedule.json',JSON.stringify(plan,null,2)]);for(const name of ['publish.py','SETUP.txt']){const resp=await fetch(name);if(!resp.ok)throw Error('Не удалось скачать модуль публикации');files.push([name,await resp.text()])}}
const url=URL.createObjectURL(zip(files));const a=document.createElement('a');a.download=batch?'temp-series.zip':'temp-carousel.zip';a.href=url;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);note('ZIP готов. В архиве '+selected.length+' пост(ов).')}
for(const [id,batch] of [['download',false],['exportBatch',true]]){$(id).onclick=async()=>{const b=$(id);b.disabled=true;try{await exportPosts(batch)}catch(e){note(e.message)}finally{b.disabled=false}}}
function init(){refresh();const req=indexedDB.open('temp-carousel-editor',1);req.onupgradeneeded=()=>req.result.createObjectStore('studio');req.onsuccess=()=>{db=req.result;const get=db.transaction('studio').objectStore('studio').get('work');get.onsuccess=()=>{if(get.result?.posts?.length){posts=get.result.posts;index=Math.min(get.result.index,posts.length-1);refresh()}$('saved').textContent='На этом устройстве'}};req.onerror=()=>note('Черновики в этом браузере не сохраняются. Скачай ZIP.')}
init();
$('add').onclick=()=>{posts.push(makePost(''));index=posts.length-1;slide=0;persist();refresh();$('source').focus()};
$('remove').onclick=()=>{if(!confirm('Удалить этот черновик с устройства?'))return;posts.splice(index,1);if(!posts.length)posts.push(makePost(''));index=Math.min(index,posts.length-1);slide=0;persist();refresh()};
$('generate').onclick=async()=>{const b=$('generate');try{assignment();if(!$('owner').value)throw Error('Введи ключ доступа владельца или скопируй задание для ChatGPT.');b.disabled=true;const topics=$('topics').value.trim().split(/\n+/).filter(Boolean);let results=[];for(const topic of topics){note('Генерация '+(results.length+1)+' / '+topics.length);const res=await fetch('/api/studio/generate',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+$('owner').value},body:JSON.stringify({topic})});const data=await res.json();if(!res.ok)throw Error(data.error||'Ошибка генерации');results.push(data.text);$('batch').value=results.join('\n\n---\n\n')}note('Тексты готовы. Проверь их и добавь в редактор.')}catch(e){note(e.message)}finally{b.disabled=false}};
