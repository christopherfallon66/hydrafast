import { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { getAllJournalEntries, deleteJournalEntry } from '../../db/queries';
import { formatLocalDateTime } from '../../utils/conversions';
import type { JournalEntry } from '../../types';

interface JournalListProps {
  onCompose: () => void;
  onEdit?: (entry: JournalEntry) => void;
  refreshKey?: number;
}

export function JournalList({ onCompose, onEdit, refreshKey }: JournalListProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadEntries = () => {
    getAllJournalEntries().then(setEntries);
  };

  useEffect(() => {
    loadEntries();
  }, [refreshKey]);

  const filtered = entries.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (e.title?.toLowerCase().includes(q)) ||
      e.body.toLowerCase().includes(q) ||
      e.tags.some(t => t.includes(q))
    );
  });

  const handleDelete = async (id: string) => {
    await deleteJournalEntry(id);
    setDeleteConfirm(null);
    setExpandedId(null);
    loadEntries();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-deep-ocean">Journal</h3>
        <button
          onClick={onCompose}
          className="px-3 py-1.5 bg-still-water text-white text-sm font-medium rounded-lg min-h-[44px]"
        >
          + New Entry
        </button>
      </div>

      {entries.length > 3 && (
        <div className="mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries or tags..."
            className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon="📝"
          title={entries.length === 0 ? 'No journal entries yet' : 'No matching entries'}
          message={entries.length === 0 ? 'Tap "New Entry" to start journaling your fasting experience.' : 'Try a different search term.'}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(entry => {
            const isExpanded = expandedId === entry.id;
            return (
              <Card
                key={entry.id}
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className="cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {entry.title && (
                      <h4 className="text-sm font-bold text-deep-ocean truncate">{entry.title}</h4>
                    )}
                    <p className={`text-sm text-text-secondary ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'}`}>
                      {entry.body}
                    </p>
                  </div>
                  <span className="text-[10px] text-text-secondary ml-2 flex-shrink-0">
                    {formatLocalDateTime(entry.timestamp)}
                  </span>
                </div>

                {/* Tags */}
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-morning-mist text-still-water text-[10px] rounded-full font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expanded: Photos + Actions */}
                {isExpanded && (
                  <div onClick={(e) => e.stopPropagation()}>
                    {/* Photos gallery */}
                    {entry.photos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {entry.photos.map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt=""
                            className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setLightboxPhoto(photo)}
                          />
                        ))}
                      </div>
                    )}

                    {/* Edit / Delete actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-morning-mist">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(entry)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-still-water bg-morning-mist rounded-lg min-h-[36px]"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(entry.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-danger bg-danger/10 rounded-lg min-h-[36px]"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Photo lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center text-xl"
            onClick={() => setLightboxPhoto(null)}
          >
            &times;
          </button>
          <img
            src={lightboxPhoto}
            alt=""
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Delete confirmation */}
      <Modal
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Entry?"
      >
        <p className="text-sm text-text-secondary mb-4">
          This journal entry will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="flex-1 py-2 text-sm text-text-secondary bg-morning-mist rounded-xl min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            className="flex-1 py-2 text-sm text-white bg-danger rounded-xl font-medium min-h-[44px]"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
