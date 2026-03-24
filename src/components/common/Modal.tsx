import type { ReactNode } from 'react';
import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  fullScreen?: boolean;
}

export function Modal({ open, onClose, children, title, fullScreen = false }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-deep-ocean/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-surface rounded-2xl shadow-xl ${fullScreen ? 'w-full h-full rounded-none' : 'mx-4 max-w-lg w-full max-h-[90vh] overflow-y-auto'} p-6`}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-deep-ocean">{title}</h2>
            <button onClick={onClose} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-deep-ocean">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
