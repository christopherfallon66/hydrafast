export interface RefeedingRecipe {
  name: string;
  tier: 'short' | 'medium' | 'extended';
  phase: string;
  prepTime: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tips: string;
}

export const REFEEDING_RECIPES: RefeedingRecipe[] = [
  // ===== SHORT FAST (< 48h) =====
  {
    name: 'Simple Bone Broth',
    tier: 'short',
    phase: 'Break Your Fast',
    prepTime: '5 min (using prepared broth)',
    description: 'Warm, nourishing bone broth is the gentlest way to reintroduce food to your digestive system.',
    ingredients: [
      '1 cup bone broth (store-bought or homemade)',
      'Pinch of sea salt',
      'Optional: splash of apple cider vinegar',
    ],
    instructions: [
      'Warm broth gently on stovetop (do not boil).',
      'Add a pinch of sea salt.',
      'Sip slowly over 15-20 minutes.',
    ],
    tips: 'Choose broth with no added sugar. Chicken or beef both work well. Sip slowly — your stomach is smaller after fasting.',
  },
  {
    name: 'Soft Scrambled Eggs',
    tier: 'short',
    phase: 'Break Your Fast',
    prepTime: '5 min',
    description: 'Protein-rich and easy to digest, scrambled eggs are a perfect fast-breaker.',
    ingredients: [
      '2 eggs',
      '1 tsp butter or ghee',
      'Pinch of salt',
    ],
    instructions: [
      'Whisk eggs gently in a bowl.',
      'Melt butter in a non-stick pan over low heat.',
      'Pour in eggs and stir slowly with a spatula.',
      'Remove from heat while still slightly wet — they will continue cooking.',
    ],
    tips: 'Keep the heat low for the softest, most digestible texture. Avoid adding cheese for your first post-fast meal.',
  },
  {
    name: 'Avocado Bowl',
    tier: 'short',
    phase: 'Break Your Fast',
    prepTime: '3 min',
    description: 'Rich in healthy fats and easy on the stomach. Avocado provides sustained energy without spiking blood sugar.',
    ingredients: [
      '1/2 ripe avocado',
      'Squeeze of lemon juice',
      'Pinch of sea salt',
      'Optional: drizzle of olive oil',
    ],
    instructions: [
      'Slice avocado in half and scoop into a bowl.',
      'Mash lightly with a fork.',
      'Season with salt and lemon juice.',
      'Eat slowly, one small bite at a time.',
    ],
    tips: 'Avocado is calorie-dense — a half is plenty for a first meal after a short fast.',
  },

  // ===== MEDIUM FAST (48-120h) =====
  {
    name: 'Clear Vegetable Broth',
    tier: 'medium',
    phase: 'Phase A: Broth Only',
    prepTime: '5 min',
    description: 'A light, mineral-rich broth for the crucial first hours of refeeding.',
    ingredients: [
      '1 cup vegetable or bone broth',
      '1/4 tsp sea salt',
      'Optional: tiny pinch of ginger',
    ],
    instructions: [
      'Warm broth to a comfortable sipping temperature.',
      'Add salt and optional ginger.',
      'Sip 2-3 oz every 30 minutes over 4-8 hours.',
      'Do not gulp — small, slow sips only.',
    ],
    tips: 'Keep electrolyte supplementation going during this phase. Your body is still adjusting.',
  },
  {
    name: 'Steamed Spinach with Eggs',
    tier: 'medium',
    phase: 'Phase B: Soft Foods',
    prepTime: '10 min',
    description: 'Gentle nutrition with easy-to-digest greens and protein.',
    ingredients: [
      '1 cup fresh spinach',
      '1 egg, poached or soft-boiled',
      '1 tsp olive oil',
      'Pinch of salt',
    ],
    instructions: [
      'Steam spinach for 2-3 minutes until wilted.',
      'Soft-boil or poach the egg (6 min for soft-boil).',
      'Plate spinach, top with egg.',
      'Drizzle olive oil and sprinkle salt.',
    ],
    tips: 'This should be about half your normal portion size. Chew each bite thoroughly.',
  },
  {
    name: 'Gentle Sweet Potato Mash',
    tier: 'medium',
    phase: 'Phase B: Soft Foods',
    prepTime: '15 min',
    description: 'Easy-to-digest carbohydrates that are gentle on the stomach.',
    ingredients: [
      '1/2 small sweet potato',
      '1 tsp butter or coconut oil',
      'Pinch of cinnamon',
      'Pinch of salt',
    ],
    instructions: [
      'Peel and dice sweet potato into small cubes.',
      'Steam or boil until very soft (10-12 min).',
      'Mash with a fork, add butter and seasonings.',
      'Eat only a few tablespoons to start.',
    ],
    tips: 'Start with just 2-3 tablespoons. Sweet potato is well-tolerated but still introduce slowly after a medium fast.',
  },
  {
    name: 'Baked Salmon with Steamed Zucchini',
    tier: 'medium',
    phase: 'Phase C: Gradual Return',
    prepTime: '20 min',
    description: 'Lean protein and gentle vegetables for your return to normal eating.',
    ingredients: [
      '3-4 oz salmon fillet',
      '1 small zucchini, sliced',
      '1 tsp olive oil',
      'Salt, pepper, lemon',
    ],
    instructions: [
      'Preheat oven to 375°F (190°C).',
      'Place salmon on foil, drizzle with olive oil and season.',
      'Bake 12-15 minutes.',
      'Steam zucchini slices for 3-4 minutes.',
      'Serve together with a squeeze of lemon.',
    ],
    tips: 'Keep portions moderate. You can have a normal-sized meal by Phase C, but eating slowly still helps.',
  },

  // ===== EXTENDED FAST (120h+) =====
  {
    name: 'Diluted Bone Broth with Electrolytes',
    tier: 'extended',
    phase: 'Phase A: Liquids Only',
    prepTime: '5 min',
    description: 'The safest way to begin refeeding after an extended fast. Go extremely slowly.',
    ingredients: [
      '1/2 cup bone broth',
      '1/2 cup warm water',
      '1/8 tsp sea salt',
      'Optional: 1/8 tsp potassium salt',
    ],
    instructions: [
      'Mix broth with warm water to dilute.',
      'Add electrolyte salts.',
      'Sip 1-2 oz every 30 minutes.',
      'Continue for the entire first 12 hours.',
      'Do not advance to solid food during this phase.',
    ],
    tips: 'This phase is critical. Your body needs time to restart insulin and digestive enzyme production. Rushing can cause refeeding syndrome.',
  },
  {
    name: 'Tiny Sauerkraut & Egg Plate',
    tier: 'extended',
    phase: 'Phase B: Minimal Soft Foods',
    prepTime: '8 min',
    description: 'Fermented food plus protein in very small amounts to restart digestion.',
    ingredients: [
      '1 tablespoon raw sauerkraut',
      '1 soft-boiled egg',
      'Pinch of salt',
    ],
    instructions: [
      'Soft-boil the egg (6 minutes in boiling water, then ice bath).',
      'Place sauerkraut on a small plate.',
      'Peel and halve the egg.',
      'Eat very slowly over 15-20 minutes.',
    ],
    tips: 'This is deliberately small. After an extended fast, even a tiny portion is significant. Wait 3-4 hours before the next small meal.',
  },
  {
    name: 'Steamed Fish with Greens',
    tier: 'extended',
    phase: 'Phase C: Lean Proteins & Fats',
    prepTime: '15 min',
    description: 'Light protein with easily digestible vegetables.',
    ingredients: [
      '3 oz white fish (cod, tilapia)',
      '1 cup steamed leafy greens (spinach or bok choy)',
      '1 tsp olive oil',
      'Salt, lemon',
    ],
    instructions: [
      'Steam fish for 8-10 minutes until it flakes easily.',
      'Steam greens until tender (2-3 min).',
      'Plate together with olive oil and lemon.',
      'Eat slowly in small bites.',
    ],
    tips: 'White fish is easier to digest than red meat. Save heavier proteins for Phase D.',
  },
  {
    name: 'Nourishing Recovery Bowl',
    tier: 'extended',
    phase: 'Phase D: Gradual Normalization',
    prepTime: '20 min',
    description: 'A balanced meal for the later stages of refeeding as your system normalizes.',
    ingredients: [
      '1/2 cup cooked quinoa or rice',
      '3 oz grilled chicken or baked fish',
      '1/2 cup roasted vegetables',
      '1/4 avocado',
      '1 tsp olive oil',
      'Salt, herbs',
    ],
    instructions: [
      'Cook quinoa or rice according to package directions.',
      'Grill chicken or bake fish.',
      'Roast vegetables (zucchini, bell pepper, broccoli) at 400°F for 15 min.',
      'Assemble in a bowl. Top with avocado and olive oil.',
    ],
    tips: 'By Phase D your digestion should be recovering well. Still eat mindfully — notice how different foods make you feel.',
  },
];

export function getRecipesForTier(tier: 'short' | 'medium' | 'extended'): RefeedingRecipe[] {
  return REFEEDING_RECIPES.filter(r => r.tier === tier);
}
