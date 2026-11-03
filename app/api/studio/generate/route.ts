import { timingSafeEqual, createHash } from 'node:crypto';

export const maxDuration = 60;
export async function POST(request: Request) {
  const fail = (error: string, status: number) => Response.json({ error }, { status });
  const key = process.env.STUDIO_ACCESS_KEY;
  if (!key || !process.env.OPENAI_API_KEY) return fail('Генерация на сервере пока не подключена. Используй кнопку копирования задания.', 503);
  const digest = (s: string) => createHash('sha256').update(s).digest();
  if (!timingSafeEqual(digest(request.headers.get('authorization') || ''), digest('Bearer ' + key))) return fail('Неверный ключ доступа к студии.', 403);
  const input = await request.json().catch(() => null);
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
    return Response.json({ text }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return fail('Сервис генерации временно недоступен.', 502); }
}
