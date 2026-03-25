import { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { getAllJournalEntries } from '../../db/queries';
import { formatLocalDateTime } from '../../utils/conversions';
import type { JournalEntry } from '../../types';

interface JournalListProps {
  onCompose: () => void;
  refreshKey?: number;
}

export function JournalList({ onCompose, refreshKey }: JournalListProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getAllJournalEntries().then(setEntries);
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
                    <p className={`text-sm text-text-secondary ${isExpanded ? '' : 'line-clamp-2'}`}>
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

                {/* Photos */}
                {isExpanded && entry.photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {entry.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt=""
                        className="w-24 h-24 rounded-lg object-cover"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
