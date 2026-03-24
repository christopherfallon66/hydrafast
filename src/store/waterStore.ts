import { create } from 'zustand';
import type { WaterLog } from '../types';
import * as queries from '../db/queries';

interface WaterState {
  todayLogs: WaterLog[];
  todayTotal: number;
  loading: boolean;
  loadToday: () => Promise<void>;
  addWater: (amount_ml: number, fastSessionId?: string | null, note?: string) => Promise<void>;
}

export const useWaterStore = create<WaterState>((set) => ({
  todayLogs: [],
  todayTotal: 0,
  loading: true,
  loadToday: async () => {
    const today = new Date();
    const logs = await queries.getWaterLogsForDay(today);
    const total = logs.reduce((sum, l) => sum + l.amount_ml, 0);
    set({ todayLogs: logs, todayTotal: total, loading: false });
  },
  addWater: async (amount_ml, fastSessionId, note) => {
    await queries.addWaterLog(amount_ml, fastSessionId, note);
    // Reload today's logs
    const today = new Date();
    const logs = await queries.getWaterLogsForDay(today);
    const total = logs.reduce((sum, l) => sum + l.amount_ml, 0);
    set({ todayLogs: logs, todayTotal: total });
  },
}));
