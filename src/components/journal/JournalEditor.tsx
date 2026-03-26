import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useFastStore } from '../../store/fastStore';
import { addJournalEntry, updateJournalEntry } from '../../db/queries';
import type { JournalEntry } from '../../types';

interface JournalEditorProps {
  onSaved: () => void;
  onCancel: () => void;
  editEntry?: JournalEntry | null;
}

const SUGGESTED_TAGS = ['motivation', 'struggle', 'ketosis', 'refeeding', 'energy', 'clarity', 'hunger', 'milestone'];

export function JournalEditor({ onSaved, onCancel, editEntry }: JournalEditorProps) {
  const { activeFast } = useFastStore();
  const [title, setTitle] = useState(editEntry?.title || '');
  const [body, setBody] = useState(editEntry?.body || '');
  const [tags, setTags] = useState<string[]>(editEntry?.tags || []);
  const [customTag, setCustomTag] = useState('');
  const [photos, setPhotos] = useState<string[]>(editEntry?.photos || []);

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addCustomTag = () => {
    const tag = customTag.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setCustomTag('');
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPhotos(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!body.trim()) return;
    if (editEntry) {
      await updateJournalEntry(editEntry.id, {
        title: title.trim() || null,
        body: body.trim(),
        tags,
        photos,
      });
    } else {
      await addJournalEntry({
        fast_session_id: activeFast?.id ?? null,
        title: title.trim() || null,
        body: body.trim(),
        tags,
        photos,
      });
    }
    onSaved();
  };

  return (
    <Card>
      <h3 className="text-sm font-bold text-deep-ocean mb-3">
        {editEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
      </h3>

      <div className="space-y-3">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title (optional)"
          className="w-full bg-glacier border border-morning-mist rounded-lg px-3 py-2 text-sm text-deep-ocean"
        />

        {/* Body */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="How are you feeling? What's on your mind?"
          className="w-full bg-glacier border border-morning-mist rounded-xl px-3 py-2 text-sm text-deep-ocean resize-none h-32"
        />

        {/* Tags */}
        <div>
          <label className="block text-xs text-text-secondary mb-2">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {SUGGESTED_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  tags.includes(tag) ? 'bg-still-water text-white' : 'bg-morning-mist text-text-secondary'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
              placeholder="Add custom tag"
              className="flex-1 bg-glacier border border-morning-mist rounded-lg px-3 py-1.5 text-xs text-deep-ocean"
            />
            <button onClick={addCustomTag} className="text-still-water text-xs font-medium min-w-[44px]">Add</button>
          </div>
          {tags.filter(t => !SUGGESTED_TAGS.includes(t)).map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-still-water text-white mt-1 mr-1">
              #{tag}
              <button onClick={() => toggleTag(tag)} className="hover:text-morning-mist">&times;</button>
            </span>
          ))}
        </div>

        {/* Photos */}
        <div>
          <label className="block text-xs text-text-secondary mb-2">Photos</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {photos.map((photo, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-danger text-white rounded-full text-xs flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
            {/* Camera capture button */}
            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-morning-mist flex flex-col items-center justify-center cursor-pointer hover:border-still-water transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span className="text-[9px] text-text-secondary mt-0.5">Camera</span>
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoAdd} className="hidden" />
            </label>
            {/* Gallery pick button */}
            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-morning-mist flex flex-col items-center justify-center cursor-pointer hover:border-still-water transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-[9px] text-text-secondary mt-0.5">Gallery</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotoAdd} className="hidden" />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} disabled={!body.trim()} className="flex-1">
            {editEntry ? 'Update Entry' : 'Save Entry'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
