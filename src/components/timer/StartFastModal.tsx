import { useState } from 'react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useFastStore } from '../../store/fastStore';
import { useSettingsStore } from '../../store/settingsStore';

interface StartFastModalProps {
  open: boolean;
  onClose: () => void;
}

export function StartFastModal({ open, onClose }: StartFastModalProps) {
  const { startFast } = useFastStore();
  const { default_fast_hours } = useSettingsStore();
  const [mode, setMode] = useState<'now' | 'custom'>('now');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [targetHours, setTargetHours] = useState<string>(default_fast_hours?.toString() || '');

  const handleStart = async () => {
    let startTime: string | undefined;

    if (mode === 'custom' && customDate && customTime) {
      // Build local Date from the date and time inputs
      const localDate = new Date(`${customDate}T${customTime}`);
      if (localDate > new Date()) {
        alert('Start time cannot be in the future.');
        return;
      }
      startTime = localDate.toISOString();
    }

    const hours = targetHours ? parseFloat(targetHours) : null;
    await startFast(startTime, hours);
    onClose();
  };

  // Pre-fill today's date and a reasonable past time for custom mode
  const handleModeChange = (newMode: 'now' | 'custom') => {
    setMode(newMode);
    if (newMode === 'custom' && !customDate) {
      const now = new Date();
      setCustomDate(now.toISOString().split('T')[0]);
      setCustomTime(now.toTimeString().slice(0, 5));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Start a Fast">
      <div className="space-y-5">
        {/* Start time mode */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">When did you start?</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleModeChange('now')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                mode === 'now' ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'
              }`}
            >
              Right now
            </button>
            <button
              onClick={() => handleModeChange('custom')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                mode === 'custom' ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'
              }`}
            >
              Earlier today / yesterday
            </button>
          </div>
        </div>

        {mode === 'custom' && (
          <div className="space-y-3 bg-glacier rounded-xl p-4">
            <p className="text-xs text-text-secondary">Set when you actually stopped eating so we can track your progress accurately.</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-text-secondary mb-1">Date</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-surface border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-text-secondary mb-1">Time</label>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full bg-surface border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
                />
              </div>
            </div>
          </div>
        )}

        {/* Target duration */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Goal duration (optional)</label>
          <div className="flex gap-2 flex-wrap">
            {[16, 24, 36, 48, 72].map(h => (
              <button
                key={h}
                onClick={() => setTargetHours(h.toString())}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  targetHours === h.toString() ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'
                }`}
              >
                {h}h
              </button>
            ))}
            <input
              type="number"
              placeholder="Custom"
              value={[16, 24, 36, 48, 72].includes(Number(targetHours)) ? '' : targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              className="w-20 bg-surface border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
              min="1"
            />
          </div>
        </div>

        <Button onClick={handleStart} className="w-full" size="lg">
          Start Fast
        </Button>
      </div>
    </Modal>
  );
}
