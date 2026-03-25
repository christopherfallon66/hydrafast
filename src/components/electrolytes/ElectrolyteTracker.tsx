import { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ELECTROLYTE_TARGETS, ELECTROLYTE_QUICK_DOSES, DEFICIENCY_SYMPTOMS } from '../../constants/electrolytes';
import { getElectrolyteLogsForDay, addElectrolyteLog } from '../../db/queries';
import { useFastStore } from '../../store/fastStore';
import { formatLocalTime } from '../../utils/conversions';
import type { ElectrolyteLog } from '../../types';

type ElectrolyteType = 'sodium' | 'potassium' | 'magnesium';

export function ElectrolyteTracker() {
  const { activeFast } = useFastStore();
  const [todayLogs, setTodayLogs] = useState<ElectrolyteLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<ElectrolyteType>('sodium');
  const [showInfo, setShowInfo] = useState<ElectrolyteType | null>(null);

  const loadToday = async () => {
    const logs = await getElectrolyteLogsForDay(new Date());
    setTodayLogs(logs);
  };

  useEffect(() => { loadToday(); }, []);

  const getTotalForType = (type: ElectrolyteType): number => {
    return todayLogs.filter(l => l.type === type).reduce((sum, l) => sum + l.amount_mg, 0);
  };

  const getStatus = (type: ElectrolyteType): 'green' | 'yellow' | 'red' => {
    const total = getTotalForType(type);
    const target = ELECTROLYTE_TARGETS[type];
    if (total >= target.min) return 'green';
    if (total >= target.min * 0.5) return 'yellow';
    return 'red';
  };

  const handleQuickAdd = async (type: ElectrolyteType, mg: number, source: string) => {
    await addElectrolyteLog(type, mg, activeFast?.id, source);
    await loadToday();
  };

  const openAddForType = (type: ElectrolyteType) => {
    setSelectedType(type);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-3">
      {(['sodium', 'potassium', 'magnesium'] as const).map(type => {
        const target = ELECTROLYTE_TARGETS[type];
        const total = getTotalForType(type);
        const status = getStatus(type);
        const pct = Math.min(100, (total / target.min) * 100);

        return (
          <Card key={type}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-deep-ocean">{target.label}</h3>
                <Badge variant={status === 'green' ? 'success' : status === 'yellow' ? 'warning' : 'danger'}>
                  {status === 'green' ? 'On Track' : status === 'yellow' ? 'Low' : 'Very Low'}
                </Badge>
              </div>
              <button
                onClick={() => setShowInfo(showInfo === type ? null : type)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-morning-mist rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  status === 'green' ? 'bg-success' : status === 'yellow' ? 'bg-warning' : 'bg-danger'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-secondary mb-3">
              <span>{Math.round(total)} mg</span>
              <span>{target.min}–{target.max} mg goal</span>
            </div>

            {/* Deficiency info */}
            {showInfo === type && (
              <div className="bg-morning-mist rounded-xl p-3 mb-3 text-xs text-text-secondary">
                <p className="font-medium text-deep-ocean mb-1">Signs of deficiency:</p>
                <p>{DEFICIENCY_SYMPTOMS[type]}</p>
                <p className="mt-2 font-medium text-deep-ocean">Common sources:</p>
                <ul className="list-disc ml-4 mt-1">
                  {target.sources.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
            )}

            {/* Quick dose buttons */}
            <div className="flex flex-wrap gap-2">
              {ELECTROLYTE_QUICK_DOSES[type].map((dose, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAdd(type, dose.mg, dose.source)}
                  className="px-3 py-2 bg-morning-mist text-deep-ocean text-xs font-medium rounded-lg hover:bg-shallow-pool/20 active:bg-shallow-pool/30 transition-colors"
                >
                  {dose.label} ({dose.mg}mg)
                </button>
              ))}
              <button
                onClick={() => openAddForType(type)}
                className="px-3 py-2 bg-still-water/10 text-still-water text-xs font-medium rounded-lg hover:bg-still-water/20 transition-colors"
              >
                + Custom
              </button>
            </div>

            {/* Today's logs for this type */}
            {todayLogs.filter(l => l.type === type).length > 0 && (
              <div className="mt-3 pt-3 border-t border-morning-mist">
                <p className="text-xs text-text-secondary mb-1">Today's entries:</p>
                <div className="space-y-1">
                  {todayLogs.filter(l => l.type === type).map(l => (
                    <div key={l.id} className="flex justify-between text-xs">
                      <span className="text-deep-ocean">{l.amount_mg}mg {l.source ? `(${l.source})` : ''}</span>
                      <span className="text-text-secondary">{formatLocalTime(l.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })}

      <CustomElectrolyteModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        type={selectedType}
        onSave={async (mg, source) => {
          await addElectrolyteLog(selectedType, mg, activeFast?.id, source);
          await loadToday();
          setShowAddModal(false);
        }}
      />
    </div>
  );
}

function CustomElectrolyteModal({ open, onClose, type, onSave }: {
  open: boolean;
  onClose: () => void;
  type: ElectrolyteType;
  onSave: (mg: number, source: string) => void;
}) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');

  const handleSave = () => {
    const mg = parseFloat(amount);
    if (!mg || mg <= 0) return;
    onSave(mg, source);
    setAmount('');
    setSource('');
  };

  return (
    <Modal open={open} onClose={onClose} title={`Add ${ELECTROLYTE_TARGETS[type].label}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-1">Amount (mg)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 500"
            className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-deep-ocean mb-1">Source (optional)</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. Pink salt in water"
            className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
          />
        </div>
        <Button onClick={handleSave} className="w-full">Add Entry</Button>
      </div>
    </Modal>
  );
}
