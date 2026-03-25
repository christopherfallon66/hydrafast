import { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { addBodyMetric, getMetricsByType } from '../../db/queries';
import { formatLocalDateTime } from '../../utils/conversions';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { BodyMetric } from '../../types';

type MetricType = 'blood_glucose' | 'ketone';

const CONFIG: Record<MetricType, { label: string; unit: string; unitAlt?: string; color: string; icon: string; ranges: { label: string; min: number; max: number }[] }> = {
  blood_glucose: {
    label: 'Blood Glucose',
    unit: 'mg/dL',
    unitAlt: 'mmol/L',
    color: '#F59E0B',
    icon: '🩸',
    ranges: [
      { label: 'Low (fasting typical)', min: 55, max: 70 },
      { label: 'Normal fasting', min: 70, max: 100 },
      { label: 'Elevated', min: 100, max: 140 },
    ],
  },
  ketone: {
    label: 'Blood Ketones',
    unit: 'mmol/L',
    color: '#8B5CF6',
    icon: '⚡',
    ranges: [
      { label: 'No ketosis', min: 0, max: 0.5 },
      { label: 'Light ketosis', min: 0.5, max: 1.5 },
      { label: 'Optimal ketosis', min: 1.5, max: 3.0 },
      { label: 'Deep ketosis', min: 3.0, max: 8.0 },
    ],
  },
};

export function GlucoseKetoneTracker() {
  const [activeType, setActiveType] = useState<MetricType>('blood_glucose');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div className="flex gap-1 bg-morning-mist rounded-xl p-1">
        {(['blood_glucose', 'ketone'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeType === t ? 'bg-surface text-deep-ocean shadow-sm' : 'text-text-secondary'
            }`}
          >
            {CONFIG[t].icon} {CONFIG[t].label}
          </button>
        ))}
      </div>

      <MetricPanel
        type={activeType}
        onAdd={() => setShowAddModal(true)}
      />

      <AddMetricModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        type={activeType}
      />
    </div>
  );
}

function MetricPanel({ type, onAdd }: { type: MetricType; onAdd: () => void }) {
  const [history, setHistory] = useState<BodyMetric[]>([]);
  const [range, setRange] = useState<'7' | '30' | '90'>('7');
  const config = CONFIG[type];

  const load = () => getMetricsByType(type).then(setHistory);

  useEffect(() => { load(); }, [type]);

  const now = Date.now();
  const filteredHistory = history.filter(m => {
    const days = parseInt(range);
    return (now - new Date(m.timestamp).getTime()) < days * 86400000;
  });

  const chartData = filteredHistory
    .slice()
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(m => ({
      date: new Date(m.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      value: m.value,
    }));

  const latest = history[0];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-deep-ocean">{config.label}</h3>
        <Button variant="secondary" size="sm" onClick={onAdd}>+ Add Reading</Button>
      </div>

      {/* Latest reading */}
      {latest && (
        <Card className="text-center">
          <div className="text-3xl font-bold text-deep-ocean">{latest.value}</div>
          <div className="text-xs text-text-secondary">{latest.unit} — {formatLocalDateTime(latest.timestamp)}</div>
          {latest.notes && <p className="text-xs text-text-secondary mt-1 italic">{latest.notes}</p>}
        </Card>
      )}

      {/* Reference ranges */}
      <Card>
        <h4 className="text-xs font-medium text-deep-ocean mb-2">Reference Ranges</h4>
        <div className="space-y-1">
          {config.ranges.map(r => (
            <div key={r.label} className="flex justify-between text-xs">
              <span className="text-text-secondary">{r.label}</span>
              <span className="text-deep-ocean font-medium">{r.min}–{r.max} {config.unit}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Chart */}
      {chartData.length > 1 && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-deep-ocean">Trend</h4>
            <div className="flex gap-1">
              {(['7', '30', '90'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    range === r ? 'bg-still-water text-white' : 'text-text-secondary'
                  }`}
                >
                  {r}d
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip formatter={(val) => [`${val} ${config.unit}`, config.label]} />
              <Line type="monotone" dataKey="value" stroke={config.color} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* History list */}
      {history.length === 0 ? (
        <EmptyState icon={config.icon} title={`No ${config.label.toLowerCase()} readings`} message="Tap 'Add Reading' to log your first measurement." />
      ) : (
        <Card>
          <h4 className="text-xs font-medium text-deep-ocean mb-2">Recent Readings</h4>
          <div className="space-y-2">
            {history.slice(0, 10).map(m => (
              <div key={m.id} className="flex justify-between text-xs">
                <span className="text-deep-ocean font-medium">{m.value} {m.unit}</span>
                <span className="text-text-secondary">{formatLocalDateTime(m.timestamp)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function AddMetricModal({ open, onClose, type }: { open: boolean; onClose: () => void; type: MetricType }) {
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const config = CONFIG[type];

  const handleSave = async () => {
    const num = parseFloat(value);
    if (!num || num <= 0) return;
    await addBodyMetric({
      type,
      value: num,
      value_secondary: null,
      unit: config.unit,
      notes: notes.trim() || null,
    });
    setValue('');
    setNotes('');
    onClose();
    // Force re-render of parent by closing
    window.dispatchEvent(new Event('metrics-updated'));
  };

  return (
    <Modal open={open} onClose={onClose} title={`Log ${config.label}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-1">Value ({config.unit})</label>
          <input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`e.g. ${type === 'blood_glucose' ? '85' : '1.5'}`}
            className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-1">Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Before bed, fasting day 3"
            className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
          />
        </div>
        <Button onClick={handleSave} className="w-full">Save Reading</Button>
      </div>
    </Modal>
  );
}
