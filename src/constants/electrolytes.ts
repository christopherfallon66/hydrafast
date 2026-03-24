export const ELECTROLYTE_TARGETS = {
  sodium: { min: 1000, max: 2000, unit: 'mg', label: 'Sodium', sources: ['Himalayan pink salt', 'Sea salt', 'Sole water'] },
  potassium: { min: 1000, max: 3500, unit: 'mg', label: 'Potassium', sources: ['No-salt substitute (potassium chloride)', 'Cream of tartar'] },
  magnesium: { min: 300, max: 500, unit: 'mg', label: 'Magnesium', sources: ['Magnesium glycinate', 'Magnesium citrate', 'Epsom salt bath (topical)'] },
} as const;

export const ELECTROLYTE_QUICK_DOSES = {
  sodium: [
    { label: '¼ tsp salt', mg: 575, source: 'Pink salt' },
    { label: '½ tsp salt', mg: 1150, source: 'Pink salt' },
    { label: '1 tsp salt', mg: 2300, source: 'Pink salt' },
  ],
  potassium: [
    { label: '¼ tsp NoSalt', mg: 650, source: 'Potassium chloride' },
    { label: '½ tsp NoSalt', mg: 1300, source: 'Potassium chloride' },
    { label: '1 tsp cream of tartar', mg: 495, source: 'Cream of tartar' },
  ],
  magnesium: [
    { label: '1 capsule glycinate', mg: 100, source: 'Magnesium glycinate' },
    { label: '2 capsules glycinate', mg: 200, source: 'Magnesium glycinate' },
    { label: '1 tsp citrate powder', mg: 300, source: 'Magnesium citrate' },
  ],
} as const;

export const DEFICIENCY_SYMPTOMS = {
  sodium: 'Headache, fatigue, nausea, muscle cramps, dizziness. Sodium is lost through sweat and urine during fasting.',
  potassium: 'Muscle weakness, cramps, heart palpitations, fatigue. Critical for heart and muscle function.',
  magnesium: 'Muscle cramps and twitches, anxiety, insomnia, headaches. Involved in over 300 enzymatic processes.',
} as const;
