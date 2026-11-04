export const translatedPaths=['/','/contacts','/privacy','/terms','/cookies','/journal','/training/online','/training/moscow','/services/diagnostics','/services/plan','/services/personal','/services/performance','/services/sport-conditioning','/services/kids','/journal/vo2max-and-5000m','/journal/elite-running-training','/journal/400-vs-1000-intervals'];
export function languageLinks(path:string){
 const ru=path.replace(/^\/en(?=\/|$)/,'').replace(/\/$/,'')||'/';
 const base=translatedPaths.includes(ru)?ru:'/';
 return {ru:base,en:base==='/'?'/en':`/en${base}`};
}
