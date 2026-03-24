import { create } from 'zustand';
import type { FastSession } from '../types';
import * as queries from '../db/queries';

interface FastState {
  activeFast: FastSession | null;
  loading: boolean;
  loadActiveFast: () => Promise<void>;
  startFast: (startTime?: string, targetHours?: number | null) => Promise<void>;
  endFast: (reason?: string) => Promise<void>;
}

export const useFastStore = create<FastState>((set) => ({
  activeFast: null,
  loading: true,
  loadActiveFast: async () => {
    set({ loading: true });
    const fast = await queries.getActiveFast();
    set({ activeFast: fast || null, loading: false });
  },
  startFast: async (startTime?: string, targetHours?: number | null) => {
    const session = await queries.createFastSession(startTime, targetHours);
    set({ activeFast: session });
  },
  endFast: async (reason?: string) => {
    const state = useFastStore.getState();
    if (state.activeFast) {
      await queries.endFastSession(state.activeFast.id, reason);
      set({ activeFast: null });
    }
  },
}));
