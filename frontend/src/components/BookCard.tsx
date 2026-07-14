import { Link } from 'react-router-dom';
import { Book } from '../types';
import { BookOpen, Hash } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const COVER_PALETTES = [
  { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-800', sub: 'text-indigo-400', icon: 'text-indigo-300', badge: 'bg-indigo-100 text-indigo-600' },
  { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-800', sub: 'text-amber-400', icon: 'text-amber-300', badge: 'bg-amber-100 text-amber-600' },
  { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-800', sub: 'text-emerald-400', icon: 'text-emerald-300', badge: 'bg-emerald-100 text-emerald-600' },
  { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-800', sub: 'text-rose-400', icon: 'text-rose-300', badge: 'bg-rose-100 text-rose-600' },
  { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-800', sub: 'text-sky-400', icon: 'text-sky-300', badge: 'bg-sky-100 text-sky-600' },
  { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-800', sub: 'text-violet-400', icon: 'text-violet-300', badge: 'bg-violet-100 text-violet-600' },
];

const getPalette = (title: string) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return COVER_PALETTES[Math.abs(hash) % COVER_PALETTES.length];
};

export default function BookCard({ book }: BookCardProps) {
  const palette = getPalette(book.title);
  const quoteCount = book.quotes?.length ?? 0;

  return (
    <Link
      to={`/book/${book.id}`}
      className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className={`relative overflow-hidden ${!book.coverUrl ? `${palette.bg} border-b ${palette.border}` : 'bg-slate-100'}`} style={{ height: '220px' }}>
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
                backgroundSize: '12px 12px',
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${palette.badge}`}>
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${palette.sub}`}>Book</p>
                <h3 className={`font-serif text-xl font-bold leading-snug line-clamp-3 ${palette.text}`}>
                  {book.title}
                </h3>
              </div>
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors duration-200">
            {book.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">{book.author}</p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          {quoteCount > 0 ? (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
              <Hash size={10} />
              {quoteCount} {quoteCount === 1 ? 'quote' : 'quotes'}
            </div>
          ) : (
            <span className="text-[11px] text-slate-300 italic">No quotes yet</span>
          )}
          <span className="text-[11px] font-bold text-brand-600 group-hover:underline">Open →</span>
        </div>
      </div>
    </Link>
  );
}
