import { timingSafeEqual, createHash } from 'node:crypto';

export const maxDuration = 60;
export async function POST(request: Request) {
  const responseHeaders = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  const fail = (error: string, status: number) => Response.json({ error }, { status, headers: responseHeaders });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return fail('Недопустимый источник запроса.', 403);
  const key = process.env.STUDIO_ACCESS_KEY;
  if (!key || !process.env.OPENAI_API_KEY) return fail('Генерация на сервере пока не подключена. Используй кнопку копирования задания.', 503);
  const digest = (s: string) => createHash('sha256').update(s).digest();
  if (!timingSafeEqual(digest(request.headers.get('authorization') || ''), digest('Bearer ' + key))) return fail('Неверный ключ доступа к студии.', 403);
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) return fail('Ожидается JSON.', 415);
  const maxBytes = 4096;
  const declaredSize = Number(request.headers.get('content-length'));
  if (declaredSize > maxBytes) return fail('Запрос слишком большой.', 413);
  const reader = request.body?.getReader();
  if (!reader) return fail('Отсутствует тело запроса.', 400);
  let input: { topic?: unknown } | null = null;
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); return fail('Запрос слишком большой.', 413); }
      chunks.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    input = JSON.parse(new TextDecoder().decode(body));
  } catch { return fail('Некорректный JSON.', 400); }
  finally { reader.releaseLock(); }
  if (typeof input?.topic !== 'string' || !input.topic.trim() || input.topic.length > 600) return fail('Укажи тему длиной до 600 знаков.', 400);
  try {
    const result = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.OPENAI_API_KEY },
      signal: AbortSignal.timeout(52000),
      body: JSON.stringify({
        model: process.env.STUDIO_OPENAI_MODEL || 'gpt-4.1-mini',
        max_completion_tokens: 1900,
        messages: [
          { role: 'system', content: 'Напиши одну карусель на русском для бегового блога тренера Александра Селезнёва. Первая строка — короткий заголовок обложки. Затем ещё 5–9 слайдов через пустую строку. Каждый слайд: заголовок и со следующей строки конкретное пояснение до 180 знаков. Последний слайд — вопрос или практическое действие. В конце отдельная строка «Подпись:» и текст для Instagram. Текст без Markdown, без вводных слов. Не придумывай источники, цитаты, личные результаты или истории клиентов.' },
          { role: 'user', content: input.topic }
        ]
      })
    });
    if (!result.ok) return fail('OpenAI не принял запрос. Проверь настройки и лимит API.', 502);
    const data = await result.json();
    const text = data.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) return fail('Модель вернула пустой текст.',502);
    return Response.json({ text }, { headers: responseHeaders });
  } catch { return fail('Сервис генерации временно недоступен.', 502); }
}
