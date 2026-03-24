import type { FastingPhase } from '../types';

export const FASTING_PHASES: FastingPhase[] = [
  {
    key: 'fed',
    name: 'Fed State Ending',
    onset_hours: 0,
    end_hours: 4,
    description: 'Your body is processing your last meal. Insulin levels are elevated as nutrients are absorbed.',
    detail: 'During this initial period, your digestive system is actively breaking down and absorbing the nutrients from your last meal. Blood sugar and insulin levels are at their highest. Your body is primarily using glucose from the food you just ate for energy. This is a normal metabolic state that everyone cycles through after eating.',
  },
  {
    key: 'post_absorptive',
    name: 'Post-Absorptive',
    onset_hours: 4,
    end_hours: 12,
    description: 'Blood sugar is normalizing. Your body is beginning to shift its fuel sources.',
    detail: 'As digestion completes, insulin levels begin to fall and your body starts transitioning from using dietary glucose to tapping into stored energy. Blood sugar gradually normalizes. Growth hormone levels may begin to rise. This is a natural metabolic transition that your body handles smoothly — it happens every night while you sleep.',
  },
  {
    key: 'glycogen_depletion',
    name: 'Glycogen Depletion',
    onset_hours: 12,
    end_hours: 18,
    description: 'Liver glycogen stores are being tapped. Your body is drawing on its sugar reserves.',
    detail: 'Your liver stores about 100g of glycogen (stored glucose), and your body is now actively depleting these reserves. Insulin levels continue to drop, and glucagon rises. You may notice increased hunger during this phase as your body signals its preference for easy glucose. Many people find this the most challenging part of a fast — it typically gets easier after this.',
  },
  {
    key: 'gluconeogenesis',
    name: 'Gluconeogenesis',
    onset_hours: 18,
    end_hours: 24,
    description: 'Your body is producing glucose from non-carbohydrate sources to maintain blood sugar.',
    detail: 'With glycogen stores largely depleted, your liver begins producing glucose from amino acids, lactate, and glycerol through a process called gluconeogenesis. This ensures your brain and red blood cells — which require glucose — continue to be fueled. Meanwhile, your muscles increasingly rely on fatty acids for energy. This metabolic flexibility is a built-in survival mechanism.',
  },
  {
    key: 'ketosis_begins',
    name: 'Ketosis Begins',
    onset_hours: 24,
    end_hours: 48,
    description: 'Fat breakdown accelerates. Ketone production is ramping up as your body shifts to fat-based fuel.',
    detail: 'As glucose becomes less available, your liver begins converting fatty acids into ketone bodies — an alternative fuel that your brain can use efficiently. Blood ketone levels begin to rise measurably. Some people notice a shift in energy, mild euphoria, or reduced hunger as ketones become available. Electrolyte supplementation becomes important in this phase to prevent imbalances.',
  },
  {
    key: 'deep_ketosis',
    name: 'Deep Ketosis',
    onset_hours: 48,
    end_hours: 72,
    description: 'Ketones become a primary brain fuel. Many people report improved mental clarity.',
    detail: 'By this point, ketone levels are significantly elevated and your brain is deriving a substantial portion of its energy from ketones rather than glucose. Many fasters report a sense of mental clarity and sustained energy during this phase. Your body has become increasingly efficient at mobilizing and burning fat stores. Continued electrolyte supplementation is essential.',
  },
  {
    key: 'autophagy',
    name: 'Autophagy Window',
    onset_hours: 72,
    end_hours: 120,
    description: 'Cellular recycling and cleanup processes are believed to be upregulated.',
    detail: 'Research suggests that extended fasting upregulates autophagy — a cellular process where your body breaks down and recycles damaged or unnecessary cellular components. This is sometimes described as cellular housekeeping. While autophagy timing varies significantly between individuals and is difficult to measure directly in humans, animal studies and emerging human research suggest this window is significant. Medical supervision is increasingly recommended for fasts of this duration.',
  },
  {
    key: 'extended',
    name: 'Extended Fasting',
    onset_hours: 120,
    end_hours: null,
    description: 'Growth hormone elevated. Deep autophagy. Increased medical risk — physician supervision strongly recommended.',
    detail: 'Fasts beyond 5 days enter territory where the potential benefits are accompanied by increased medical risks. Growth hormone levels may be significantly elevated. Autophagy processes continue. However, electrolyte imbalances, muscle loss, and refeeding syndrome risk all increase substantially. Physician supervision is strongly recommended for fasts of this duration. The refeeding process after an extended fast requires careful attention.',
  },
];

export function getCurrentPhase(elapsedHours: number): FastingPhase {
  for (let i = FASTING_PHASES.length - 1; i >= 0; i--) {
    if (elapsedHours >= FASTING_PHASES[i].onset_hours) {
      return FASTING_PHASES[i];
    }
  }
  return FASTING_PHASES[0];
}

export function getCompletedPhases(elapsedHours: number): FastingPhase[] {
  return FASTING_PHASES.filter(p => p.end_hours !== null && elapsedHours >= p.end_hours);
}

export function getUpcomingPhases(elapsedHours: number): FastingPhase[] {
  return FASTING_PHASES.filter(p => elapsedHours < p.onset_hours);
}
