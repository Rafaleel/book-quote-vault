import { useState } from 'react';
import Modal from '../ui/Modal';
import { btnSecondary, btnDanger } from '../../utils/styles';

interface DeleteBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  onConfirm: () => Promise<void>;
}

export default function DeleteBookModal({ isOpen, onClose, bookTitle, onConfirm }: DeleteBookModalProps) {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Book">
      <div className="space-y-4">
        <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">
          Are you sure you want to delete <strong className="text-slate-800 dark:text-white">{bookTitle}</strong> and all its quotes? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2.5 pt-1">
          <button type="button" onClick={onClose} className={btnSecondary} disabled={isDeleting}>
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} className={btnDanger} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete book'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
