import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMetricsStore } from '../../store/metricsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatLocalDate } from '../../utils/conversions';

export function WeightTracker() {
  const { weightHistory, loadWeightHistory, addMetric } = useMetricsStore();
  const { units } = useSettingsStore();
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState('');
  const [range, setRange] = useState<7 | 30 | 90>(30);

  useEffect(() => { loadWeightHistory(); }, []);

  const unit = units === 'imperial' ? 'lbs' : 'kg';

  const handleAdd = async () => {
    const num = parseFloat(value);
    if (!num || num <= 0) return;
    await addMetric({ type: 'weight', value: num, value_secondary: null, unit, notes: null });
    setValue('');
    setShowInput(false);
  };

  // Filter by range
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - range);
  const filtered = weightHistory.filter(m => new Date(m.timestamp) >= cutoff);

  const chartData = filtered.map(m => ({
    date: formatLocalDate(m.timestamp),
    weight: m.value,
  }));

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-deep-ocean">Weight Trend</h3>
        <div className="flex gap-1">
          {([7, 30, 90] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium ${range === r ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'}`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {chartData.length > 1 ? (
        <div className="h-48 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                width={40}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip
                formatter={(v) => [`${v} ${unit}`, 'Weight']}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              />
              {/* Neutral color — no red/green */}
              <Line type="monotone" dataKey="weight" stroke="#0284C7" strokeWidth={2} dot={{ fill: '#0284C7', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-text-secondary text-center py-6 mb-3">
          {chartData.length === 1 ? 'Log one more entry to see your trend.' : 'No weight entries yet.'}
        </p>
      )}

      {showInput ? (
        <div className="flex gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Weight (${unit})`}
            className="flex-1 bg-glacier border border-morning-mist rounded-xl px-3 py-2 text-sm text-deep-ocean"
            step="0.1"
            autoFocus
          />
          <Button size="sm" onClick={handleAdd}>Save</Button>
          <Button size="sm" variant="ghost" onClick={() => setShowInput(false)}>Cancel</Button>
        </div>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setShowInput(true)} className="w-full">
          + Log Weight
        </Button>
      )}
    </Card>
  );
}
