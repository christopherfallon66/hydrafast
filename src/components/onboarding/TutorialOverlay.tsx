import { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../common/Button';

const STEPS = [
  {
    title: 'Welcome to HydraFast',
    description: 'Your personal water fasting companion. Let\'s take a quick tour of the features.',
    icon: '💧',
  },
  {
    title: 'Start & Track Fasts',
    description: 'Tap "Start a Fast" on the Home screen. You can set a goal duration or pick a custom start time if you\'re already mid-fast.',
    icon: '⏱️',
  },
  {
    title: 'Stay Hydrated',
    description: 'The Track tab lets you log water intake with quick-add buttons. You\'ll see your daily progress fill up.',
    icon: '🥤',
  },
  {
    title: 'Monitor Electrolytes',
    description: 'For fasts over 24 hours, track sodium, potassium, and magnesium. Quick-dose buttons make it easy.',
    icon: '⚡',
  },
  {
    title: 'Health Check-Ins',
    description: 'Regular check-ins help catch warning signs early. The app will alert you if something needs attention.',
    icon: '❤️',
  },
  {
    title: 'Learn As You Go',
    description: 'The Learn tab shows your fasting timeline, science-backed benefits, and a refeeding guide with recipes for when you break your fast.',
    icon: '📚',
  },
  {
    title: 'Journal & Analytics',
    description: 'Keep a fasting journal, view your analytics, and export your data anytime from the More tab.',
    icon: '📊',
  },
  {
    title: 'You\'re All Set!',
    description: 'Remember: listen to your body, stay hydrated, and don\'t hesitate to break a fast if you feel unwell. This is a personal health tool — not a competition.',
    icon: '✨',
  },
];

export function TutorialOverlay() {
  const { updateSettings } = useSettingsStore();
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      updateSettings({ onboarding_tutorial_complete: true });
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    updateSettings({ onboarding_tutorial_complete: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-deep-ocean/60 backdrop-blur-sm">
      <div className="bg-surface rounded-t-3xl w-full max-w-lg p-6 pb-8 shadow-xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-still-water' : i < step ? 'w-1.5 bg-shallow-pool' : 'w-1.5 bg-morning-mist'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{current.icon}</div>
          <h2 className="text-lg font-bold text-deep-ocean mb-2">{current.title}</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{current.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!isLast && (
            <Button variant="ghost" onClick={handleSkip} className="flex-1">
              Skip Tour
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1">
            {isLast ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
