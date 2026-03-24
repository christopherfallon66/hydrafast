import Dexie, { type Table } from 'dexie';
import type { FastSession, WaterLog, ElectrolyteLog, HealthCheckIn, BodyMetric, JournalEntry, BenefitShown } from '../types';

export class HydraFastDB extends Dexie {
  fast_sessions!: Table<FastSession>;
  water_logs!: Table<WaterLog>;
  electrolyte_logs!: Table<ElectrolyteLog>;
  health_checkins!: Table<HealthCheckIn>;
  body_metrics!: Table<BodyMetric>;
  journal_entries!: Table<JournalEntry>;
  benefits_shown!: Table<BenefitShown>;

  constructor() {
    super('hydrafast');
    this.version(1).stores({
      fast_sessions: 'id, status, start_time',
      water_logs: 'id, fast_session_id, timestamp',
      electrolyte_logs: 'id, fast_session_id, timestamp, type',
      health_checkins: 'id, fast_session_id, timestamp, alert_level',
      body_metrics: 'id, timestamp, type',
      journal_entries: 'id, fast_session_id, timestamp',
      benefits_shown: 'id, benefit_id, shown_at',
    });
  }
}

export const db = new HydraFastDB();
