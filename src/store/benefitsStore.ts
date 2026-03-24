import { create } from 'zustand';
import type { FastingBenefit } from '../types';
import { selectBenefit } from '../constants/benefits';
import { getRecentlyShownBenefitIds, markBenefitShown } from '../db/queries';

interface BenefitsState {
  currentBenefit: FastingBenefit | null;
  loading: boolean;
  loadBenefit: (elapsedHours: number, currentPhaseKey: string) => Promise<void>;
  dismissBenefit: () => void;
}

export const useBenefitsStore = create<BenefitsState>((set) => ({
  currentBenefit: null,
  loading: false,
  loadBenefit: async (elapsedHours: number, currentPhaseKey: string) => {
    set({ loading: true });
    const recentIds = await getRecentlyShownBenefitIds(7);
    const benefit = selectBenefit(elapsedHours, currentPhaseKey, recentIds);
    if (benefit) {
      await markBenefitShown(benefit.id);
    }
    set({ currentBenefit: benefit, loading: false });
  },
  dismissBenefit: () => set({ currentBenefit: null }),
}));
