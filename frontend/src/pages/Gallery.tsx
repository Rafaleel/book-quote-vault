import { useState, useEffect } from 'react';
import { Plus, Search, Library } from 'lucide-react';
import BookCard from '../components/BookCard';
import Modal from '../components/ui/Modal';
import api from '../services/api';
import { Book } from '../types';

export default function Gallery() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '', coverUrl: '' });

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/books', newBook);
      setBooks([response.data, ...books]);
      setNewBook({ title: '', author: '', coverUrl: '' });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Make sure the backend is running.');
    }
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1.5';

  return (
    <div className="w-full px-5 sm:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">My Library</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {!isLoading && `${books.length} ${books.length === 1 ? 'book' : 'books'} in your collection`}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search books…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white w-56"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Book
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
              <div className="bg-slate-100" style={{ height: '220px' }} />
              <div className="p-5 space-y-2.5">
                <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredBooks.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      ) : (
        <div className="text-center py-28 border border-dashed border-slate-200 rounded-2xl bg-white">
          <Library className="w-9 h-9 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-400">
            {searchQuery ? 'No books matched your search.' : 'Your library is empty.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-3 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Add your first book →
            </button>
          )}
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Book">
        <form onSubmit={handleAddBook} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Title</label>
            <input required type="text" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} className={inputClass} placeholder="e.g. Meditations" />
          </div>
          <div>
            <label className={labelClass}>Author</label>
            <input required type="text" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} className={inputClass} placeholder="e.g. Marcus Aurelius" />
          </div>
          <div>
            <label className={labelClass}>Cover URL <span className="text-slate-300 font-normal">(Optional)</span></label>
            <input type="url" value={newBook.coverUrl} onChange={e => setNewBook({ ...newBook, coverUrl: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-2.5 pt-1">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors">Add Book</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
