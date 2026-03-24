import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserSettings } from '../types';
import { ozToMl } from '../utils/conversions';

interface SettingsState extends UserSettings {
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  units: 'imperial',
  water_goal_ml: ozToMl(64), // ~1893 mL, roughly half of 128 lbs
  default_fast_hours: null,
  wake_hour: 7,
  sleep_hour: 22,
  emergency_contact_name: '',
  emergency_contact_phone: '',
  notifications_milestones: true,
  notifications_water: true,
  notifications_electrolytes: true,
  notifications_checkin: true,
  notifications_benefits: true,
  notifications_benefits_frequency_hours: 8,
  notifications_refeeding: true,
  disclaimer_acknowledged: false,
  contraindications_shown: false,
  contraindication_flags: [],
  name: '',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSettings: (partial) => set((state) => ({ ...state, ...partial })),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'hydrafast-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
