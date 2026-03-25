import { db } from '../db/index';

export async function exportAllDataJSON(): Promise<string> {
  const [fasts, water, electrolytes, checkIns, metrics, journal] = await Promise.all([
    db.fast_sessions.toArray(),
    db.water_logs.toArray(),
    db.electrolyte_logs.toArray(),
    db.health_checkins.toArray(),
    db.body_metrics.toArray(),
    db.journal_entries.toArray(),
  ]);

  const data = {
    exported_at: new Date().toISOString(),
    app: 'HydraFast',
    fast_sessions: fasts,
    water_logs: water,
    electrolyte_logs: electrolytes,
    health_checkins: checkIns,
    body_metrics: metrics,
    journal_entries: journal.map(j => ({ ...j, photos: [] })), // Strip photo blobs for export size
  };

  return JSON.stringify(data, null, 2);
}

export async function exportAllDataCSV(): Promise<Record<string, string>> {
  const [fasts, water, electrolytes, checkIns, metrics, journal] = await Promise.all([
    db.fast_sessions.toArray(),
    db.water_logs.toArray(),
    db.electrolyte_logs.toArray(),
    db.health_checkins.toArray(),
    db.body_metrics.toArray(),
    db.journal_entries.toArray(),
  ]);

  return {
    'fast_sessions.csv': arrayToCSV(fasts),
    'water_logs.csv': arrayToCSV(water),
    'electrolyte_logs.csv': arrayToCSV(electrolytes),
    'health_checkins.csv': arrayToCSV(checkIns),
    'body_metrics.csv': arrayToCSV(metrics),
    'journal_entries.csv': arrayToCSV(journal.map(j => ({ ...j, tags: j.tags.join(';'), photos: j.photos.length }))),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function arrayToCSV(data: any[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h];
      const str = val === null || val === undefined ? '' : String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadJSONExport() {
  const json = await exportAllDataJSON();
  downloadFile(json, `hydrafast-export-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
}

export async function downloadCSVExport() {
  const csvFiles = await exportAllDataCSV();
  // Download each CSV
  for (const [name, content] of Object.entries(csvFiles)) {
    if (content) {
      downloadFile(content, `hydrafast-${name}`, 'text/csv');
    }
  }
}
