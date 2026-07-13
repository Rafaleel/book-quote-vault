import { Link } from 'react-router-dom';
import { Book } from '../types';

interface BookCardProps {
  book: Book & { color?: string };
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link to={`/book/${book.id}`} className="group relative block overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-80 flex flex-col cursor-pointer">
      <div className={`relative h-48 w-full ${book.color} overflow-hidden`}>
        {book.coverUrl ? (
          <img 
            src={book.coverUrl} 
            alt={`Cover of ${book.title}`} 
            className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
             <h3 className="font-serif text-2xl font-bold text-gray-800 drop-shadow-sm">{book.title}</h3>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between bg-white z-10 relative">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.author}</p>
        </div>
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
           <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">View Quotes</span>
        </div>
      </div>
    </Link>
  );
}
