import { useState } from 'react';
import Modal from '../ui/Modal';
import { btnSecondary, btnDanger } from '../../utils/styles';
import { Quote } from '../../types';

interface DeleteQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote | null;
  onConfirm: () => Promise<void>;
}

export default function DeleteQuoteModal({ isOpen, onClose, quote, onConfirm }: DeleteQuoteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Quote">
      <div className="space-y-4">
        <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">
          Are you sure you want to delete this quote? This action cannot be undone.
        </p>
        {quote && (
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 italic text-left">
            "{quote.text}"
          </div>
        )}
        <div className="flex justify-end gap-2.5 pt-1">
          <button type="button" onClick={onClose} className={btnSecondary} disabled={isDeleting}>
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} className={btnDanger} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete quote'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
