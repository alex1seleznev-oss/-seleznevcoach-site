'use client';
import { useId } from 'react';

/** Uses the editorial portrait selected in the conversation.
 * A separate luminance matte removes only its background; display scaling is uniform.
 * This is an AI-assisted outpainting, not an untouched original photograph.
 */
export function AthleteCutout({english=false}:{english?:boolean}){
 const id=useId().replaceAll(':','');
 return <svg className="athlete-cutout-svg" viewBox="0 0 1024 1536" width="1024" height="1536" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby={`${id}-title`}>
  <title id={`${id}-title`}>{english?'Alexander Seleznev — editorial portrait in running kit.':'Александр Селезнёв – редакционный портрет в российском беговом комбинезоне.'}</title>
  <defs>
   <filter id={`${id}-edge`}><feComponentTransfer><feFuncR type="linear" slope="1.12" intercept="-.06"/><feFuncG type="linear" slope="1.12" intercept="-.06"/><feFuncB type="linear" slope="1.12" intercept="-.06"/></feComponentTransfer><feMorphology operator="erode" radius=".45"/></filter>
   <mask id={`${id}-matte`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536" style={{maskType:'luminance'}}>
    <image href="/media/athlete-editorial-matte.webp" width="1024" height="1536" filter={`url(#${id}-edge)`}/>
   </mask>
   <filter id={`${id}-blend`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4"/></filter>
   <mask id={`${id}-chest`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536" style={{maskType:'luminance'}}>
    <rect x="345" y="624" width="395" height="330" rx="10" fill="white" filter={`url(#${id}-blend)`}/>
   </mask>
  </defs>
  <g mask={`url(#${id}-matte)`}>
   <image href="/_next/image?url=%2Fmedia%2Fathlete-editorial.webp&w=1080&q=75" width="1024" height="1536"/>
   <image href="/_next/image?url=%2Fmedia%2Fathlete-russia-restoration.webp&w=1080&q=75" width="1024" height="1536" mask={`url(#${id}-chest)`}/>
  </g>
 </svg>;
}
