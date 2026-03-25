import { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { getAllFasts, getRecentCheckIns } from '../../db/queries';
import { formatDurationShort, formatLocalDate } from '../../utils/conversions';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { FastSession, HealthCheckIn } from '../../types';

export function AnalyticsDashboard() {
  const [fasts, setFasts] = useState<FastSession[]>([]);
  const [checkIns, setCheckIns] = useState<HealthCheckIn[]>([]);
  const [timeRange, setTimeRange] = useState<'30' | '90' | 'all'>('30');

  useEffect(() => {
    getAllFasts().then(setFasts);
    getRecentCheckIns(100).then(setCheckIns);
  }, []);

  const completed = fasts.filter(f => f.status !== 'active' && f.end_time);

  if (completed.length === 0) {
    return <EmptyState icon="📊" title="No data yet" message="Complete a fast to see your analytics." />;
  }

  // Filter by time range
  const now = Date.now();
  const filtered = timeRange === 'all' ? completed : completed.filter(f => {
    const days = timeRange === '30' ? 30 : 90;
    return (now - new Date(f.start_time).getTime()) < days * 86400000;
  });

  // Stats
  const totalHours = filtered.reduce((s, f) => {
    return s + (new Date(f.end_time!).getTime() - new Date(f.start_time).getTime()) / 3600000;
  }, 0);
  const avgHours = filtered.length > 0 ? totalHours / filtered.length : 0;
  const completedCount = filtered.filter(f => f.status === 'completed').length;
  const completionRate = filtered.length > 0 ? Math.round((completedCount / filtered.length) * 100) : 0;
  const longestHours = Math.max(0, ...filtered.map(f =>
    (new Date(f.end_time!).getTime() - new Date(f.start_time).getTime()) / 3600000
  ));

  // Fast duration chart data
  const durationData = filtered
    .slice()
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .map(f => ({
      date: formatLocalDate(f.start_time),
      hours: Math.round((new Date(f.end_time!).getTime() - new Date(f.start_time).getTime()) / 3600000),
    }));

  // Break reasons pie chart
  const reasonCounts: Record<string, number> = {};
  filtered.filter(f => f.status === 'broken').forEach(f => {
    const r = f.break_reason || 'other';
    reasonCounts[r] = (reasonCounts[r] || 0) + 1;
  });
  const pieData = Object.entries(reasonCounts).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ['#0284C7', '#38BDF8', '#F59E0B', '#64748B', '#EF4444'];

  // Check-in trends
  const ciData = checkIns
    .slice()
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-20)
    .map(ci => ({
      date: formatLocalDate(ci.timestamp),
      energy: ci.energy,
      clarity: ci.clarity,
    }));

  return (
    <div className="space-y-4">
      {/* Time range selector */}
      <div className="flex gap-1 bg-morning-mist rounded-xl p-1">
        {(['30', '90', 'all'] as const).map(r => (
          <button
            key={r}
            onClick={() => setTimeRange(r)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === r ? 'bg-surface text-deep-ocean shadow-sm' : 'text-text-secondary'
            }`}
          >
            {r === 'all' ? 'All Time' : `${r} Days`}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center py-3">
          <div className="text-xl font-bold text-deep-ocean">{filtered.length}</div>
          <div className="text-[10px] text-text-secondary">Total Fasts</div>
        </Card>
        <Card className="text-center py-3">
          <div className="text-xl font-bold text-deep-ocean">{formatDurationShort(totalHours)}</div>
          <div className="text-[10px] text-text-secondary">Total Hours</div>
        </Card>
        <Card className="text-center py-3">
          <div className="text-xl font-bold text-deep-ocean">{formatDurationShort(avgHours)}</div>
          <div className="text-[10px] text-text-secondary">Avg Duration</div>
        </Card>
        <Card className="text-center py-3">
          <div className="text-xl font-bold text-deep-ocean">{completionRate}%</div>
          <div className="text-[10px] text-text-secondary">Completion Rate</div>
        </Card>
        <Card className="text-center py-3">
          <div className="text-xl font-bold text-deep-ocean">{formatDurationShort(longestHours)}</div>
          <div className="text-[10px] text-text-secondary">Longest Fast</div>
        </Card>
        <Card className="text-center py-3">
          <div className="text-xl font-bold text-deep-ocean">{completedCount}</div>
          <div className="text-[10px] text-text-secondary">Completed</div>
        </Card>
      </div>

      {/* Duration bar chart */}
      {durationData.length > 1 && (
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Fast Durations</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={durationData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip formatter={(val) => [`${val}h`, 'Duration']} />
              <Bar dataKey="hours" fill="#0284C7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Check-in trends */}
      {ciData.length > 2 && (
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Energy & Clarity Trends</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ciData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip />
              <Line type="monotone" dataKey="energy" stroke="#0284C7" strokeWidth={2} name="Energy" dot={false} />
              <Line type="monotone" dataKey="clarity" stroke="#38BDF8" strokeWidth={2} name="Clarity" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs text-text-secondary"><span className="w-3 h-1 bg-still-water rounded-full inline-block" /> Energy</span>
            <span className="flex items-center gap-1 text-xs text-text-secondary"><span className="w-3 h-1 bg-shallow-pool rounded-full inline-block" /> Clarity</span>
          </div>
        </Card>
      )}

      {/* Break reasons pie */}
      {pieData.length > 0 && (
        <Card>
          <h3 className="text-sm font-bold text-deep-ocean mb-3">Break Reasons</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-text-secondary capitalize">{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
