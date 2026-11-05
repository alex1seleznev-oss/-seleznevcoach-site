import { createHash, timingSafeEqual } from 'node:crypto';
export const privateHeaders = { 'Cache-Control': 'private, no-store', Vary: 'Authorization' };
export function studioAccess(request: Request): Response | null {
  const key = process.env.STUDIO_ACCESS_KEY;
  if (!key) return Response.json({ error: 'Сначала настрой STUDIO_ACCESS_KEY в переменных сервера. Ручной ввод материала доступен без подключения.' }, { status: 503, headers: privateHeaders });
  const digest = (value: string) => createHash('sha256').update(value).digest();
  if (!timingSafeEqual(digest(request.headers.get('authorization') || ''), digest('Bearer ' + key))) return Response.json({ error: 'Неверный ключ доступа владельца.' }, { status: 403, headers: privateHeaders });
  return null;
}
