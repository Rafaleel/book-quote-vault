import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3 } from 'lucide-react';
import QuoteCard from '../components/QuoteCard';
import Modal from '../components/ui/Modal';
import api from '../services/api';
import { Book, Quote } from '../types';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddQuoteOpen, setIsAddQuoteOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({ text: '', page: '', tags: '' });

  const [isEditBookOpen, setIsEditBookOpen] = useState(false);
  const [editBookData, setEditBookData] = useState({ title: '', author: '', coverUrl: '' });

  const [isEditQuoteOpen, setIsEditQuoteOpen] = useState(false);
  const [editQuoteData, setEditQuoteData] = useState<{id: number | null, text: string, page: string, tags: string}>({ id: null, text: '', page: '', tags: '' });

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

  const handleDeleteBook = async () => {
    if(window.confirm("Are you sure you want to delete this book and all its quotes?")) {
      try {
        await api.delete(`/books/${id}`);
        navigate('/');
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book.");
      }
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
      const tagsArray = newQuote.tags.split(',').map(t => t.trim()).filter(t => t);
      const response = await api.post(`/books/${id}/quotes`, {
        text: newQuote.text,
        page: newQuote.page ? parseInt(newQuote.page) : null,
        tags: tagsArray
      });
      setQuotes([response.data, ...quotes]);
      setNewQuote({ text: '', page: '', tags: '' });
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
      tags: quote.tags ? quote.tags.join(', ') : ''
    });
    setIsEditQuoteOpen(true);
  };

  const handleEditQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const tagsArray = editQuoteData.tags.split(',').map(t => t.trim()).filter(t => t);
      const response = await api.put(`/books/${id}/quotes/${editQuoteData.id}`, {
        text: editQuoteData.text,
        page: editQuoteData.page ? parseInt(editQuoteData.page) : null,
        tags: tagsArray
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft size={16} />
        Back to Library
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className={`w-full md:w-64 h-80 md:h-96 shrink-0 rounded-2xl overflow-hidden shadow-lg border border-gray-100 ${book.color || 'bg-gray-100'}`}>
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center p-6 text-center">
               <h3 className="font-serif text-3xl font-bold text-gray-800 drop-shadow-sm">{book.title}</h3>
             </div>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 leading-tight">{book.title}</h1>
          <p className="text-xl text-gray-500 mb-6">{book.author}</p>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 text-center">
              <span className="block text-2xl font-bold text-indigo-600">{quotes.length}</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Quotes</span>
            </div>
            
            <div className="flex gap-2">
              <button onClick={handleEditBookClick} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Book">
                <Edit3 size={20} />
              </button>
              <button onClick={handleDeleteBook} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Book">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAddQuoteOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow"
          >
            <Plus size={18} />
            Add New Quote
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Quotes</h2>
        {quotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotes.map(quote => (
              <QuoteCard 
                key={quote.id} 
                quote={quote} 
                onEdit={handleEditQuoteClick}
                onDelete={handleDeleteQuote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">No quotes saved for this book yet.</p>
            <button 
              onClick={() => setIsAddQuoteOpen(true)}
              className="text-indigo-600 font-medium hover:underline"
            >
              Be the first to add one
            </button>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isAddQuoteOpen} 
        onClose={() => setIsAddQuoteOpen(false)} 
        title="Add Quote"
      >
        <form onSubmit={handleAddQuote} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quote Text</label>
            <textarea 
              required
              rows={4}
              value={newQuote.text}
              onChange={e => setNewQuote({...newQuote, text: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              placeholder="Type the quote here..."
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
              <input 
                type="number" 
                value={newQuote.page}
                onChange={e => setNewQuote({...newQuote, page: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="e.g. 42"
              />
            </div>
            <div className="w-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input 
                type="text" 
                value={newQuote.tags}
                onChange={e => setNewQuote({...newQuote, tags: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Comma separated (e.g. Habits, Focus)"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsAddQuoteOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              Save Quote
            </button>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              required
              type="text" 
              value={editBookData.title}
              onChange={e => setEditBookData({...editBookData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input 
              required
              type="text" 
              value={editBookData.author}
              onChange={e => setEditBookData({...editBookData, author: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input 
              type="url" 
              value={editBookData.coverUrl}
              onChange={e => setEditBookData({...editBookData, coverUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          
          <div className="mt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsEditBookOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              Save Changes
            </button>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Quote Text</label>
            <textarea 
              required
              rows={4}
              value={editQuoteData.text}
              onChange={e => setEditQuoteData({...editQuoteData, text: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
              <input 
                type="number" 
                value={editQuoteData.page}
                onChange={e => setEditQuoteData({...editQuoteData, page: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="w-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input 
                type="text" 
                value={editQuoteData.tags}
                onChange={e => setEditQuoteData({...editQuoteData, tags: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Comma separated (e.g. Habits, Focus)"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsEditQuoteOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
