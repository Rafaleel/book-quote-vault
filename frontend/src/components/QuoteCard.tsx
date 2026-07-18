import { Tag, Edit3, Trash2 } from 'lucide-react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote & { tags?: string[] };
  onEdit: (quote: Quote) => void;
  onDelete: (id: number) => void;
}

export default function QuoteCard({ quote, onEdit, onDelete }: QuoteCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 relative group flex flex-col justify-between h-full transition-colors duration-200">
      <div
        aria-hidden
        className="absolute top-0 left-4 text-[96px] leading-none font-serif text-slate-100 dark:text-slate-800/30 select-none pointer-events-none"
        style={{ fontFamily: 'Georgia, serif', lineHeight: 1 }}
      >
        "
      </div>

      <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex gap-1 z-10">
        <button
          onClick={() => onEdit(quote)}
          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-brand-55 bg-white/90 dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700 transition-colors shadow-sm"
          title="Edit Quote"
        >
          <Edit3 size={12} />
        </button>
        <button
          onClick={() => quote.id && onDelete(quote.id)}
          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 bg-white/90 dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700 transition-colors shadow-sm"
          title="Delete Quote"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="px-6 pt-10 pb-4 relative z-[1]">
        <p className="text-slate-800 dark:text-slate-200 text-[15px] font-serif italic leading-relaxed tracking-[0.01em]">
          {quote.text}
        </p>

        {quote.characterName && (
          <p className="mt-3 text-sm font-serif text-slate-400 dark:text-slate-500 text-right font-medium">
            — {quote.characterName}
          </p>
        )}
      </div>

      <div className="px-6 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap mt-auto">
        <div className="flex items-center gap-1.5 flex-wrap">
          {quote.tags && quote.tags.length > 0 ? (
            <>
              <Tag size={10} className="text-slate-300 dark:text-slate-650 shrink-0" />
              {quote.tags.slice(0, 5).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-[10px] px-2 py-0.5 rounded font-bold tracking-wider uppercase"
                >
                  {tag}
                </span>
              ))}
            </>
          ) : (
            <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">No tags</span>
          )}
        </div>
        {quote.page && (
          <span className="text-[10px] font-bold text-slate-300 dark:text-slate-500 shrink-0 tabular-nums">
            p.{quote.page}
          </span>
        )}
      </div>
    </div>
  );
}
