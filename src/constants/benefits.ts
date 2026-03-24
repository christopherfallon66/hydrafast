import type { FastingBenefit } from '../types';

export const FASTING_BENEFITS: FastingBenefit[] = [
  // === METABOLIC ===
  {
    id: 'met-insulin',
    category: 'metabolic',
    title: 'Improved Insulin Sensitivity',
    summary: 'Fasting gives your cells a break from constant insulin signaling. Over time, this can help your cells respond more effectively to insulin, improving blood sugar regulation.',
    detail: 'Research has shown that intermittent and extended fasting can significantly improve insulin sensitivity. When insulin levels remain low for sustained periods, insulin receptors on cells become more responsive. This has implications for metabolic health, type 2 diabetes prevention, and overall energy regulation.',
    evidence_level: 'established',
    relevant_phase: 'post_absorptive',
    min_hours: 4,
    sources: ['Halberg et al., 2005', 'Barnosky et al., 2014'],
  },
  {
    id: 'met-fat-adapt',
    category: 'metabolic',
    title: 'Fat-Adapted Metabolism',
    summary: 'Your body is shifting to using stored fat as its primary fuel source. This metabolic flexibility is a natural capability that fasting helps activate.',
    detail: 'As glycogen stores deplete, your body increasingly relies on fatty acid oxidation and ketone production for energy. This metabolic switch, sometimes called being "fat-adapted," means your body becomes more efficient at accessing and using stored energy. Studies suggest this metabolic flexibility may have benefits beyond fasting itself.',
    evidence_level: 'established',
    relevant_phase: 'ketosis_begins',
    min_hours: 24,
    sources: ['Anton et al., 2018', 'Mattson et al., 2017'],
  },
  {
    id: 'met-lipids',
    category: 'metabolic',
    title: 'Improved Lipid Profile',
    summary: 'Fasting periods have been associated with reductions in triglycerides and improvements in overall cholesterol markers in some studies.',
    detail: 'Multiple studies have observed that periodic fasting can lead to reduced triglyceride levels and improved ratios of HDL to LDL cholesterol. These changes are thought to result from the increased reliance on fat metabolism and reduced dietary intake of processed carbohydrates during fasting periods.',
    evidence_level: 'emerging',
    relevant_phase: 'ketosis_begins',
    min_hours: 24,
    sources: ['Varady et al., 2009', 'Tinsley & La Bounty, 2015'],
  },
  {
    id: 'met-flexibility',
    category: 'metabolic',
    title: 'Enhanced Metabolic Flexibility',
    summary: 'Your body is practicing switching between fuel sources — glucose and fat. This metabolic flexibility is a sign of metabolic health.',
    detail: 'Metabolic flexibility refers to your body\'s ability to efficiently switch between carbohydrate and fat oxidation depending on availability. Fasting trains this switching mechanism. People with high metabolic flexibility tend to have better energy levels, less reliance on frequent meals, and improved metabolic health markers overall.',
    evidence_level: 'established',
    relevant_phase: 'glycogen_depletion',
    min_hours: 12,
    sources: ['Galgani et al., 2008', 'Goodpaster & Sparks, 2017'],
  },

  // === CELLULAR ===
  {
    id: 'cell-autophagy',
    category: 'cellular',
    title: 'Autophagy Activation',
    summary: 'Your body may be ramping up its cellular recycling processes. Autophagy is the cleanup system that breaks down and recycles damaged cell components.',
    detail: 'Autophagy — literally "self-eating" — is a process where cells break down and recycle damaged proteins and organelles. Research, primarily from animal models and emerging human studies, suggests that extended fasting upregulates autophagy. The 2016 Nobel Prize in Physiology or Medicine was awarded for discoveries of mechanisms for autophagy. Timing in humans is less precisely understood than in animal models.',
    evidence_level: 'emerging',
    relevant_phase: 'autophagy',
    min_hours: 48,
    sources: ['Ohsumi, 2016 (Nobel)', 'Alirezaei et al., 2010'],
  },
  {
    id: 'cell-stem',
    category: 'cellular',
    title: 'Stem Cell Regeneration',
    summary: 'Extended fasting may trigger the production of new stem cells, particularly in the immune system, supporting renewal and repair.',
    detail: 'A landmark study from USC found that prolonged fasting (2-4 days) appeared to trigger stem cell-based regeneration of the immune system in mice. The fasting state shifted stem cells from a dormant state to active self-renewal. While human research is still limited, these findings suggest a powerful regenerative mechanism activated during extended fasts.',
    evidence_level: 'emerging',
    relevant_phase: 'autophagy',
    min_hours: 72,
    sources: ['Cheng et al., 2014', 'Longo & Mattson, 2014'],
  },
  {
    id: 'cell-oxidative',
    category: 'cellular',
    title: 'Reduced Oxidative Stress',
    summary: 'Fasting has been associated with lower levels of oxidative stress markers. Less oxidative damage means healthier cells.',
    detail: 'Oxidative stress occurs when there is an imbalance between free radical production and antioxidant defenses. Studies have shown that fasting periods can reduce markers of oxidative stress, including malondialdehyde and 8-hydroxy-2\'-deoxyguanosine. This reduction in oxidative burden may contribute to the anti-aging effects associated with caloric restriction and fasting.',
    evidence_level: 'established',
    relevant_phase: 'deep_ketosis',
    min_hours: 48,
    sources: ['Johnson et al., 2007', 'Wegman et al., 2015'],
  },
  {
    id: 'cell-dna',
    category: 'cellular',
    title: 'DNA Repair Upregulation',
    summary: 'During fasting, your body may increase its investment in DNA repair mechanisms, helping maintain genomic integrity.',
    detail: 'When the body is not focused on digesting and processing nutrients, cellular resources can be redirected toward maintenance and repair functions, including DNA repair pathways. Some research suggests that the SIRT1 and SIRT3 pathways, which are activated during fasting, play roles in DNA repair and genomic stability.',
    evidence_level: 'emerging',
    relevant_phase: 'deep_ketosis',
    min_hours: 48,
    sources: ['Haigis & Sinclair, 2010', 'Michan & Bhatt, 2011'],
  },

  // === COGNITIVE ===
  {
    id: 'cog-bdnf',
    category: 'cognitive',
    title: 'Increased BDNF Production',
    summary: 'Fasting may boost Brain-Derived Neurotrophic Factor (BDNF), a protein that supports the growth and maintenance of brain cells.',
    detail: 'BDNF is sometimes called "Miracle-Gro for the brain" because it supports the survival of existing neurons and encourages the growth of new neurons and synapses. Animal studies consistently show that fasting increases BDNF levels. Human studies are more limited but supportive. Higher BDNF levels are associated with improved memory, learning, and resistance to neurological diseases.',
    evidence_level: 'emerging',
    relevant_phase: 'ketosis_begins',
    min_hours: 24,
    sources: ['Mattson, 2005', 'Marosi & Bhatt, 2014'],
  },
  {
    id: 'cog-clarity',
    category: 'cognitive',
    title: 'Mental Clarity in Ketosis',
    summary: 'Many fasters report enhanced focus and mental clarity once their brain begins using ketones for fuel. Ketones are a very efficient energy source for the brain.',
    detail: 'While subjective, the experience of enhanced mental clarity during ketosis is widely reported by fasters. One explanation is that ketones (specifically beta-hydroxybutyrate) are a more efficient fuel for the brain than glucose, producing more ATP per unit of oxygen consumed. Additionally, ketones may have neuroprotective and anti-inflammatory effects on brain tissue.',
    evidence_level: 'preliminary',
    relevant_phase: 'deep_ketosis',
    min_hours: 48,
    sources: ['Murray et al., 2016', 'Veech, 2004'],
  },
  {
    id: 'cog-neuroprotect',
    category: 'cognitive',
    title: 'Potential Neuroprotective Effects',
    summary: 'Research suggests fasting may help protect brain cells against age-related damage and neurodegenerative processes.',
    detail: 'Animal studies have shown that intermittent fasting and caloric restriction can protect neurons against damage from models of Alzheimer\'s, Parkinson\'s, and stroke. The mechanisms may include reduced inflammation, increased autophagy of damaged proteins (like amyloid-beta), and enhanced mitochondrial function. Human clinical trials are underway but results are preliminary.',
    evidence_level: 'preliminary',
    relevant_phase: 'ketosis_begins',
    min_hours: 24,
    sources: ['Mattson et al., 2018', 'de Cabo & Mattson, 2019'],
  },
  {
    id: 'cog-fog',
    category: 'cognitive',
    title: 'Reduced Brain Fog',
    summary: 'After the initial adjustment period, many fasters find that the brain fog they experience daily from blood sugar fluctuations diminishes significantly.',
    detail: 'The post-meal energy dips and brain fog that many people experience can be linked to blood sugar spikes and crashes. During extended fasting, blood sugar levels stabilize and the brain receives a steady supply of ketones. Many fasters describe this as a clear, steady mental state — different from the peaks and valleys of a typical eating pattern.',
    evidence_level: 'preliminary',
    relevant_phase: 'deep_ketosis',
    min_hours: 48,
    sources: ['Patient-reported outcomes in fasting studies'],
  },

  // === IMMUNE ===
  {
    id: 'imm-inflammation',
    category: 'immune',
    title: 'Reduced Systemic Inflammation',
    summary: 'Fasting has been shown to reduce key inflammation markers like C-Reactive Protein (CRP) and IL-6 in several studies.',
    detail: 'Chronic low-grade inflammation is considered a driver of many modern diseases, from cardiovascular disease to type 2 diabetes to certain cancers. Multiple studies have demonstrated that fasting reduces circulating levels of inflammatory markers including CRP, IL-6, and TNF-alpha. The mechanism appears to involve reduced activation of the NLRP3 inflammasome and shifts in immune cell behavior.',
    evidence_level: 'established',
    relevant_phase: 'ketosis_begins',
    min_hours: 24,
    sources: ['Faris et al., 2012', 'Youm et al., 2015'],
  },
  {
    id: 'imm-reset',
    category: 'immune',
    title: 'Immune System Renewal',
    summary: 'Extended fasting may trigger the body to recycle old immune cells and generate new ones, potentially refreshing your immune system.',
    detail: 'Research from the University of Southern California suggests that extended fasting can trigger a regenerative switch that prompts stem cells to create brand new white blood cells. During fasting, the body appears to recycle old, damaged, or inefficient immune cells, and when feeding resumes, stem cells are activated to replenish the immune system with fresh cells.',
    evidence_level: 'emerging',
    relevant_phase: 'autophagy',
    min_hours: 72,
    sources: ['Cheng et al., 2014'],
  },
  {
    id: 'imm-gut',
    category: 'immune',
    title: 'Gut Lining Repair',
    summary: 'Giving your digestive system a complete rest allows energy to be redirected toward repair and maintenance of the gut lining.',
    detail: 'The gut lining replaces itself approximately every 3-5 days. During fasting, when the gut is not processing food, the body can focus resources on repairing and maintaining the intestinal barrier. Some research suggests this may help with conditions related to intestinal permeability ("leaky gut"), though human clinical evidence is still limited.',
    evidence_level: 'preliminary',
    relevant_phase: 'gluconeogenesis',
    min_hours: 18,
    sources: ['Catterson et al., 2018'],
  },
  {
    id: 'imm-joints',
    category: 'immune',
    title: 'Reduced Inflammatory Burden',
    summary: 'By lowering overall inflammation, fasting may provide relief from inflammatory conditions affecting joints and tissues.',
    detail: 'Studies on Ramadan fasting and therapeutic fasting have observed reductions in joint pain and inflammatory markers in patients with rheumatoid arthritis and other inflammatory conditions. While fasting is not a treatment for these conditions, the anti-inflammatory effects may provide temporary symptomatic relief.',
    evidence_level: 'emerging',
    relevant_phase: 'deep_ketosis',
    min_hours: 48,
    sources: ['Müller et al., 2001', 'Michalsen, 2010'],
  },

  // === PSYCHOLOGICAL ===
  {
    id: 'psy-hunger',
    category: 'psychological',
    title: 'Understanding Your Hunger Signals',
    summary: 'Fasting creates space to distinguish between physical hunger and habitual or emotional eating patterns. This awareness carries into your regular eating life.',
    detail: 'Many people eat on schedules, out of boredom, or in response to emotional triggers without experiencing true physical hunger. Extended fasting provides a clear experience of genuine hunger and teaches you what it actually feels like. This awareness can help you make more intentional food choices after the fast ends.',
    evidence_level: 'preliminary',
    relevant_phase: 'glycogen_depletion',
    min_hours: 12,
    sources: ['Patient-reported outcomes in fasting studies'],
  },
  {
    id: 'psy-emotional',
    category: 'psychological',
    title: 'Emotional vs. Physical Hunger Awareness',
    summary: 'During a fast, you may notice when you reach for food out of habit, boredom, or emotion. This awareness is a valuable tool for long-term health.',
    detail: 'Without the option of eating, fasters often become acutely aware of their eating triggers. Recognizing the difference between true physiological hunger and emotional or environmental cues to eat is a powerful insight. Many fasters report that this awareness persists well after the fast, helping them develop a more mindful relationship with food.',
    evidence_level: 'preliminary',
    relevant_phase: 'post_absorptive',
    min_hours: 8,
    sources: ['Mindful eating research; Kristeller & Wolever, 2011'],
  },
  {
    id: 'psy-discipline',
    category: 'psychological',
    title: 'Mental Resilience',
    summary: 'Successfully navigating the discomfort of a fast can build a sense of mental resilience and self-efficacy that extends to other areas of life.',
    detail: 'Voluntarily choosing temporary discomfort and following through builds what psychologists call self-efficacy — the belief in your ability to handle challenges. Many fasters describe a sense of accomplishment and mental toughness that carries into other difficult situations. This is not about punishing yourself, but about proving to yourself what you are capable of.',
    evidence_level: 'preliminary',
    relevant_phase: 'ketosis_begins',
    min_hours: 24,
    sources: ['Self-efficacy theory; Bandura, 1977'],
  },
  {
    id: 'psy-mindful',
    category: 'psychological',
    title: 'Mindful Eating Foundation',
    summary: 'The heightened food awareness during and after fasting creates a natural foundation for more mindful, intentional eating habits.',
    detail: 'After an extended fast, many people report a heightened appreciation for food — its taste, texture, and nourishing qualities. This reset can serve as a launching point for more mindful eating practices, where you eat with greater attention and intention. The refeeding period in particular offers a unique opportunity to notice how different foods make you feel.',
    evidence_level: 'preliminary',
    relevant_phase: null,
    min_hours: null,
    sources: ['Mindful eating research'],
  },
];

/**
 * Pure function: select the most relevant benefit to show.
 * Filters by phase/hours relevance, excludes recently shown, picks randomly from candidates.
 */
export function selectBenefit(
  elapsedHours: number,
  currentPhaseKey: string,
  recentlyShownIds: string[]
): FastingBenefit | null {
  const candidates = FASTING_BENEFITS.filter(b => {
    if (recentlyShownIds.includes(b.id)) return false;
    if (b.min_hours !== null && elapsedHours < b.min_hours) return false;
    return true;
  });

  if (candidates.length === 0) return null;

  // Prefer phase-relevant benefits
  const phaseRelevant = candidates.filter(b => b.relevant_phase === currentPhaseKey);
  const pool = phaseRelevant.length > 0 ? phaseRelevant : candidates;

  return pool[Math.floor(Math.random() * pool.length)];
}
