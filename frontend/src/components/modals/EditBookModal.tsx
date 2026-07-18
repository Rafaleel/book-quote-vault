import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { inputClass, labelClass, btnPrimary, btnSecondary } from '../../utils/styles';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: { title: string; author: string; coverUrl: string };
  onSave: (data: { title: string; author: string; coverUrl: string }) => Promise<void>;
}

export default function EditBookModal({ isOpen, onClose, initialData, onSave }: EditBookModalProps) {
  const [formData, setFormData] = useState({ title: '', author: '', coverUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        coverUrl: initialData.coverUrl || '',
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Book Details">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input
            required
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Author</label>
          <input
            required
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            Cover Image URL <span className="text-slate-300 dark:text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            value={formData.coverUrl}
            onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
        <div className="flex justify-end gap-2.5 pt-1">
          <button type="button" onClick={onClose} className={btnSecondary} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
