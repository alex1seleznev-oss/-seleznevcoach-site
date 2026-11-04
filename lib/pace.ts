export type PaceMode = 'time' | 'pace' | 'distance';
export function parseDuration(value: string): number | null {
  const input = value.trim().replace(',', '.');
  if (!/^\d{1,4}:\d{2}(?::\d{2})?(?:\.\d{1,2})?$/.test(input)) return null;
  const p = input.split(':').map(Number);
  if (p.slice(1).some(n => n >= 60)) return null;
  const seconds = p.length === 3 ? p[0]*3600+p[1]*60+p[2] : p[0]*60+p[1];
  return seconds > 0 && Number.isFinite(seconds) ? seconds : null;
}
export function formatDuration(seconds: number, decimals = false): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '–';
  const tenths = Math.round(seconds * 10);
  const rounded = decimals ? Math.floor(tenths / 10) : Math.round(seconds);
  const h = Math.floor(rounded / 3600), m = Math.floor(rounded / 60) % 60, s = rounded % 60;
  const base = h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
  return decimals && tenths % 10 ? `${base}.${tenths % 10}` : base;
}
export function calculatePace(mode: PaceMode, distance: string, time: string, pace: string) {
  const d = Number(distance.replace(',', '.')), t = parseDuration(time), p = parseDuration(pace);
  if (mode !== 'distance' && (!(d > 0) || d > 1000 || !Number.isFinite(d))) return { error: 'Укажите дистанцию больше 0 и не больше 1000 км.' };
  if (mode !== 'pace' && t === null) return { error: 'Введите время в формате ММ:СС или ЧЧ:ММ:СС. Секунды – от 00 до 59.' };
  if (mode !== 'time' && p === null) return { error: 'Введите темп в формате ММ:СС, например 3:30.' };
  const secondsPerKm = mode === 'time' ? t! / d : p!;
  const km = mode === 'distance' ? t! / p! : d;
  const total = mode === 'pace' ? d * p! : t!;
  if (secondsPerKm < 30 || secondsPerKm > 3600 || km > 1000) return { error: 'Проверьте значения: поддерживаемый темп – от 0:30 до 60:00/км, дистанция – до 1000 км.' };
  return { km, total, secondsPerKm, speed: 3600 / secondsPerKm, split400: .4 * secondsPerKm, split1000: secondsPerKm, split5000: 5 * secondsPerKm };
}
