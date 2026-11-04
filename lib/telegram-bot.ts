// Enable only after the real bot, operator documents and consent flow are tested.
export const telegramBotReady = false;
export function telegramBotLink(service = '') {
  const allowed = ['diagnostics', 'plan', 'personal', 'performance', 'group', 'offline', 'sport-conditioning', 'kids'];
  const source = allowed.includes(service) ? `site_${service}` : 'site';
  return `https://t.me/seleznevcoach_bot?start=${source}`;
}
