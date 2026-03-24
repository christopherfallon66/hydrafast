import { create } from 'zustand';
import type { BodyMetric } from '../types';
import * as queries from '../db/queries';

interface MetricsState {
  weightHistory: BodyMetric[];
  loading: boolean;
  loadWeightHistory: (limit?: number) => Promise<void>;
  addMetric: (metric: Omit<BodyMetric, 'id' | 'timestamp'>) => Promise<void>;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  weightHistory: [],
  loading: true,
  loadWeightHistory: async (limit?: number) => {
    const metrics = await queries.getMetricsByType('weight', limit);
    set({ weightHistory: metrics, loading: false });
  },
  addMetric: async (metric) => {
    await queries.addBodyMetric(metric);
    if (metric.type === 'weight') {
      const metrics = await queries.getMetricsByType('weight');
      set({ weightHistory: metrics });
    }
  },
}));
