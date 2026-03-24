import { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { AlertBanner } from '../components/common/AlertBanner';

export function OnboardingScreen() {
  const { updateSettings, disclaimer_acknowledged, contraindications_shown } = useSettingsStore();
  const [step, setStep] = useState<'disclaimer' | 'screening' | 'done'>(
    !disclaimer_acknowledged ? 'disclaimer' : !contraindications_shown ? 'screening' : 'done'
  );
  const [flags, setFlags] = useState<string[]>([]);

  if (step === 'disclaimer') {
    return (
      <div className="min-h-screen bg-glacier flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💧</div>
            <h1 className="text-2xl font-bold text-deep-ocean mb-2">Welcome to HydraFast</h1>
            <p className="text-text-secondary">Your water fasting companion</p>
          </div>

          <Card className="mb-6">
            <h2 className="text-base font-bold text-deep-ocean mb-3">Important Disclaimer</h2>
            <div className="text-sm text-text-secondary space-y-3 leading-relaxed">
              <p>
                This app is for <strong>informational purposes only</strong> and does not constitute medical advice, diagnosis, or treatment.
              </p>
              <p>
                Water fasting carries real health risks, including electrolyte imbalances, dehydration, low blood sugar, and in extreme cases, refeeding syndrome. Extended fasts (beyond 72 hours) carry elevated risks and should be undertaken with physician supervision.
              </p>
              <p>
                <strong>Always consult a qualified healthcare provider</strong> before beginning any fasting protocol, especially if you have existing health conditions, take medications, or have a history of eating disorders.
              </p>
              <p>
                By using this app, you acknowledge that you understand these risks and take full responsibility for your health decisions.
              </p>
            </div>
          </Card>

          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              updateSettings({ disclaimer_acknowledged: true });
              setStep('screening');
            }}
          >
            I Understand — Continue
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'screening') {
    const QUESTIONS = [
      { key: 'pregnant', label: 'Are you pregnant or breastfeeding?' },
      { key: 'diabetes', label: 'Do you have Type 1 diabetes?' },
      { key: 'under18', label: 'Are you under 18 years of age?' },
      { key: 'eating_disorder', label: 'Do you have a history of eating disorders?' },
      { key: 'medication', label: 'Are you currently taking prescription medication?' },
      { key: 'heart', label: 'Do you have a diagnosed heart condition?' },
    ];

    const toggleFlag = (key: string) => {
      setFlags(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]);
    };

    const hasFlags = flags.length > 0;

    return (
      <div className="min-h-screen bg-glacier flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <h1 className="text-xl font-bold text-deep-ocean mb-2">Health Screening</h1>
          <p className="text-sm text-text-secondary mb-6">
            Please answer honestly. This helps us provide appropriate safety guidance.
          </p>

          <div className="space-y-2 mb-6">
            {QUESTIONS.map(q => (
              <button
                key={q.key}
                onClick={() => toggleFlag(q.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-colors ${
                  flags.includes(q.key)
                    ? 'bg-warning/10 border-2 border-warning text-amber-800'
                    : 'bg-surface border-2 border-transparent text-deep-ocean'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  flags.includes(q.key) ? 'border-warning bg-warning' : 'border-gray-300'
                }`}>
                  {flags.includes(q.key) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                </div>
                {q.label}
              </button>
            ))}
          </div>

          {hasFlags && (
            <AlertBanner level="orange">
              <p className="font-medium mb-1">Please consult a healthcare provider before fasting</p>
              <p className="text-xs">
                Based on your responses, fasting may carry additional risks for you. We strongly recommend discussing your plans with a doctor before proceeding. This app will continue to provide safety reminders.
              </p>
            </AlertBanner>
          )}

          <Button
            size="lg"
            className="w-full mt-4"
            onClick={() => {
              updateSettings({
                contraindications_shown: true,
                contraindication_flags: flags,
              });
              setStep('done');
            }}
          >
            {hasFlags ? 'I Understand — Continue Anyway' : 'Continue'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
