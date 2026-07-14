import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3, BookOpen } from 'lucide-react';
import QuoteCard from '../components/QuoteCard';
import Modal from '../components/ui/Modal';
import api from '../services/api';
import { Book, Quote } from '../types';

const COVER_PALETTES = [
  { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700', icon: 'text-indigo-400' },
  { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', icon: 'text-amber-400' },
  { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-400' },
  { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', icon: 'text-rose-400' },
  { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-700', icon: 'text-sky-400' },
  { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', icon: 'text-purple-400' },
];

const getPalette = (title: string) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return COVER_PALETTES[Math.abs(hash) % COVER_PALETTES.length];
};

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddQuoteOpen, setIsAddQuoteOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({ text: '', page: '', tags: '', characterName: '' });

  const [isEditBookOpen, setIsEditBookOpen] = useState(false);
  const [editBookData, setEditBookData] = useState({ title: '', author: '', coverUrl: '' });

  const [isEditQuoteOpen, setIsEditQuoteOpen] = useState(false);
  const [editQuoteData, setEditQuoteData] = useState<{id: number | null, text: string, page: string, tags: string, characterName: string}>({ id: null, text: '', page: '', tags: '', characterName: '' });
  const [isDeleteBookOpen, setIsDeleteBookOpen] = useState(false);
  const [isTagLimitModalOpen, setIsTagLimitModalOpen] = useState(false);

  useEffect(() => {
    fetchBookData();
  }, [id]);

  const fetchBookData = async () => {
    try {
      setIsLoading(true);
      const [bookRes, quotesRes] = await Promise.all([
        api.get(`/books/${id}`),
        api.get(`/books/${id}/quotes`)
      ]);
      setBook(bookRes.data);
      setQuotes(quotesRes.data);
    } catch (error) {
      console.error("Error fetching book data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteBook = async () => {
    try {
      await api.delete(`/books/${id}`);
      navigate('/');
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book.");
    } finally {
      setIsDeleteBookOpen(false);
    }
  };

  const handleEditBookClick = () => {
    if (!book) return;
    setEditBookData({
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl || ''
    });
    setIsEditBookOpen(true);
  };

  const handleEditBookSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.put(`/books/${id}`, editBookData);
      setBook(response.data);
      setIsEditBookOpen(false);
    } catch (error) {
      console.error("Error editing book:", error);
      alert("Failed to edit book.");
    }
  };

  const handleAddQuote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const tagsArray = newQuote.tags.split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t);
      if (tagsArray.length > 5) {
        setIsTagLimitModalOpen(true);
        return;
      }
      const response = await api.post(`/books/${id}/quotes`, {
        text: newQuote.text,
        page: newQuote.page ? parseInt(newQuote.page) : null,
        tags: tagsArray,
        characterName: newQuote.characterName.trim() || null
      });
      setQuotes([response.data, ...quotes]);
      setNewQuote({ text: '', page: '', tags: '', characterName: '' });
      setIsAddQuoteOpen(false);
    } catch (error) {
      console.error("Error adding quote:", error);
      alert("Failed to add quote.");
    }
  };

  const handleDeleteQuote = async (quoteId: number) => {
    if(window.confirm("Are you sure you want to delete this quote?")) {
      try {
        await api.delete(`/books/${id}/quotes/${quoteId}`);
        setQuotes(quotes.filter(q => q.id !== quoteId));
      } catch (error) {
        console.error("Error deleting quote:", error);
        alert("Failed to delete quote.");
      }
    }
  };

  const handleEditQuoteClick = (quote: Quote) => {
    setEditQuoteData({
      id: quote.id || null,
      text: quote.text,
      page: quote.page ? String(quote.page) : '',
      tags: quote.tags ? quote.tags.join(', ') : '',
      characterName: quote.characterName || ''
    });
    setIsEditQuoteOpen(true);
  };

  const handleEditQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const tagsArray = editQuoteData.tags.split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t);
      if (tagsArray.length > 5) {
        setIsTagLimitModalOpen(true);
        return;
      }
      const response = await api.put(`/books/${id}/quotes/${editQuoteData.id}`, {
        text: editQuoteData.text,
        page: editQuoteData.page ? parseInt(editQuoteData.page) : null,
        tags: tagsArray,
        characterName: editQuoteData.characterName.trim() || null
      });
      setQuotes(quotes.map(q => q.id === editQuoteData.id ? response.data : q));
      setIsEditQuoteOpen(false);
    } catch (error) {
      console.error("Error editing quote:", error);
      alert("Failed to edit quote.");
    }
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading book details...</div>;
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
        <Link to="/" className="text-indigo-600 hover:underline">Return to Library</Link>
      </div>
    );
  }

  const isCustomCover = !book.coverUrl;
  const palette = getPalette(book.title);

  const inputClass = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white';
  const labelClass = 'block text-xs font-semibold text-slate-600 mb-1.5';
  const btnPrimary = 'px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors';
  const btnSecondary = 'px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors';
  const btnDanger = 'px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className={`w-full aspect-[3/4] max-w-[260px] mx-auto lg:mx-0 rounded-xl overflow-hidden border ${
            isCustomCover ? `${palette.bg} ${palette.border}` : 'border-slate-200 bg-slate-100'
          }`}>
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col justify-between p-7">
                <BookOpen className={`w-5 h-5 ${palette.icon}`} />
                <h3 className={`font-serif text-2xl font-bold leading-snug ${palette.text}`}>{book.title}</h3>
              </div>
            )}
          </div>
          
          <div className="space-y-4 text-center lg:text-left">
            <div>
              <h1 className="text-3xl font-bold font-serif text-slate-900 leading-tight mb-2">{book.title}</h1>
              <p className="text-lg text-slate-400 font-medium">{book.author}</p>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg text-center">
                <span className="block text-xl font-bold text-brand-600">{quotes.length}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quotes</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={handleEditBookClick} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all border border-transparent hover:border-brand-100" title="Edit Book">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => setIsDeleteBookOpen(true)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100" title="Delete Book">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsAddQuoteOpen(true)}
              className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus size={18} />
              Add New Quote
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-bold font-serif text-slate-900 mb-6">Saved Quotes</h2>
          {quotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {quotes.map(quote => {
                const isLong = quote.text.length > 250;
                return (
                  <div key={quote.id} className={isLong ? 'md:col-span-2' : ''}>
                    <QuoteCard quote={quote} onEdit={handleEditQuoteClick} onDelete={handleDeleteQuote} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 text-sm mb-3">No quotes saved for this book yet.</p>
              <button onClick={() => setIsAddQuoteOpen(true)} className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                Add the first one →
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isAddQuoteOpen} 
        onClose={() => setIsAddQuoteOpen(false)} 
        title="Add Quote"
      >
        <form onSubmit={handleAddQuote} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Quote text</label>
            <textarea required rows={4} value={newQuote.text} onChange={e => setNewQuote({...newQuote, text: e.target.value})} className={`${inputClass} resize-none`} placeholder="Type the quote here…" />
          </div>
          <div className="flex gap-3">
            <div className="w-1/3">
              <label className={labelClass}>Page</label>
              <input type="number" value={newQuote.page} onChange={e => setNewQuote({...newQuote, page: e.target.value})} className={inputClass} placeholder="e.g. 42" />
            </div>
            <div className="w-2/3">
              <label className={labelClass}>Character <span className="text-slate-300 font-normal">(Optional)</span></label>
              <input type="text" value={newQuote.characterName} onChange={e => setNewQuote({...newQuote, characterName: e.target.value})} className={inputClass} placeholder="Who said this?" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Tags</label>
            <input
              type="text"
              value={newQuote.tags}
              onChange={e => { const val = e.target.value; if (val.split(',').length > 6) return; setNewQuote({...newQuote, tags: val}); }}
              className={`${inputClass} ${ newQuote.tags.split(',').length > 5 ? 'border-red-400 focus:border-red-500 text-red-600' : '' }`}
              placeholder="max 5, comma separated"
            />
          </div>
          <div className="flex justify-end gap-2.5 pt-1">
            <button type="button" onClick={() => setIsAddQuoteOpen(false)} className={btnSecondary}>Cancel</button>
            <button type="submit" className={btnPrimary}>Save Quote</button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isEditBookOpen} 
        onClose={() => setIsEditBookOpen(false)} 
        title="Edit Book Details"
      >
        <form onSubmit={handleEditBookSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Title</label>
            <input required type="text" value={editBookData.title} onChange={e => setEditBookData({...editBookData, title: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Author</label>
            <input required type="text" value={editBookData.author} onChange={e => setEditBookData({...editBookData, author: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cover Image URL <span className="text-slate-300 font-normal">(Optional)</span></label>
            <input type="url" value={editBookData.coverUrl} onChange={e => setEditBookData({...editBookData, coverUrl: e.target.value})} className={inputClass} placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-2.5 pt-1">
            <button type="button" onClick={() => setIsEditBookOpen(false)} className={btnSecondary}>Cancel</button>
            <button type="submit" className={btnPrimary}>Save Changes</button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isEditQuoteOpen} 
        onClose={() => setIsEditQuoteOpen(false)} 
        title="Edit Quote"
      >
        <form onSubmit={handleEditQuoteSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Quote text</label>
            <textarea required rows={4} value={editQuoteData.text} onChange={e => setEditQuoteData({...editQuoteData, text: e.target.value})} className={`${inputClass} resize-none`} />
          </div>
          <div className="flex gap-3">
            <div className="w-1/3">
              <label className={labelClass}>Page</label>
              <input type="number" value={editQuoteData.page} onChange={e => setEditQuoteData({...editQuoteData, page: e.target.value})} className={inputClass} />
            </div>
            <div className="w-2/3">
              <label className={labelClass}>Character <span className="text-slate-300 font-normal">(Optional)</span></label>
              <input type="text" value={editQuoteData.characterName} onChange={e => setEditQuoteData({...editQuoteData, characterName: e.target.value})} className={inputClass} placeholder="Who said this?" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Tags</label>
            <input
              type="text"
              value={editQuoteData.tags}
              onChange={e => { const val = e.target.value; if (val.split(',').length > 6) return; setEditQuoteData({...editQuoteData, tags: val}); }}
              className={`${inputClass} ${ editQuoteData.tags.split(',').length > 5 ? 'border-red-400 focus:border-red-500 text-red-600' : '' }`}
              placeholder="max 5, comma separated"
            />
          </div>
          <div className="flex justify-end gap-2.5 pt-1">
            <button type="button" onClick={() => setIsEditQuoteOpen(false)} className={btnSecondary}>Cancel</button>
            <button type="submit" className={btnPrimary}>Save Changes</button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isDeleteBookOpen} 
        onClose={() => setIsDeleteBookOpen(false)} 
        title="Delete Book"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 leading-relaxed">
            Are you sure you want to delete <strong className="text-slate-800">{book.title}</strong> and all its quotes? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2.5 pt-1">
            <button type="button" onClick={() => setIsDeleteBookOpen(false)} className={btnSecondary}>Cancel</button>
            <button type="button" onClick={confirmDeleteBook} className={btnDanger}>Delete book</button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isTagLimitModalOpen} 
        onClose={() => setIsTagLimitModalOpen(false)} 
        title="Tag Limit Exceeded"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 leading-relaxed">
            A maximum of <strong className="text-slate-800">5 tags</strong> is allowed per quote. Please remove the extra tags and try again.
          </p>
          <div className="flex justify-end pt-1">
            <button type="button" onClick={() => setIsTagLimitModalOpen(false)} className={btnPrimary}>Got it</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
