import { useState, useEffect } from 'react';
import { useFastStore } from '../store/fastStore';
import { useWaterStore } from '../store/waterStore';
import { useCheckInStore } from '../store/checkinStore';
import { useBenefitsStore } from '../store/benefitsStore';
import { useSettingsStore } from '../store/settingsStore';
import { FastTimer } from '../components/timer/FastTimer';
import { StartFastModal } from '../components/timer/StartFastModal';
import { PhaseCatchUp } from '../components/timer/PhaseCatchUp';
import { WaterTracker } from '../components/water/WaterTracker';
import { BenefitCard } from '../components/benefits/BenefitCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { getElapsedHours, formatDurationShort, formatLocalDateTime } from '../utils/conversions';
import { getCurrentPhase } from '../constants/phases';
import { getAllFasts } from '../db/queries';
import { requestNotificationPermission, setupFastNotifications, notificationManager } from '../utils/notifications';

export function HomeScreen() {
  const { activeFast, loadActiveFast, endFast } = useFastStore();
  const { loadToday } = useWaterStore();
  const { loadRecent, recentCheckIns } = useCheckInStore();
  const { currentBenefit, loadBenefit } = useBenefitsStore();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [endReason, setEndReason] = useState('planned');
  const [stats, setStats] = useState({ streak: 0, longest: 0, totalHours: 0 });
  const [showCatchUp, setShowCatchUp] = useState(false);

  const settings = useSettingsStore();

  useEffect(() => {
    loadActiveFast();
    loadToday();
    loadRecent();
    loadStats();
  }, []);

  // Load benefit and set up notifications when fast is active
  useEffect(() => {
    if (activeFast) {
      const hours = getElapsedHours(activeFast.start_time);
      const phase = getCurrentPhase(hours);
      loadBenefit(hours, phase.key);

      // Show catch-up if user started more than 1 hour ago
      if (hours > 1) {
        setShowCatchUp(true);
      }

      // Request notification permission and set up scheduled notifications
      requestNotificationPermission().then(granted => {
        if (granted) {
          setupFastNotifications(activeFast.start_time, settings);
        }
      });
    } else {
      notificationManager.clearAll();
    }
  }, [activeFast?.id]);

  async function loadStats() {
    const fasts = await getAllFasts();
    const completed = fasts.filter(f => f.status === 'completed');
    let longest = 0;
    let totalHours = 0;
    for (const f of fasts) {
      if (f.end_time) {
        const h = (new Date(f.end_time).getTime() - new Date(f.start_time).getTime()) / 3600000;
        totalHours += h;
        if (h > longest) longest = h;
      }
    }
    setStats({ streak: completed.length, longest: Math.round(longest), totalHours: Math.round(totalHours) });
  }

  const handleEndFast = async () => {
    await endFast(endReason);
    setShowEndConfirm(false);
    loadStats();
  };

  const elapsedHours = activeFast ? getElapsedHours(activeFast.start_time) : 0;
  const latestCheckIn = recentCheckIns[0];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-deep-ocean to-still-water px-4 pt-6 pb-8 rounded-b-3xl mb-4">
        <h1 className="text-white text-xl font-bold text-center mb-6">HydraFast</h1>

        {activeFast ? (
          <>
            <FastTimer />
            <div className="mt-4 flex justify-center">
              <Button variant="danger" size="md" onClick={() => setShowEndConfirm(true)}>
                End Fast
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4 opacity-80">💧</div>
            <p className="text-white/80 text-sm mb-6">Ready to begin your fasting journey?</p>
            <Button
              onClick={() => setShowStartModal(true)}
              className="bg-white !text-still-water hover:bg-morning-mist"
              size="lg"
            >
              Start a Fast
            </Button>
          </div>
        )}
      </div>

      <div className="px-4 space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center py-3">
            <div className="text-lg font-bold text-deep-ocean">{stats.streak}</div>
            <div className="text-[10px] text-text-secondary">Completed</div>
          </Card>
          <Card className="text-center py-3">
            <div className="text-lg font-bold text-deep-ocean">{formatDurationShort(stats.longest)}</div>
            <div className="text-[10px] text-text-secondary">Longest</div>
          </Card>
          <Card className="text-center py-3">
            <div className="text-lg font-bold text-deep-ocean">{formatDurationShort(stats.totalHours)}</div>
            <div className="text-[10px] text-text-secondary">Total</div>
          </Card>
        </div>

        {/* Phase catch-up for mid-fast starts */}
        {activeFast && showCatchUp && (
          <PhaseCatchUp elapsedHours={elapsedHours} />
        )}

        {/* Water intake */}
        <WaterTracker />

        {/* Current benefit */}
        {currentBenefit && (
          <BenefitCard benefit={currentBenefit} compact />
        )}

        {/* Latest check-in summary */}
        {latestCheckIn && (
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-deep-ocean">Latest Check-In</h3>
              <span className="text-xs text-text-secondary">{formatLocalDateTime(latestCheckIn.timestamp)}</span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-text-secondary">
              <span>Energy {latestCheckIn.energy}/10</span>
              <span>Clarity {latestCheckIn.clarity}/10</span>
              <span>{latestCheckIn.mood === 'great' ? '😄' : latestCheckIn.mood === 'good' ? '🙂' : latestCheckIn.mood === 'neutral' ? '😐' : latestCheckIn.mood === 'low' ? '😔' : '😣'}</span>
            </div>
          </Card>
        )}
      </div>

      <StartFastModal open={showStartModal} onClose={() => setShowStartModal(false)} />

      {/* End fast confirmation */}
      <Modal open={showEndConfirm} onClose={() => setShowEndConfirm(false)} title="End Your Fast">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            You've been fasting for <strong>{formatDurationShort(elapsedHours)}</strong>. How would you like to end it?
          </p>
          <div className="space-y-2">
            {[
              { value: 'planned', label: 'Reached my goal / planned end' },
              { value: 'medical', label: 'Health concern' },
              { value: 'personal', label: 'Personal reason' },
              { value: 'other', label: 'Other' },
            ].map(r => (
              <button
                key={r.value}
                onClick={() => setEndReason(r.value)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                  endReason === r.value ? 'bg-still-water text-white' : 'bg-glacier text-deep-ocean'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowEndConfirm(false)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={handleEndFast} className="flex-1">End Fast</Button>
          </div>
          {elapsedHours > 48 && (
            <p className="text-xs text-warning text-center">
              After a {formatDurationShort(elapsedHours)} fast, please follow the refeeding guide carefully.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
