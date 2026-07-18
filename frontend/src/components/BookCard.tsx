import { Link } from 'react-router-dom';
import { Book } from '../types';
import { BookOpen, Hash } from 'lucide-react';
import { getPalette } from '../utils/coverPalette';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const palette = getPalette(book.title);
  const quoteCount = book.quotes?.length ?? 0;

  return (
    <Link
      to={`/book/${book.id}`}
      className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-950/55 hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className={`relative overflow-hidden ${!book.coverUrl ? `${palette.bg} border-b ${palette.border}` : 'bg-slate-100 dark:bg-slate-800'}`} style={{ height: '220px' }}>
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03]"
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
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 dark:group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
            {book.title}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{book.author}</p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {quoteCount > 0 ? (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              <Hash size={10} />
              {quoteCount} {quoteCount === 1 ? 'quote' : 'quotes'}
            </div>
          ) : (
            <span className="text-[11px] text-slate-300 dark:text-slate-600 italic">No quotes yet</span>
          )}
          <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 group-hover:underline">Open →</span>
        </div>
      </div>
    </Link>
  );
}
