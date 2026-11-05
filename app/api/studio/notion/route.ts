import { studioAccess, privateHeaders } from '../../../../lib/studio/access';
export const runtime = 'nodejs';
export const maxDuration = 60;
const fail = (error: string, status: number) => Response.json({ error }, { status, headers: privateHeaders });
export function notionPageId(value: string): string | null {
  let path = value.trim();
  if (path.includes('://')) {
    try { const url = new URL(path); if (url.protocol !== 'https:' || !['notion.so','www.notion.so','app.notion.com','www.notion.com'].includes(url.hostname) && !url.hostname.endsWith('.notion.site')) return null; path = url.pathname; } catch { return null; }
  }
  const match = path.match(/(?:^|[\/-])([a-f\d]{32}|[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12})\/?$/i);
  return match ? match[1].replaceAll('-', '') : null;
}
type Rich = { plain_text?: string; href?: string; text?: { content?: string; link?: { url?: string } }; equation?: { expression?: string } };
function rich(values: Rich[] = []): string { return values.map(v => { const label=v.plain_text??v.text?.content??v.equation?.expression??'';const href=v.href??v.text?.link?.url;return href&&href!==label?`${label} (${href})`:label; }).join(''); }
export async function POST(request: Request) {
  const denied = studioAccess(request); if (denied) return denied;
  const token = process.env.NOTION_TOKEN;
  if (!token) return fail('Чтение Notion ещё не подключено: добавь NOTION_TOKEN на сервере. Пока можно вставить заметку вручную.', 503);
  const raw = await request.text(); if(raw.length>2000)return fail('Слишком длинный запрос.',400);
  let input;try{input=JSON.parse(raw)}catch{return fail('Нужна ссылка на страницу Notion.',400)}
  const id=typeof input.page==='string'?notionPageId(input.page):null;
  if(!id)return fail('Вставь ссылку на конкретную страницу или запись базы Notion.',400);
  let calls=0,truncated=false;const deadline=Date.now()+43000,parts:string[]=[];let length=0;
  async function get(path:string){
    if(calls>=45||Date.now()>deadline)throw Error('limit');
    if(calls++)await new Promise(resolve=>setTimeout(resolve,350));
    const res=await fetch('https://api.notion.com/v1/'+path,{headers:{Authorization:'Bearer '+token,'Notion-Version':'2026-03-11'},cache:'no-store',signal:AbortSignal.timeout(8000)});
    if(!res.ok)throw Error('notion:'+res.status);return res.json();
  }
  function append(text:string){if(!text)return;const remaining=39000-length;if(remaining<=0){truncated=true;return}parts.push(text.slice(0,remaining));length+=Math.min(text.length,remaining)+2;if(text.length>remaining)truncated=true}
  async function blocks(blockId:string,depth=0){
    if(depth>7||length>=39000){truncated=true;return}let cursor='';
    do {
      const page=await get(`blocks/${blockId}/children?page_size=100${cursor?'&start_cursor='+encodeURIComponent(cursor):''}`);
      for(const block of page.results||[]){
        const type=block.type,data=block[type]||{};
        if(type==='child_page'||type==='child_database'){append(`[Вложенная страница/база: ${data.title||''}; открой отдельно]`);truncated=true;continue}
        if(data.rich_text)append(rich(data.rich_text));
        else if(type==='table_row')append((data.cells||[]).map((x:Rich[])=>rich(x)).join(' | '));
        else if(type==='bookmark'||type==='link_preview'||type==='embed')append(data.url||'');
        else if(type==='equation')append(data.expression||'');
        else if(!['divider','table','column_list','column','synced_block','breadcrumb'].includes(type)){append(`[Блок ${type} не импортирован]`);truncated=true}
        if(block.has_children)await blocks(block.id,depth+1);
        if(length>=39000){truncated=true;return}
      }
      cursor=page.has_more?page.next_cursor:'';
    }while(cursor);
  }
  try {
    const page=await get('pages/'+id);if(page.archived||page.in_trash)return fail('Эта страница удалена или архивирована.',404);
    const properties=Object.values(page.properties||{}) as any[];
    const title=rich(properties.find(p=>p.type==='title')?.title)||'Заметка Notion';
    for(const [name,value] of Object.entries(page.properties||{}) as [string,any][]){if(value.type==='status'||value.type==='select')append(`${name}: ${value[value.type]?.name||''}`);if(value.type==='rich_text')append(`${name}: ${rich(value.rich_text)}`)}
    try{await blocks(id)}catch(e){if(!parts.length)throw e;truncated=true;append('[Импорт прерван. Сверь оставшийся текст в Notion.]')}
    if(!parts.length)return fail('На странице нет доступного текста. Открой конкретную заметку внутри базы.',422);
    return Response.json({title,url:page.url||'https://www.notion.so/'+id,text:parts.join('\n\n'),editedAt:page.last_edited_time,truncated},{headers:privateHeaders});
  }catch(e){const msg=String(e);if(msg.includes('notion:404')||msg.includes('notion:403'))return fail('У интеграции нет доступа к этой странице. Добавь её через Connections в Notion.',404);if(msg.includes('notion:401'))return fail('Notion отклонил токен. Проверь NOTION_TOKEN на сервере.',502);return fail('Notion временно недоступен или запрос превысил лимит. Попробуй ещё раз либо вставь текст вручную.',502)}
}
