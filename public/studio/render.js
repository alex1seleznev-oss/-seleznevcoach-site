'use strict';
window.CarouselDesign=(()=>{
const themes=[['Наука','#f7f8f5','#183d32','#2d694f','#e6ede6'],['Тренировка','#183d32','#f7f8f5','#d6e6b3','#254c3d'],['Практика','#ffffff','#202b29','#2d694f','#edf1ee']];
let fontReady;
const ready=()=>fontReady??=(async()=>{await Promise.all([document.fonts.load('700 88px Manrope','Бег Running'),document.fonts.load('500 48px Manrope','Бег Running')])})();
function wrap(c,text,width){const out=[];for(const paragraph of String(text).split('\n')){let line='';for(const word of paragraph.split(/\s+/).filter(Boolean)){const next=line?line+' '+word:word;if(c.measureText(next).width<=width){line=next;continue}if(line)out.push(line);line='';for(const char of word){if(line&&c.measureText(line+char).width>width){out.push(line);line=''}line+=char}}if(line)out.push(line)}return out}
function text(c,value,x,y,width,size,weight,color,maxHeight,minSize=size){let rows;while(size>=minSize){c.font=`${weight} ${size}px Manrope, sans-serif`;rows=wrap(c,value,width);if(rows.length*size*1.23<=maxHeight)break;size-=2}if(size<minSize)throw Error('Текст не помещается. Сократи слайд или раздели его на два.');c.fillStyle=color;c.textBaseline='top';rows.forEach((row,i)=>c.fillText(row,x,y+i*size*1.23));return rows.length*size*1.23}
async function draw(canvas,p,n,all){await ready();const c=canvas.getContext('2d'),[,bg,ink,accent,tint]=themes[p.theme]||themes[0],content=(all[n]||'Твоя обложка').split('\n'),head=content.shift(),body=content.join('\n'),last=n===all.length-1&&n>0;const type=n===0?'cover':last?'closing':p.layouts?.[n]&&p.layouts[n]!=='auto'?p.layouts[n]:'idea';c.clearRect(0,0,1080,1350);c.fillStyle=bg;c.fillRect(0,0,1080,1350);c.textAlign='left';
text(c,'АКАДЕМИЯ БЕГА',72,64,760,25,700,ink,42);c.fillStyle=accent;c.fillRect(72,120,72,5);
const labels={cover:'АЛЕКСАНДР СЕЛЕЗНЁВ',idea:'КЛЮЧЕВАЯ МЫСЛЬ',mechanism:'КАК ЭТО РАБОТАЕТ',compare:'СРАВНИМ ПОДХОДЫ',checklist:'ПРОВЕРЬ НА ПРАКТИКЕ',closing:'СЛЕДУЮЩИЙ ШАГ'};
if(type==='cover'){
let y=340;if(p.photo){const image=new Image();image.src=p.photo;await image.decode();const scale=Math.min(936/image.width,600/image.height);const w=image.width*scale,h=image.height*scale;c.drawImage(image,72+(936-w)/2,165+(600-h)/2,w,h);y=820}
text(c,labels.cover,72,y-75,936,25,700,accent,42);text(c,head,72,y,936,p.photo?78:100,800,ink,p.photo?310:550,p.photo?64:76);
}else{
text(c,labels[type]||labels.idea,72,195,936,25,700,accent,42);
const h=text(c,head,72,260,936,type==='closing'?86:76,800,ink,310,64);let y=260+h+46;
const rows=body.split('\n').map(x=>x.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
if(type==='compare'&&rows.length===2){for(let i=0;i<2;i++){c.fillStyle=tint;c.fillRect(72,y,936,240);text(c,String(i+1).padStart(2,'0'),96,y+25,80,26,700,accent,40);text(c,rows[i],96,y+75,888,48,500,ink,148,44);y+=264}}
else if(type==='checklist'&&rows.length>1){if(rows.length>5)throw Error('Для чек-листа оставь не больше пяти пунктов.');for(let i=0;i<rows.length;i++){c.strokeStyle=accent;c.lineWidth=3;c.strokeRect(74,y+8,26,26);const h=text(c,rows[i],132,y,876,48,500,ink,150,44);y+=h+34}if(y>1160)throw Error('Чек-лист слишком длинный. Сократи пункты.')}
else if(type==='mechanism'&&rows.length>1){if(rows.length>3)throw Error('Для механизма оставь до трёх звеньев.');for(let i=0;i<rows.length;i++){text(c,String(i+1).padStart(2,'0'),72,y,90,32,700,accent,50);const h=text(c,rows[i],184,y,824,48,500,ink,180,44);y+=h+40}if(y>1160)throw Error('Механизм не помещается. Сократи пояснение.')}
else{text(c,body,72,y,936,52,500,ink,(last?990:1160)-y,46)}
if(type==='closing'&&y<900){c.fillStyle=tint;c.fillRect(72,1040,936,104);text(c,'ПОНИМАТЬ · ПРИМЕНЯТЬ · ПРОВЕРЯТЬ',100,1075,880,26,700,ink,40)}
}
c.fillStyle=accent;c.fillRect(72,1200,936,2);text(c,'@seleznevcoach',72,1243,720,26,600,ink,40);c.textAlign='right';c.font='600 26px Manrope, sans-serif';c.fillStyle=ink;c.fillText(`${String(n+1).padStart(2,'0')} / ${String(all.length||1).padStart(2,'0')}`,1008,1243);c.textAlign='left';return type;
}
return {themes,draw,ready};
})();
