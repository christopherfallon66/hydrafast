import { v4 as uuidv4 } from 'uuid';
import { db } from './index';
import type { FastSession, WaterLog, ElectrolyteLog, HealthCheckIn, BodyMetric, JournalEntry } from '../types';

// Helpers
const localISO = () => new Date().toISOString();
const newId = () => uuidv4();

// === Fast Sessions ===
export async function createFastSession(startTime?: string, targetHours?: number | null): Promise<FastSession> {
  const session: FastSession = {
    id: newId(),
    start_time: startTime || localISO(),
    end_time: null,
    target_duration_hours: targetHours ?? null,
    status: 'active',
    break_reason: null,
    notes: null,
  };
  await db.fast_sessions.add(session);
  return session;
}

export async function endFastSession(id: string, reason?: string): Promise<void> {
  await db.fast_sessions.update(id, {
    end_time: localISO(),
    status: reason === 'planned' ? 'completed' : 'broken',
    break_reason: reason || 'planned',
  });
}

export async function getActiveFast(): Promise<FastSession | undefined> {
  return db.fast_sessions.where('status').equals('active').first();
}

export async function getAllFasts(): Promise<FastSession[]> {
  return db.fast_sessions.orderBy('start_time').reverse().toArray();
}

export async function getFastById(id: string): Promise<FastSession | undefined> {
  return db.fast_sessions.get(id);
}

export async function logPastFast(
  startTime: string,
  endTime: string,
  status: 'completed' | 'broken',
  notes?: string
): Promise<FastSession> {
  const session: FastSession = {
    id: newId(),
    start_time: startTime,
    end_time: endTime,
    target_duration_hours: null,
    status,
    break_reason: status === 'completed' ? 'planned' : 'personal',
    notes: notes || null,
  };
  await db.fast_sessions.add(session);
  return session;
}

// === Water Logs ===
export async function addWaterLog(amount_ml: number, fastSessionId?: string | null, note?: string): Promise<WaterLog> {
  const log: WaterLog = {
    id: newId(),
    fast_session_id: fastSessionId ?? null,
    timestamp: localISO(),
    amount_ml,
    note: note ?? null,
  };
  await db.water_logs.add(log);
  return log;
}

export async function getWaterLogsForDay(date: Date): Promise<WaterLog[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return db.water_logs
    .where('timestamp')
    .between(start.toISOString(), end.toISOString(), true, true)
    .toArray();
}

export async function getWaterLogsForRange(startDate: Date, endDate: Date): Promise<WaterLog[]> {
  return db.water_logs
    .where('timestamp')
    .between(startDate.toISOString(), endDate.toISOString(), true, true)
    .toArray();
}

// === Electrolyte Logs ===
export async function addElectrolyteLog(
  type: 'sodium' | 'potassium' | 'magnesium',
  amount_mg: number,
  fastSessionId?: string | null,
  source?: string
): Promise<ElectrolyteLog> {
  const log: ElectrolyteLog = {
    id: newId(),
    fast_session_id: fastSessionId ?? null,
    timestamp: localISO(),
    type,
    amount_mg,
    source: source ?? null,
  };
  await db.electrolyte_logs.add(log);
  return log;
}

export async function getElectrolyteLogsForDay(date: Date): Promise<ElectrolyteLog[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return db.electrolyte_logs
    .where('timestamp')
    .between(start.toISOString(), end.toISOString(), true, true)
    .toArray();
}

// === Health Check-Ins ===
export async function addCheckIn(checkIn: Omit<HealthCheckIn, 'id' | 'timestamp'>): Promise<HealthCheckIn> {
  const entry: HealthCheckIn = {
    ...checkIn,
    id: newId(),
    timestamp: localISO(),
  };
  await db.health_checkins.add(entry);
  return entry;
}

export async function getCheckInsForSession(sessionId: string): Promise<HealthCheckIn[]> {
  return db.health_checkins.where('fast_session_id').equals(sessionId).sortBy('timestamp');
}

export async function getRecentCheckIns(limit: number = 5): Promise<HealthCheckIn[]> {
  return db.health_checkins.orderBy('timestamp').reverse().limit(limit).toArray();
}

// === Body Metrics ===
export async function addBodyMetric(metric: Omit<BodyMetric, 'id' | 'timestamp'>): Promise<BodyMetric> {
  const entry: BodyMetric = {
    ...metric,
    id: newId(),
    timestamp: localISO(),
  };
  await db.body_metrics.add(entry);
  return entry;
}

export async function getMetricsByType(type: string, limit?: number): Promise<BodyMetric[]> {
  const query = db.body_metrics.where('type').equals(type).reverse();
  const results = limit ? await query.limit(limit).sortBy('timestamp') : await query.sortBy('timestamp');
  return results;
}

// === Journal Entries ===
export async function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'timestamp'>): Promise<JournalEntry> {
  const je: JournalEntry = {
    ...entry,
    id: newId(),
    timestamp: localISO(),
  };
  await db.journal_entries.add(je);
  return je;
}

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  return db.journal_entries.orderBy('timestamp').reverse().toArray();
}

// === Benefits Shown ===
export async function markBenefitShown(benefitId: string): Promise<void> {
  await db.benefits_shown.add({
    id: newId(),
    benefit_id: benefitId,
    shown_at: localISO(),
  });
}

export async function getRecentlyShownBenefitIds(withinDays: number = 7): Promise<string[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - withinDays);
  const records = await db.benefits_shown
    .where('shown_at')
    .above(cutoff.toISOString())
    .toArray();
  return records.map(r => r.benefit_id);
}
