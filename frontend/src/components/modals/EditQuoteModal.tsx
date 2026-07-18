import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { inputClass, labelClass, btnPrimary, btnSecondary } from '../../utils/styles';
import { Quote } from '../../types';

interface EditQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote | null;
  onSave: (quoteId: number, data: { text: string; page: string; tags: string; characterName: string }) => Promise<void>;
  onTagLimitExceeded: () => void;
}

export default function EditQuoteModal({ isOpen, onClose, quote, onSave, onTagLimitExceeded }: EditQuoteModalProps) {
  const [formData, setFormData] = useState({ text: '', page: '', tags: '', characterName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && quote) {
      setFormData({
        text: quote.text || '',
        page: quote.page ? String(quote.page) : '',
        tags: quote.tags ? quote.tags.join(', ') : '',
        characterName: quote.characterName || '',
      });
    }
  }, [isOpen, quote]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!quote || !quote.id) return;
    
    const tagsArray = formData.tags.split(',')
      .map(t => t.trim())
      .filter(t => t);
    
    if (tagsArray.length > 5) {
      onTagLimitExceeded();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(quote.id, formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTagInvalid = formData.tags.split(',').length > 5;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Quote">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Quote text</label>
          <textarea
            required
            rows={4}
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className={`${inputClass} resize-none`}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex gap-3">
          <div className="w-1/3">
            <label className={labelClass}>Page</label>
            <input
              type="number"
              value={formData.page}
              onChange={(e) => setFormData({ ...formData, page: e.target.value })}
              className={inputClass}
              disabled={isSubmitting}
            />
          </div>
          <div className="w-2/3">
            <label className={labelClass}>
              Character <span className="text-slate-300 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.characterName}
              onChange={(e) => setFormData({ ...formData, characterName: e.target.value })}
              className={inputClass}
              placeholder="Who said this?"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Tags</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => {
              const val = e.target.value;
              if (val.split(',').length > 6) return;
              setFormData({ ...formData, tags: val });
            }}
            className={`${inputClass} ${
              isTagInvalid ? 'border-red-400 focus:border-red-500 text-red-600' : ''
            }`}
            placeholder="max 5, comma separated"
            disabled={isSubmitting}
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
