import type { RefeedingTier, RefeedingProtocol } from '../types';

export function getRefeedingTier(fastDurationHours: number): RefeedingTier {
  if (fastDurationHours < 48) return 'short';
  if (fastDurationHours < 120) return 'medium';
  return 'extended';
}

export const REFEEDING_PROTOCOLS: RefeedingProtocol[] = [
  {
    tier: 'short',
    label: 'Short Fast (under 48 hours)',
    duration_range: '< 48 hours',
    risk_level: 'Low risk',
    phases: [
      {
        name: 'Break Your Fast',
        time_range: 'First meal',
        foods: [
          'Bone broth (warm, sipped slowly)',
          'Soft scrambled eggs',
          'Avocado (half)',
          'Small portion of cooked vegetables',
          'Plain yogurt (small serving)',
        ],
        notes: 'Start with a small, easily digestible meal. Eat slowly and stop when you feel satisfied — your stomach has contracted during the fast.',
      },
    ],
    warnings: [
      'Avoid large meals for your first eating session',
      'Skip heavy carbohydrates, processed foods, dairy-heavy meals, and alcohol for the first meal',
      'Eat slowly — your digestive system needs time to restart',
    ],
  },
  {
    tier: 'medium',
    label: 'Medium Fast (48–120 hours)',
    duration_range: '48–120 hours',
    risk_level: 'Moderate risk',
    phases: [
      {
        name: 'Phase A: Broth Only',
        time_range: 'First 4–8 hours',
        foods: [
          'Bone broth — small sips every 30–60 minutes',
          'Clear vegetable broth',
          'Warm water with a pinch of salt',
        ],
        notes: 'Your digestive system has been resting. Reintroduce food very gradually. Broth provides gentle nutrients and electrolytes.',
      },
      {
        name: 'Phase B: Soft Foods',
        time_range: '8–24 hours after breaking',
        foods: [
          'Steamed vegetables (zucchini, spinach, carrots)',
          'Soft scrambled or poached eggs',
          'Small portions of avocado',
          'Well-cooked sweet potato (small amount)',
        ],
        notes: 'Keep portions small — about half your normal meal size. Chew thoroughly. If you experience bloating or discomfort, slow down.',
      },
      {
        name: 'Phase C: Gradual Return',
        time_range: '24–48 hours after breaking',
        foods: [
          'Lean proteins (chicken, fish)',
          'Larger servings of cooked vegetables',
          'Healthy fats (olive oil, nuts in moderation)',
          'Small amounts of complex carbohydrates',
        ],
        notes: 'Gradually increase portion sizes. Continue monitoring how you feel. Maintain electrolyte supplementation.',
      },
    ],
    warnings: [
      'Continue electrolyte supplementation throughout refeeding',
      'If you experience significant bloating, nausea, or GI distress, reduce portion sizes and slow down',
      'Avoid alcohol, processed foods, and high-sugar items for at least 48 hours',
    ],
  },
  {
    tier: 'extended',
    label: 'Extended Fast (120+ hours)',
    duration_range: '120+ hours (5+ days)',
    risk_level: 'Elevated risk — physician supervision strongly recommended',
    phases: [
      {
        name: 'Phase A: Liquids Only',
        time_range: 'First 12 hours',
        foods: [
          'Bone broth — very small sips every 30 minutes',
          'Diluted vegetable juice (50% water)',
          'Warm water with electrolytes',
        ],
        notes: 'This is the highest-risk refeeding period. Go extremely slowly. Your body needs time to restart insulin production and digestive enzyme secretion.',
      },
      {
        name: 'Phase B: Minimal Soft Foods',
        time_range: '12–36 hours after breaking',
        foods: [
          'Small servings of soft, low-carb foods every 3–4 hours',
          'Steamed leafy greens',
          'Soft-cooked eggs (one at a time)',
          'Small amounts of avocado',
          'Fermented foods in tiny amounts (sauerkraut, kimchi)',
        ],
        notes: 'Keep carbohydrate intake very low initially. Rapid carbohydrate reintroduction is the primary trigger for refeeding syndrome.',
      },
      {
        name: 'Phase C: Lean Proteins & Fats',
        time_range: '36–72 hours after breaking',
        foods: [
          'Lean proteins (baked fish, chicken breast)',
          'Healthy fats (olive oil, coconut oil)',
          'Cooked vegetables (increasing variety)',
          'Small amounts of nuts and seeds',
        ],
        notes: 'Portions can gradually increase but should remain smaller than your pre-fast normal. Monitor for bloating, edema (swelling), and GI distress.',
      },
      {
        name: 'Phase D: Gradual Normalization',
        time_range: '72–120 hours after breaking',
        foods: [
          'Gradually reintroduce complex carbohydrates',
          'Full range of vegetables and fruits',
          'Normal protein portions',
          'Dairy (if tolerated) in small amounts',
        ],
        notes: 'By this point, your digestive system should be largely back to normal. Continue eating mindfully and monitoring how foods make you feel.',
      },
    ],
    warnings: [
      'Physician supervision is strongly recommended for refeeding after fasts over 7 days',
      'Continue electrolyte supplementation — especially phosphorus, which can drop dangerously during refeeding',
      'Monitor for edema (swelling in hands, feet, face) — this can indicate fluid shifts',
      'Watch for rapid weight gain (more than 2 lbs/1 kg per day) during refeeding',
      'If you experience chest pain, severe swelling, or difficulty breathing during refeeding, seek emergency medical care immediately',
    ],
  },
];

export function getRefeedingProtocol(fastDurationHours: number): RefeedingProtocol {
  const tier = getRefeedingTier(fastDurationHours);
  return REFEEDING_PROTOCOLS.find(p => p.tier === tier)!;
}
