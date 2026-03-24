import { create } from 'zustand';
import type { HealthCheckIn } from '../types';
import * as queries from '../db/queries';

interface CheckInState {
  recentCheckIns: HealthCheckIn[];
  sessionCheckIns: HealthCheckIn[];
  loading: boolean;
  loadRecent: () => Promise<void>;
  loadForSession: (sessionId: string) => Promise<void>;
  addCheckIn: (checkIn: Omit<HealthCheckIn, 'id' | 'timestamp'>) => Promise<HealthCheckIn>;
}

export const useCheckInStore = create<CheckInState>((set) => ({
  recentCheckIns: [],
  sessionCheckIns: [],
  loading: true,
  loadRecent: async () => {
    const recent = await queries.getRecentCheckIns(10);
    set({ recentCheckIns: recent, loading: false });
  },
  loadForSession: async (sessionId: string) => {
    const checkIns = await queries.getCheckInsForSession(sessionId);
    set({ sessionCheckIns: checkIns });
  },
  addCheckIn: async (checkIn) => {
    const saved = await queries.addCheckIn(checkIn);
    // Reload recent
    const recent = await queries.getRecentCheckIns(10);
    set({ recentCheckIns: recent });
    return saved;
  },
}));
