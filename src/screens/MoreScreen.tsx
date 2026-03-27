import { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useSettingsStore } from '../store/settingsStore';
import { getAllFasts, logPastFast } from '../db/queries';
import { Modal } from '../components/common/Modal';
import { formatDurationShort, formatLocalDateTime } from '../utils/conversions';
import { JournalEditor } from '../components/journal/JournalEditor';
import { JournalList } from '../components/journal/JournalList';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { downloadJSONExport, downloadCSVExport } from '../utils/export';
import type { FastSession } from '../types';

export function MoreScreen() {
  type View = 'menu' | 'history' | 'settings' | 'journal' | 'analytics' | 'export' | 'help';
  const [view, setView] = useState<View>('menu');

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-lg font-bold text-deep-ocean mb-4">More</h1>

      {view === 'menu' && <MenuView onNavigate={(v: View) => setView(v)} />}
      {view === 'history' && <HistoryView onBack={() => setView('menu')} />}
      {view === 'journal' && <JournalView onBack={() => setView('menu')} />}
      {view === 'analytics' && <AnalyticsView onBack={() => setView('menu')} />}
      {view === 'export' && <ExportView onBack={() => setView('menu')} />}
      {view === 'settings' && <SettingsView onBack={() => setView('menu')} />}
      {view === 'help' && <HelpView onBack={() => setView('menu')} />}
    </div>
  );
}

function MenuView({ onNavigate }: { onNavigate: (v: 'history' | 'settings' | 'journal' | 'analytics' | 'export' | 'help') => void }) {
  return (
    <div className="space-y-2">
      <Card onClick={() => onNavigate('help')} className="cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-xl">❓</span>
          <div>
            <h3 className="text-sm font-bold text-deep-ocean">Help & FAQ</h3>
            <p className="text-xs text-text-secondary">How to use HydraFast & install on your phone</p>
          </div>
        </div>
      </Card>
      <Card onClick={() => onNavigate('journal')} className="cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-xl">📝</span>
          <div>
            <h3 className="text-sm font-bold text-deep-ocean">Journal</h3>
            <p className="text-xs text-text-secondary">Write about your fasting journey</p>
          </div>
        </div>
      </Card>
      <Card onClick={() => onNavigate('history')} className="cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-xl">📋</span>
          <div>
            <h3 className="text-sm font-bold text-deep-ocean">Fast History</h3>
            <p className="text-xs text-text-secondary">View and log past fasts</p>
          </div>
        </div>
      </Card>
      <Card onClick={() => onNavigate('analytics')} className="cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <div>
            <h3 className="text-sm font-bold text-deep-ocean">Analytics</h3>
            <p className="text-xs text-text-secondary">Charts, trends, and insights</p>
          </div>
        </div>
      </Card>
      <Card onClick={() => onNavigate('export')} className="cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-xl">💾</span>
          <div>
            <h3 className="text-sm font-bold text-deep-ocean">Export Data</h3>
            <p className="text-xs text-text-secondary">Download your data as JSON or CSV</p>
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

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="text-still-water text-sm mb-4 flex items-center gap-1">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
      Back
    </button>
  );
}

function JournalView({ onBack }: { onBack: () => void }) {
  const [composing, setComposing] = useState(false);
  const [editEntry, setEditEntry] = useState<import('../types').JournalEntry | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDone = () => {
    setComposing(false);
    setEditEntry(null);
    setRefreshKey(k => k + 1);
  };

  return (
    <div>
      <BackButton onBack={onBack} />
      {composing || editEntry ? (
        <JournalEditor
          editEntry={editEntry}
          onSaved={handleDone}
          onCancel={() => { setComposing(false); setEditEntry(null); }}
        />
      ) : (
        <JournalList
          onCompose={() => setComposing(true)}
          onEdit={(entry) => setEditEntry(entry)}
          refreshKey={refreshKey}
        />
      )}
    </div>
  );
}

