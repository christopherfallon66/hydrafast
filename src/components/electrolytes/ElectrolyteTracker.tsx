import { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ELECTROLYTE_TARGETS, ELECTROLYTE_QUICK_DOSES, DEFICIENCY_SYMPTOMS } from '../../constants/electrolytes';
import { getElectrolyteLogsForDay, addElectrolyteLog, getAllSupplements, logSupplementServing, addSupplement, updateSupplement, deleteSupplement } from '../../db/queries';
import { useFastStore } from '../../store/fastStore';
import { formatLocalTime } from '../../utils/conversions';
import type { ElectrolyteLog, Supplement } from '../../types';

type ElectrolyteType = 'sodium' | 'potassium' | 'magnesium';

export function ElectrolyteTracker() {
  const { activeFast } = useFastStore();
  const [todayLogs, setTodayLogs] = useState<ElectrolyteLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<ElectrolyteType>('sodium');
  const [showInfo, setShowInfo] = useState<ElectrolyteType | null>(null);
  const [showSupplementModal, setShowSupplementModal] = useState(false);
  const [showManageSupplements, setShowManageSupplements] = useState(false);
  const [supplements, setSupplements] = useState<Supplement[]>([]);

  const loadToday = async () => {
    const logs = await getElectrolyteLogsForDay(new Date());
    setTodayLogs(logs);
  };

  const loadSupplements = async () => {
    const s = await getAllSupplements();
    setSupplements(s);
  };

  useEffect(() => {
    loadToday();
    loadSupplements();
  }, []);

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
      {/* Log Supplement button */}
      <div className="flex gap-2">
        <Button
          onClick={() => supplements.length > 0 ? setShowSupplementModal(true) : setShowManageSupplements(true)}
          className="flex-1"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-2">
            <path d="M9 2h6l3 7H6L9 2z" />
            <rect x="5" y="9" width="14" height="13" rx="2" />
            <path d="M12 13v4M10 15h4" />
          </svg>
          Log Supplement
        </Button>
        <button
          onClick={() => setShowManageSupplements(true)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-morning-mist text-deep-ocean rounded-xl hover:bg-shallow-pool/20 transition-colors"
          title="Manage Supplements"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

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

      <LogSupplementModal
        open={showSupplementModal}
        onClose={() => setShowSupplementModal(false)}
        supplements={supplements}
        onLog={async (supplement, servings) => {
          await logSupplementServing(supplement, servings, activeFast?.id);
          await loadToday();
          setShowSupplementModal(false);
        }}
        onManage={() => {
          setShowSupplementModal(false);
          setShowManageSupplements(true);
        }}
      />

      <ManageSupplementsModal
        open={showManageSupplements}
        onClose={() => setShowManageSupplements(false)}
        supplements={supplements}
        onRefresh={loadSupplements}
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

function LogSupplementModal({ open, onClose, supplements, onLog, onManage }: {
  open: boolean;
  onClose: () => void;
  supplements: Supplement[];
  onLog: (supplement: Supplement, servings: number) => void;
  onManage: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [servings, setServings] = useState('1');

  useEffect(() => {
    if (open && supplements.length > 0 && !selectedId) {
      setSelectedId(supplements[0].id);
    }
  }, [open, supplements, selectedId]);

  const selected = supplements.find(s => s.id === selectedId);
  const servingCount = parseFloat(servings) || 1;

  const handleLog = () => {
    if (!selected) return;
    onLog(selected, servingCount);
    setServings('1');
  };

  return (
    <Modal open={open} onClose={onClose} title="Log Supplement">
      <div className="space-y-4">
        {supplements.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-text-secondary text-sm mb-3">No supplements saved yet.</p>
            <Button onClick={onManage}>Add Your First Supplement</Button>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-deep-ocean mb-2">Choose supplement</label>
              <div className="space-y-2">
                {supplements.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-colors ${
                      selectedId === s.id
                        ? 'border-still-water bg-morning-mist'
                        : 'border-morning-mist bg-white hover:border-shallow-pool'
                    }`}
                  >
                    <p className="font-medium text-deep-ocean text-sm">{s.name}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Per {s.serving_label}: {s.sodium_mg > 0 ? `${s.sodium_mg}mg Na` : ''}{s.potassium_mg > 0 ? ` · ${s.potassium_mg}mg K` : ''}{s.magnesium_mg > 0 ? ` · ${s.magnesium_mg}mg Mg` : ''}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-deep-ocean mb-1">
                Servings ({selected?.serving_label || 'servings'})
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setServings(String(Math.max(0.5, servingCount - 0.5)))}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-morning-mist text-deep-ocean rounded-xl text-lg font-bold"
                >
                  −
                </button>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-20 text-center bg-glacier border border-morning-mist rounded-lg px-2 py-2 text-lg font-bold text-deep-ocean"
                  min="0.5"
                  step="0.5"
                />
                <button
                  onClick={() => setServings(String(servingCount + 0.5))}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-morning-mist text-deep-ocean rounded-xl text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {selected && (
              <div className="bg-morning-mist rounded-xl p-3">
                <p className="text-xs font-medium text-deep-ocean mb-2">Will log:</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {selected.sodium_mg > 0 && (
                    <div>
                      <p className="text-lg font-bold text-deep-ocean">{Math.round(selected.sodium_mg * servingCount)}</p>
                      <p className="text-xs text-text-secondary">mg Sodium</p>
                    </div>
                  )}
                  {selected.potassium_mg > 0 && (
                    <div>
                      <p className="text-lg font-bold text-deep-ocean">{Math.round(selected.potassium_mg * servingCount)}</p>
                      <p className="text-xs text-text-secondary">mg Potassium</p>
                    </div>
                  )}
                  {selected.magnesium_mg > 0 && (
                    <div>
                      <p className="text-lg font-bold text-deep-ocean">{Math.round(selected.magnesium_mg * servingCount)}</p>
                      <p className="text-xs text-text-secondary">mg Magnesium</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button onClick={handleLog} className="w-full">
              Log {servingCount} {(selected?.serving_label || 'serving').replace(/^\d+\s*/, '')}{servingCount !== 1 ? 's' : ''}
            </Button>

            <button
              onClick={onManage}
              className="w-full text-center text-sm text-still-water py-2"
            >
              Manage Supplements
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

function ManageSupplementsModal({ open, onClose, supplements, onRefresh }: {
  open: boolean;
  onClose: () => void;
  supplements: Supplement[];
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<Supplement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [servingLabel, setServingLabel] = useState('scoop');
  const [sodium, setSodium] = useState('');
  const [potassium, setPotassium] = useState('');
  const [magnesium, setMagnesium] = useState('');

  const resetForm = () => {
    setName('');
    setServingLabel('1 scoop');
    setSodium('');
    setPotassium('');
    setMagnesium('');
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (s: Supplement) => {
    setEditing(s);
    setName(s.name);
    setServingLabel(s.serving_label);
    setSodium(String(s.sodium_mg));
    setPotassium(String(s.potassium_mg));
    setMagnesium(String(s.magnesium_mg));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    const data = {
      name: name.trim(),
      serving_label: servingLabel.trim() || 'serving',
      sodium_mg: parseFloat(sodium) || 0,
      potassium_mg: parseFloat(potassium) || 0,
      magnesium_mg: parseFloat(magnesium) || 0,
    };

    if (editing) {
      await updateSupplement(editing.id, data);
    } else {
      await addSupplement(data);
    }
    await onRefresh();
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deleteSupplement(id);
    await onRefresh();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="My Supplements">
      <div className="space-y-4">
        {!showForm ? (
          <>
            {supplements.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">💊</div>
                <p className="text-text-secondary text-sm mb-1">No supplements saved yet.</p>
                <p className="text-text-secondary text-xs mb-4">
                  Add your electrolyte supplement once, then log it with one tap.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {supplements.map(s => (
                  <div key={s.id} className="bg-morning-mist rounded-xl p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-deep-ocean text-sm">{s.name}</p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          Per {s.serving_label}:
                        </p>
                        <div className="flex gap-3 mt-1 text-xs text-text-secondary">
                          {s.sodium_mg > 0 && <span>{s.sodium_mg}mg Na</span>}
                          {s.potassium_mg > 0 && <span>{s.potassium_mg}mg K</span>}
                          {s.magnesium_mg > 0 && <span>{s.magnesium_mg}mg Mg</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(s)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-still-water"
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-danger"
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={() => setShowForm(true)} className="w-full">
              + Add Supplement
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-text-secondary">
              Enter the electrolyte amounts per serving from your supplement label.
            </p>
            <div>
              <label className="block text-sm font-medium text-deep-ocean mb-1">Supplement Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Junp Hydration"
                className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-ocean mb-1">Serving Size Label</label>
              <input
                type="text"
                value={servingLabel}
                onChange={(e) => setServingLabel(e.target.value)}
                placeholder="e.g. scoop, capsule, tablet"
                className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-deep-ocean mb-1">Sodium (mg)</label>
                <input
                  type="number"
                  value={sodium}
                  onChange={(e) => setSodium(e.target.value)}
                  placeholder="0"
                  className="w-full bg-glacier border border-morning-mist rounded-lg px-2 py-2 text-sm text-deep-ocean text-center"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-deep-ocean mb-1">Potassium (mg)</label>
                <input
                  type="number"
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  placeholder="0"
                  className="w-full bg-glacier border border-morning-mist rounded-lg px-2 py-2 text-sm text-deep-ocean text-center"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-deep-ocean mb-1">Magnesium (mg)</label>
                <input
                  type="number"
                  value={magnesium}
                  onChange={(e) => setMagnesium(e.target.value)}
                  placeholder="0"
                  className="w-full bg-glacier border border-morning-mist rounded-lg px-2 py-2 text-sm text-deep-ocean text-center"
                  min="0"
                />
              </div>
            </div>

            {/* Preview */}
            {(parseFloat(sodium) > 0 || parseFloat(potassium) > 0 || parseFloat(magnesium) > 0) && (
              <div className="bg-seafoam rounded-xl p-3">
                <p className="text-xs font-medium text-deep-ocean">Per {servingLabel || 'serving'}:</p>
                <div className="flex gap-3 mt-1 text-xs text-text-secondary">
                  {parseFloat(sodium) > 0 && <span>{sodium}mg Sodium</span>}
                  {parseFloat(potassium) > 0 && <span>{potassium}mg Potassium</span>}
                  {parseFloat(magnesium) > 0 && <span>{magnesium}mg Magnesium</span>}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className="flex-1 py-2 text-sm text-text-secondary bg-morning-mist rounded-xl"
              >
                Cancel
              </button>
              <Button onClick={handleSave} className="flex-1">
                {editing ? 'Update' : 'Save Supplement'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
