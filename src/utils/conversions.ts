// Unit conversions
export const ML_PER_OZ = 29.5735;
export const KG_PER_LB = 0.453592;

export function ozToMl(oz: number): number {
  return Math.round(oz * ML_PER_OZ);
}

export function mlToOz(ml: number): number {
  return Math.round((ml / ML_PER_OZ) * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * KG_PER_LB * 10) / 10;
}

export function kgToLbs(kg: number): number {
  return Math.round((kg / KG_PER_LB) * 10) / 10;
}

export function formatWater(ml: number, units: 'imperial' | 'metric'): string {
  if (units === 'metric') return `${Math.round(ml)} mL`;
  return `${mlToOz(ml)} oz`;
}

export function formatWeight(value: number, unit: string): string {
  return `${value} ${unit}`;
}

// Time formatting — always local time
export function formatLocalTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatLocalDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function formatLocalDateTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function formatDuration(totalSeconds: number): { days: number; hours: number; minutes: number; seconds: number } {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return { days, hours, minutes, seconds };
}

export function formatDurationShort(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  const d = Math.floor(hours / 24);
  const h = Math.round(hours % 24);
  return h > 0 ? `${d}d ${h}h` : `${d}d`;
}

export function getElapsedHours(startTimeISO: string): number {
  const start = new Date(startTimeISO).getTime();
  const now = Date.now();
  return (now - start) / (1000 * 60 * 60);
}

export function getElapsedSeconds(startTimeISO: string): number {
  const start = new Date(startTimeISO).getTime();
  const now = Date.now();
  return Math.max(0, (now - start) / 1000);
}

/** Get start of day in local time */
export function startOfLocalDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Get end of day in local time */
export function endOfLocalDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Get date N days ago (local) */
export function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfLocalDay(d);
}

/** Create an ISO string that preserves local time intent */
export function localISOString(date: Date = new Date()): string {
  return date.toISOString();
}
