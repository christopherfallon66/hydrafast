import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getWaterLogsForRange } from '../../db/queries';
import { useSettingsStore } from '../../store/settingsStore';
import { daysAgo, formatWater, mlToOz } from '../../utils/conversions';
import { Card } from '../common/Card';

export function WaterHistory() {
  const { water_goal_ml, units } = useSettingsStore();
  const [data, setData] = useState<{ day: string; total: number }[]>([]);
  const [range, setRange] = useState<7 | 30>(7);

  useEffect(() => {
    async function load() {
      const start = daysAgo(range);
      const end = new Date();
      const logs = await getWaterLogsForRange(start, end);

      // Group by local day
      const map = new Map<string, number>();
      for (let i = 0; i < range; i++) {
        const d = daysAgo(i);
        const key = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        map.set(key, 0);
      }
      for (const log of logs) {
        const d = new Date(log.timestamp);
        const key = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        map.set(key, (map.get(key) || 0) + log.amount_ml);
      }
      const arr = Array.from(map.entries()).map(([day, total]) => ({ day, total })).reverse();
      setData(arr);
    }
    load();
  }, [range]);

  const goalValue = units === 'imperial' ? mlToOz(water_goal_ml) : water_goal_ml;
  const displayData = data.map(d => ({
    day: d.day,
    total: units === 'imperial' ? mlToOz(d.total) : d.total,
  }));

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-deep-ocean">History</h3>
        <div className="flex gap-1">
          {([7, 30] as const).map(r => (
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
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData}>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={range === 30 ? 4 : 0} />
            <YAxis tick={{ fontSize: 10 }} width={35} />
            <Tooltip
              formatter={(value) => [formatWater(units === 'imperial' ? Number(value) * 29.5735 : Number(value), units), 'Intake']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
            <ReferenceLine y={goalValue} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Goal', fontSize: 10 }} />
            <Bar dataKey="total" fill="#38BDF8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
