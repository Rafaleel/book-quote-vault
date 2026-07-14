import { Tag, Edit3, Trash2 } from 'lucide-react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote & { tags?: string[] };
  onEdit: (quote: Quote) => void;
  onDelete: (id: number) => void;
}

export default function QuoteCard({ quote, onEdit, onDelete }: QuoteCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 relative group flex flex-col justify-between min-h-[180px]">
      <div
        aria-hidden
        className="absolute top-0 left-4 text-[96px] leading-none font-serif text-slate-100 select-none pointer-events-none"
        style={{ fontFamily: 'Georgia, serif', lineHeight: 1 }}
      >
        "
      </div>

      <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex gap-1 z-10">
        <button
          onClick={() => onEdit(quote)}
          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 bg-white/90 border border-slate-100 transition-colors shadow-sm"
          title="Edit Quote"
        >
          <Edit3 size={12} />
        </button>
        <button
          onClick={() => quote.id && onDelete(quote.id)}
          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 bg-white/90 border border-slate-100 transition-colors shadow-sm"
          title="Delete Quote"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="px-6 pt-10 pb-4 relative z-[1]">
        <p className="text-slate-800 text-[15px] font-serif italic leading-relaxed tracking-[0.01em]">
          {quote.text}
        </p>

        {quote.characterName && (
          <p className="mt-3 text-sm font-serif text-slate-400 text-right font-medium">
            — {quote.characterName}
          </p>
        )}
      </div>

      <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap mt-auto">
        <div className="flex items-center gap-1.5 flex-wrap">
          {quote.tags && quote.tags.length > 0 ? (
            <>
              <Tag size={10} className="text-slate-300 shrink-0" />
              {quote.tags.slice(0, 5).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-brand-50 text-brand-600 text-[10px] px-2 py-0.5 rounded font-bold tracking-wider uppercase"
                >
                  {tag}
                </span>
              ))}
            </>
          ) : (
            <span className="text-[10px] text-slate-300 italic">No tags</span>
          )}
        </div>
        {quote.page && (
          <span className="text-[10px] font-bold text-slate-300 shrink-0 tabular-nums">
            p.{quote.page}
          </span>
        )}
      </div>
    </div>
  );
}