function AnalyticsView({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <BackButton onBack={onBack} />
      <AnalyticsDashboard />
    </div>
  );
}

function ExportView({ onBack }: { onBack: () => void }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'json' | 'csv') => {
    setExporting(true);
    try {
      if (format === 'json') {
        await downloadJSONExport();
      } else {
        await downloadCSVExport();
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <BackButton onBack={onBack} />
      <div className="space-y-4">
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-2">Export Your Data</h3>
          <p className="text-xs text-text-secondary mb-4">
            Download all your HydraFast data. This includes fasts, water logs, electrolyte logs, check-ins, metrics, and journal entries.
          </p>
          <div className="space-y-2">
            <Button onClick={() => handleExport('json')} disabled={exporting} className="w-full">
              {exporting ? 'Exporting...' : 'Download as JSON'}
            </Button>
            <Button variant="secondary" onClick={() => handleExport('csv')} disabled={exporting} className="w-full">
              {exporting ? 'Exporting...' : 'Download as CSV'}
            </Button>
          </div>
        </Card>
        <p className="text-xs text-text-secondary text-center">
          Your data is stored locally on this device. Export regularly to keep a backup.
        </p>
      </div>
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
      <BackButton onBack={onBack} />

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
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean" />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-text-secondary mb-1">Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean" />
            </div>
          </div>
        </div>

        {/* Duration mode */}
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-2">How long did it last?</label>
          <div className="flex gap-2 mb-3">
            <button onClick={() => setDurationMode('duration')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${durationMode === 'duration' ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'}`}>Enter duration</button>
            <button onClick={() => setDurationMode('endtime')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${durationMode === 'endtime' ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'}`}>Enter end time</button>
          </div>

          {durationMode === 'duration' ? (
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {[16, 24, 36, 48, 72, 96, 120].map(h => (
                  <button key={h} onClick={() => setDurationHours(h.toString())} className={`px-3 py-2 rounded-lg text-sm font-medium ${durationHours === h.toString() ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'}`}>{h}h</button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input type="number" value={[16, 24, 36, 48, 72, 96, 120].includes(Number(durationHours)) ? '' : durationHours} onChange={(e) => setDurationHours(e.target.value)} placeholder="Custom hours" className="w-32 bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean" min="1" />
                <span className="text-sm text-text-secondary">hours</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-text-secondary mb-1">End date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-text-secondary mb-1">End time</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean" />
              </div>
            </div>
          )}
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-2">How did it end?</label>
          <div className="flex gap-2">
            <button onClick={() => setStatus('completed')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${status === 'completed' ? 'bg-success text-white' : 'bg-morning-mist text-deep-ocean'}`}>Completed</button>
            <button onClick={() => setStatus('broken')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${status === 'broken' ? 'bg-text-secondary text-white' : 'bg-morning-mist text-deep-ocean'}`}>Ended early</button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-2">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How did this fast go? What did you learn?" className="w-full bg-glacier border border-morning-mist rounded-xl px-3 py-2 text-sm text-deep-ocean resize-none h-20" />
        </div>

        <Button onClick={handleSave} className="w-full" size="lg">Save Past Fast</Button>
      </div>
    </Modal>
  );
}

function HelpView({ onBack }: { onBack: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

  return (
    <div>
      <BackButton onBack={onBack} />

      {/* Install on iPhone */}
      <Card className="mb-3">
        <button onClick={() => toggle('iphone')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📱</span>
            <h3 className="text-sm font-bold text-deep-ocean">Install on iPhone</h3>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className={`transition-transform ${openSection === 'iphone' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {openSection === 'iphone' && (
          <div className="mt-3 space-y-3">
            <Step num={1} text="Open Safari and go to hydrafast.vercel.app" />
            <Step num={2} text='Tap the Share button at the bottom of the screen (the square with an arrow pointing up)' />
            <Step num={3} text='Scroll down and tap "Add to Home Screen"' />
            <Step num={4} text='Tap "Add" in the top right corner' />
            <Step num={5} text="HydraFast will appear on your home screen as a full app — no app store needed!" />
            <p className="text-xs text-text-secondary italic">Note: You must use Safari. Chrome and other browsers on iPhone do not support installing web apps.</p>
          </div>
        )}
      </Card>

      {/* Install on Android */}
      <Card className="mb-3">
        <button onClick={() => toggle('android')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🤖</span>
            <h3 className="text-sm font-bold text-deep-ocean">Install on Android</h3>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className={`transition-transform ${openSection === 'android' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {openSection === 'android' && (
          <div className="mt-3 space-y-3">
            <Step num={1} text="Open Chrome and go to hydrafast.vercel.app" />
            <Step num={2} text='Tap the three-dot menu in the top right corner' />
            <Step num={3} text='Tap "Add to Home screen" or "Install app"' />
            <Step num={4} text='Tap "Install" when prompted' />
            <Step num={5} text="HydraFast will appear on your home screen and in your app drawer just like a regular app!" />
            <p className="text-xs text-text-secondary italic">Note: If you see a banner at the bottom saying "Add HydraFast to Home screen," you can tap that instead.</p>
          </div>
        )}
      </Card>

      {/* Getting Started */}
      <Card className="mb-3">
        <button onClick={() => toggle('start')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚀</span>
            <h3 className="text-sm font-bold text-deep-ocean">Getting Started</h3>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className={`transition-transform ${openSection === 'start' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {openSection === 'start' && (
          <div className="mt-3 space-y-3">
            <Step num={1} text='Tap "Start Fast" on the Home screen. Set a goal duration or leave it open-ended.' />
            <Step num={2} text="Already mid-fast? Tap the clock icon to set a custom start time and HydraFast will catch you up on what your body has been through." />
            <Step num={3} text="Log your water intake throughout the day using the quick-add buttons on the Track tab." />
            <Step num={4} text="Complete health check-ins when prompted — this is how HydraFast monitors your safety." />
            <Step num={5} text={'When you\'re ready to break your fast, tap "End Fast" and follow the refeeding guide for your fast length.'} />
          </div>
        )}
      </Card>

      {/* Electrolyte Tracking */}
      <Card className="mb-3">
        <button onClick={() => toggle('electrolytes')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <h3 className="text-sm font-bold text-deep-ocean">Electrolyte Tracking</h3>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className={`transition-transform ${openSection === 'electrolytes' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {openSection === 'electrolytes' && (
          <div className="mt-3 space-y-3">
            <Step num={1} text="Go to the Track tab and select Electrolytes." />
            <Step num={2} text='Tap "My Supplements" to save your supplements. Enter the sodium, potassium, and magnesium per serving from the label.' />
            <Step num={3} text="Once saved, just tap your supplement and enter the number of servings to log all three electrolytes at once." />
            <Step num={4} text="You can also manually log individual electrolytes using the quick-add buttons." />
            <p className="text-xs text-text-secondary italic">Electrolyte supplementation is critical for fasts longer than 24 hours. Watch for muscle cramps, dizziness, or headaches — these may signal low electrolytes.</p>
          </div>
        )}
      </Card>

      {/* Health Check-Ins & Safety */}
      <Card className="mb-3">
        <button onClick={() => toggle('safety')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <h3 className="text-sm font-bold text-deep-ocean">Health Check-Ins & Safety</h3>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className={`transition-transform ${openSection === 'safety' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {openSection === 'safety' && (
          <div className="mt-3 space-y-3">
            <p className="text-xs text-text-secondary">HydraFast uses a traffic-light system to monitor your wellbeing:</p>
            <div className="flex items-start gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-warning mt-0.5 shrink-0" />
              <p className="text-xs text-deep-ocean"><strong>Yellow:</strong> Mild symptoms — you'll get hydration and electrolyte reminders.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mt-0.5 shrink-0" />
              <p className="text-xs text-deep-ocean"><strong>Orange:</strong> Caution — consider breaking your fast and consult a healthcare provider.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-danger mt-0.5 shrink-0" />
              <p className="text-xs text-deep-ocean"><strong>Red:</strong> Urgent — break your fast immediately and seek medical attention if needed.</p>
            </div>
            <p className="text-xs text-text-secondary italic">Always be honest in your check-ins. Your safety is more important than any fasting goal.</p>
          </div>
        )}
      </Card>

      {/* Refeeding */}
      <Card className="mb-3">
        <button onClick={() => toggle('refeeding')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🍽️</span>
            <h3 className="text-sm font-bold text-deep-ocean">Breaking Your Fast Safely</h3>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className={`transition-transform ${openSection === 'refeeding' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {openSection === 'refeeding' && (
          <div className="mt-3 space-y-3">
            <p className="text-xs text-text-secondary">How you break your fast matters. HydraFast automatically selects the right refeeding plan based on how long you fasted:</p>
            <div className="text-xs text-deep-ocean space-y-2">
              <p><strong>Under 48 hours:</strong> Low risk. Start with bone broth, soft scrambled eggs, or avocado. Avoid large meals.</p>
              <p><strong>48-120 hours:</strong> Moderate risk. Follow a 1-2 day structured plan starting with broth, then soft foods, then normal meals.</p>
              <p><strong>120+ hours:</strong> Elevated risk. Follow a 3-5 day plan. Start with broth only, gradually add foods. Consider physician supervision.</p>
            </div>
            <p className="text-xs text-text-secondary italic">Find your full refeeding plan on the Learn tab under "Refeeding Guide."</p>
          </div>
        )}
      </Card>

      {/* Logging Past Fasts */}
      <Card className="mb-3">
        <button onClick={() => toggle('pastfasts')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📋</span>
            <h3 className="text-sm font-bold text-deep-ocean">Logging Past Fasts</h3>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className={`transition-transform ${openSection === 'pastfasts' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {openSection === 'pastfasts' && (
          <div className="mt-3 space-y-3">
            <Step num={1} text='Go to More &gt; Fast History and tap "+ Log Past Fast"' />
            <Step num={2} text="Enter the start date and time of your past fast." />
            <Step num={3} text="Enter how long it lasted (pick a preset or enter custom hours) or set an end time." />
            <Step num={4} text="Select whether you completed the fast or ended early, and add any notes." />
            <p className="text-xs text-text-secondary italic">Logging past fasts keeps your lifetime stats accurate, including total hours fasted, average duration, and completion rate.</p>
          </div>
        )}
      </Card>

      {/* Data & Privacy */}
      <Card className="mb-3">
        <button onClick={() => toggle('privacy')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔒</span>
            <h3 className="text-sm font-bold text-deep-ocean">Data & Privacy</h3>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className={`transition-transform ${openSection === 'privacy' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {openSection === 'privacy' && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-deep-ocean">All your data stays on your device. HydraFast does not have accounts, servers, or cloud storage.</p>
            <p className="text-xs text-deep-ocean">You can export your data anytime as JSON or CSV from More &gt; Export Data.</p>
            <p className="text-xs text-deep-ocean">The app works fully offline once installed.</p>
            <p className="text-xs text-text-secondary italic">If you clear your browser data or uninstall the app, your data will be lost. Export regularly to keep a backup.</p>
          </div>
        )}
      </Card>

      {/* Updates */}
      <Card className="mb-3">
        <button onClick={() => toggle('updates')} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔄</span>
            <h3 className="text-sm font-bold text-deep-ocean">App Updates</h3>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className={`transition-transform ${openSection === 'updates' ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {openSection === 'updates' && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-deep-ocean">HydraFast updates automatically. When a new version is available, you'll see a notification at the bottom of the screen.</p>
            <p className="text-xs text-deep-ocean">Tap "Update Now" to get the latest version, or "Later" to update next time you open the app.</p>
            <p className="text-xs text-deep-ocean">No reinstall is ever needed — updates happen in the background.</p>
          </div>
        )}
      </Card>

      <p className="text-xs text-text-secondary text-center px-4 mt-4">
        HydraFast is for informational purposes only and is not medical advice. Consult a healthcare provider before fasting.
      </p>
    </div>
  );
}

function Step({ num, text }: { num: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-still-water text-white text-xs font-bold flex items-center justify-center mt-0.5">{num}</span>
      <p className="text-xs text-deep-ocean">{text}</p>
    </div>
  );
}

function SettingsView({ onBack }: { onBack: () => void }) {
  const settings = useSettingsStore();
  const { updateSettings } = settings;

  return (
    <div>
      <BackButton onBack={onBack} />

      <div className="space-y-4">
        {/* Profile */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Name (optional)</label>
              <input type="text" value={settings.name} onChange={(e) => updateSettings({ name: e.target.value })} className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Units</label>
              <div className="flex gap-2">
                {(['imperial', 'metric'] as const).map(u => (
                  <button key={u} onClick={() => updateSettings({ units: u })} className={`flex-1 py-2 rounded-lg text-sm font-medium ${settings.units === u ? 'bg-still-water text-white' : 'bg-glacier text-deep-ocean'}`}>
                    {u === 'imperial' ? 'Imperial (lbs, oz)' : 'Metric (kg, mL)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Dark Mode */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-deep-ocean">Dark Mode</span>
              <p className="text-xs text-text-secondary">Deep ocean midnight palette</p>
            </div>
            <button
              onClick={() => updateSettings({ dark_mode: !settings.dark_mode } as Record<string, unknown>)}
              className={`w-12 h-7 rounded-full transition-colors relative ${settings.dark_mode ? 'bg-still-water' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${settings.dark_mode ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </Card>

        {/* Water Goal */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Water Goal</h3>
          <div className="flex items-center gap-3">
            <input type="number" value={settings.units === 'imperial' ? Math.round(settings.water_goal_ml / 29.5735) : settings.water_goal_ml} onChange={(e) => { const val = Number(e.target.value); updateSettings({ water_goal_ml: settings.units === 'imperial' ? Math.round(val * 29.5735) : val }); }} className="w-24 bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean" />
            <span className="text-sm text-text-secondary">{settings.units === 'imperial' ? 'oz / day' : 'mL / day'}</span>
          </div>
        </Card>

        {/* Default Fast Duration */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Default Fast Duration</h3>
          <div className="flex items-center gap-3">
            <input type="number" value={settings.default_fast_hours || ''} onChange={(e) => updateSettings({ default_fast_hours: e.target.value ? Number(e.target.value) : null })} placeholder="None" className="w-24 bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean" />
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
              <input type="number" min="0" max="23" value={settings.wake_hour} onChange={(e) => updateSettings({ wake_hour: Number(e.target.value) })} className="w-16 bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean block" />
            </div>
            <span className="text-text-secondary mt-4">to</span>
            <div>
              <label className="text-xs text-text-secondary">Sleep</label>
              <input type="number" min="0" max="23" value={settings.sleep_hour} onChange={(e) => updateSettings({ sleep_hour: Number(e.target.value) })} className="w-16 bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean block" />
            </div>
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Emergency Contact</h3>
          <div className="space-y-2">
            <input type="text" value={settings.emergency_contact_name} onChange={(e) => updateSettings({ emergency_contact_name: e.target.value })} placeholder="Contact name" className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean" />
            <input type="tel" value={settings.emergency_contact_phone} onChange={(e) => updateSettings({ emergency_contact_phone: e.target.value })} placeholder="Phone number" className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean" />
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
