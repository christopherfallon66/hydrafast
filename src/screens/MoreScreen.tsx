import { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useSettingsStore } from '../store/settingsStore';
import { getAllFasts, logPastFast } from '../db/queries';
import { Modal } from '../components/common/Modal';
import { formatDurationShort, formatLocalDateTime } from '../utils/conversions';
import type { FastSession } from '../types';

export function MoreScreen() {
  const [view, setView] = useState<'menu' | 'history' | 'settings'>('menu');

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-lg font-bold text-deep-ocean mb-4">More</h1>

      {view === 'menu' && <MenuView onNavigate={setView} />}
      {view === 'history' && <HistoryView onBack={() => setView('menu')} />}
      {view === 'settings' && <SettingsView onBack={() => setView('menu')} />}
    </div>
  );
}

function MenuView({ onNavigate }: { onNavigate: (v: 'history' | 'settings') => void }) {
  return (
    <div className="space-y-2">
      <Card onClick={() => onNavigate('history')} className="cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <div>
            <h3 className="text-sm font-bold text-deep-ocean">History & Analytics</h3>
            <p className="text-xs text-text-secondary">View past fasts and stats</p>
          </div>
        </div>
      </Card>
      <Card onClick={() => onNavigate('settings')} className="cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          <div>
            <h3 className="text-sm font-bold text-deep-ocean">Settings</h3>
            <p className="text-xs text-text-secondary">Units, notifications, profile</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function HistoryView({ onBack }: { onBack: () => void }) {
  const [fasts, setFasts] = useState<FastSession[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);

  const loadFasts = () => getAllFasts().then(setFasts);

  useEffect(() => { loadFasts(); }, []);

  const completed = fasts.filter(f => f.status !== 'active');
  const totalHours = completed.reduce((sum, f) => {
    if (!f.end_time) return sum;
    return sum + (new Date(f.end_time).getTime() - new Date(f.start_time).getTime()) / 3600000;
  }, 0);
  const avgHours = completed.length > 0 ? totalHours / completed.length : 0;
  const completionRate = fasts.length > 0
    ? Math.round((fasts.filter(f => f.status === 'completed').length / fasts.filter(f => f.status !== 'active').length) * 100) || 0
    : 0;

  return (
    <div>
      <button onClick={onBack} className="text-still-water text-sm mb-4 flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back
      </button>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="text-center py-3">
          <div className="text-lg font-bold text-deep-ocean">{formatDurationShort(totalHours)}</div>
          <div className="text-[10px] text-text-secondary">Total Fasted</div>
        </Card>
        <Card className="text-center py-3">
          <div className="text-lg font-bold text-deep-ocean">{formatDurationShort(avgHours)}</div>
          <div className="text-[10px] text-text-secondary">Average</div>
        </Card>
        <Card className="text-center py-3">
          <div className="text-lg font-bold text-deep-ocean">{completionRate}%</div>
          <div className="text-[10px] text-text-secondary">Completed</div>
        </Card>
      </div>

      {/* Log Past Fast button */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-deep-ocean">Past Fasts</h3>
        <Button variant="secondary" size="sm" onClick={() => setShowLogModal(true)}>
          + Log Past Fast
        </Button>
      </div>

      {completed.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-8">No completed fasts yet. Tap "Log Past Fast" to add previous fasts.</p>
      ) : (
        <div className="space-y-2">
          {completed.map(f => {
            const hours = f.end_time
              ? (new Date(f.end_time).getTime() - new Date(f.start_time).getTime()) / 3600000
              : 0;
            return (
              <Card key={f.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-deep-ocean">{formatDurationShort(hours)}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      f.status === 'completed' ? 'bg-seafoam text-success' : 'bg-morning-mist text-text-secondary'
                    }`}>
                      {f.status === 'completed' ? 'Completed' : 'Ended early'}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">{formatLocalDateTime(f.start_time)}</span>
                </div>
                {f.break_reason && f.break_reason !== 'planned' && (
                  <p className="text-xs text-text-secondary mt-1">Reason: {f.break_reason}</p>
                )}
                {f.notes && (
                  <p className="text-xs text-text-secondary mt-1 italic">{f.notes}</p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <LogPastFastModal
        open={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSaved={loadFasts}
      />
    </div>
  );
}

function LogPastFastModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [durationMode, setDurationMode] = useState<'duration' | 'endtime'>('duration');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState<'completed' | 'broken'>('completed');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!startDate || !startTime) return;

    const start = new Date(`${startDate}T${startTime}`);
    let end: Date;

    if (durationMode === 'duration') {
      const hours = parseFloat(durationHours);
      if (!hours || hours <= 0) return;
      end = new Date(start.getTime() + hours * 3600000);
    } else {
      if (!endDate || !endTime) return;
      end = new Date(`${endDate}T${endTime}`);
      if (end <= start) {
        alert('End time must be after start time.');
        return;
      }
    }

    if (start > new Date() || end > new Date()) {
      alert('Past fasts cannot be in the future.');
      return;
    }

    await logPastFast(start.toISOString(), end.toISOString(), status, notes || undefined);
    onSaved();
    onClose();
    // Reset form
    setStartDate('');
    setStartTime('');
    setDurationHours('');
    setEndDate('');
    setEndTime('');
    setStatus('completed');
    setNotes('');
  };

  return (
    <Modal open={open} onClose={onClose} title="Log a Past Fast">
      <div className="space-y-4">
        <p className="text-xs text-text-secondary">
          Record a water fast you completed before using the app. This keeps your lifetime stats accurate.
        </p>

        {/* Start date/time */}
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-2">When did you start?</label>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-text-secondary mb-1">Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-text-secondary mb-1">Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
              />
            </div>
          </div>
        </div>

        {/* Duration mode */}
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-2">How long did it last?</label>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setDurationMode('duration')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                durationMode === 'duration' ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'
              }`}
            >
              Enter duration
            </button>
            <button
              onClick={() => setDurationMode('endtime')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                durationMode === 'endtime' ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'
              }`}
            >
              Enter end time
            </button>
          </div>

          {durationMode === 'duration' ? (
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {[16, 24, 36, 48, 72, 96, 120].map(h => (
                  <button
                    key={h}
                    onClick={() => setDurationHours(h.toString())}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      durationHours === h.toString() ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={[16, 24, 36, 48, 72, 96, 120].includes(Number(durationHours)) ? '' : durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  placeholder="Custom hours"
                  className="w-32 bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
                  min="1"
                />
                <span className="text-sm text-text-secondary">hours</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-text-secondary mb-1">End date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-text-secondary mb-1">End time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
                />
              </div>
            </div>
          )}
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-2">How did it end?</label>
          <div className="flex gap-2">
            <button
              onClick={() => setStatus('completed')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${
                status === 'completed' ? 'bg-success text-white' : 'bg-morning-mist text-deep-ocean'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatus('broken')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${
                status === 'broken' ? 'bg-text-secondary text-white' : 'bg-morning-mist text-deep-ocean'
              }`}
            >
              Ended early
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did this fast go? What did you learn?"
            className="w-full bg-glacier border border-morning-mist rounded-xl px-3 py-2 text-sm text-deep-ocean resize-none h-20"
          />
        </div>

        <Button onClick={handleSave} className="w-full" size="lg">
          Save Past Fast
        </Button>
      </div>
    </Modal>
  );
}

function SettingsView({ onBack }: { onBack: () => void }) {
  const settings = useSettingsStore();
  const { updateSettings } = settings;

  return (
    <div>
      <button onClick={onBack} className="text-still-water text-sm mb-4 flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back
      </button>

      <div className="space-y-4">
        {/* Profile */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Name (optional)</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => updateSettings({ name: e.target.value })}
                className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Units</label>
              <div className="flex gap-2">
                {(['imperial', 'metric'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => updateSettings({ units: u })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      settings.units === u ? 'bg-still-water text-white' : 'bg-glacier text-deep-ocean'
                    }`}
                  >
                    {u === 'imperial' ? 'Imperial (lbs, oz)' : 'Metric (kg, mL)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Water Goal */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Water Goal</h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={settings.units === 'imperial' ? Math.round(settings.water_goal_ml / 29.5735) : settings.water_goal_ml}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateSettings({ water_goal_ml: settings.units === 'imperial' ? Math.round(val * 29.5735) : val });
              }}
              className="w-24 bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
            />
            <span className="text-sm text-text-secondary">{settings.units === 'imperial' ? 'oz / day' : 'mL / day'}</span>
          </div>
        </Card>

        {/* Default Fast Duration */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Default Fast Duration</h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={settings.default_fast_hours || ''}
              onChange={(e) => updateSettings({ default_fast_hours: e.target.value ? Number(e.target.value) : null })}
              placeholder="None"
              className="w-24 bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
            />
            <span className="text-sm text-text-secondary">hours</span>
          </div>
        </Card>

        {/* Wake/Sleep */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Active Hours</h3>
          <p className="text-xs text-text-secondary mb-2">Reminders will only be sent during these hours.</p>
          <div className="flex items-center gap-3">
            <div>
              <label className="text-xs text-text-secondary">Wake</label>
              <input
                type="number" min="0" max="23"
                value={settings.wake_hour}
                onChange={(e) => updateSettings({ wake_hour: Number(e.target.value) })}
                className="w-16 bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean block"
              />
            </div>
            <span className="text-text-secondary mt-4">to</span>
            <div>
              <label className="text-xs text-text-secondary">Sleep</label>
              <input
                type="number" min="0" max="23"
                value={settings.sleep_hour}
                onChange={(e) => updateSettings({ sleep_hour: Number(e.target.value) })}
                className="w-16 bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean block"
              />
            </div>
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Emergency Contact</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={settings.emergency_contact_name}
              onChange={(e) => updateSettings({ emergency_contact_name: e.target.value })}
              placeholder="Contact name"
              className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
            />
            <input
              type="tel"
              value={settings.emergency_contact_phone}
              onChange={(e) => updateSettings({ emergency_contact_phone: e.target.value })}
              placeholder="Phone number"
              className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
            />
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Notifications</h3>
          <div className="space-y-3">
            <NotificationToggle label="Fasting milestones" value={settings.notifications_milestones} onChange={(v) => updateSettings({ notifications_milestones: v })} />
            <NotificationToggle label="Water reminders" value={settings.notifications_water} onChange={(v) => updateSettings({ notifications_water: v })} />
            <NotificationToggle label="Electrolyte reminders" value={settings.notifications_electrolytes} onChange={(v) => updateSettings({ notifications_electrolytes: v })} />
            <NotificationToggle label="Health check-in prompts" value={settings.notifications_checkin} onChange={(v) => updateSettings({ notifications_checkin: v })} />
            <NotificationToggle label="Fasting benefits" value={settings.notifications_benefits} onChange={(v) => updateSettings({ notifications_benefits: v })} />
            <NotificationToggle label="Refeeding reminders" value={settings.notifications_refeeding} onChange={(v) => updateSettings({ notifications_refeeding: v })} />
          </div>
        </Card>

        {/* Disclaimer */}
        <p className="text-xs text-text-secondary text-center px-4 pb-4">
          HydraFast is for informational purposes only and is not medical advice. Consult a healthcare provider before fasting.
        </p>
      </div>
    </div>
  );
}

function NotificationToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-deep-ocean">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-7 rounded-full transition-colors relative ${value ? 'bg-still-water' : 'bg-gray-300'}`}
      >
        <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
