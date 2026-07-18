import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3, BookOpen } from 'lucide-react';
import QuoteCard from '../components/QuoteCard';
import Modal from '../components/ui/Modal';
import { useBookDetails } from '../hooks/useBookDetails';
import { getPalette } from '../utils/coverPalette';
import { btnPrimary } from '../utils/styles';

// Modals
import EditBookModal from '../components/modals/EditBookModal';
import DeleteBookModal from '../components/modals/DeleteBookModal';
import AddQuoteModal from '../components/modals/AddQuoteModal';
import EditQuoteModal from '../components/modals/EditQuoteModal';
import DeleteQuoteModal from '../components/modals/DeleteQuoteModal';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    book,
    quotes,
    paginatedQuotes,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,

    // Modal state controllers
    isAddQuoteOpen,
    setIsAddQuoteOpen,
    isEditBookOpen,
    setIsEditBookOpen,
    isEditQuoteOpen,
    setIsEditQuoteOpen,
    isDeleteBookOpen,
    setIsDeleteBookOpen,
    isTagLimitModalOpen,
    setIsTagLimitModalOpen,

    // Target items
    quoteToDelete,
    setQuoteToDelete,
    quoteToEdit,

    // Action Handlers
    handleEditBookSave,
    handleDeleteBookConfirm,
    handleAddQuoteSave,
    handleEditQuoteSave,
    handleDeleteQuoteConfirm,
    handleEditQuoteClick,
    handleDeleteQuoteClick,
  } = useBookDetails(id, () => navigate('/'));

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 dark:text-slate-400">Loading book details...</div>;
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Book not found</h2>
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">Return to Library</Link>
      </div>
    );
  }

  const isCustomCover = !book.coverUrl;
  const palette = getPalette(book.title);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-200">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left Column: Cover & Actions */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col items-center lg:items-start gap-6 w-full max-w-[250px] mx-auto lg:mx-0">
          <div className={`w-[250px] h-[340px] shrink-0 rounded-xl overflow-hidden border ${isCustomCover ? `${palette.bg} ${palette.border}` : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800'
            }`}>
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover shrink-0" />
            ) : (
              <div className="w-full h-full flex flex-col justify-between p-7 shrink-0">
                <BookOpen className={`w-5 h-5 ${palette.icon}`} />
                <h3 className={`font-serif text-2xl font-bold leading-snug ${palette.text}`}>{book.title}</h3>
              </div>
            )}
          </div>

          <div className="space-y-4 text-center lg:text-left w-full">
            <div>
              <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white leading-tight mb-2 break-words">{book.title}</h1>
              <p className="text-lg text-slate-400 dark:text-slate-500 font-medium break-words">{book.author}</p>
            </div>

            <div className="flex items-center justify-between gap-3 w-full">
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-center flex-1">
                <span className="block text-xl font-bold text-brand-600 dark:text-brand-400">{quotes.length}</span>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quotes</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => setIsEditBookOpen(true)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/20 rounded-lg transition-all border border-transparent hover:border-brand-100 dark:hover:border-brand-900/30" title="Edit Book">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => setIsDeleteBookOpen(true)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30" title="Delete Book">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsAddQuoteOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus size={18} />
              Add New Quote
            </button>
          </div>
        </div>

        {/* Right Column: Quotes Grid & Pagination */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-6">Saved Quotes</h2>
          {quotes.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {paginatedQuotes.map(quote => {
                  const isLong = quote.text.length > 250;
                  return (
                    <div key={quote.id} className={isLong ? 'md:col-span-2' : ''}>
                      <QuoteCard quote={quote} onEdit={handleEditQuoteClick} onDelete={handleDeleteQuoteClick} />
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum
                          ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/10'
                          : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-slate-400 dark:text-slate-500 text-sm mb-3">No quotes saved for this book yet.</p>
              <button onClick={() => setIsAddQuoteOpen(true)} className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                Add the first one →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-component Modals */}
      <AddQuoteModal
        isOpen={isAddQuoteOpen}
        onClose={() => setIsAddQuoteOpen(false)}
        onSave={handleAddQuoteSave}
        onTagLimitExceeded={() => setIsTagLimitModalOpen(true)}
      />

      <EditBookModal
        isOpen={isEditBookOpen}
        onClose={() => setIsEditBookOpen(false)}
        initialData={{
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl || '',
        }}
        onSave={handleEditBookSave}
      />

      <EditQuoteModal
        isOpen={isEditQuoteOpen}
        onClose={() => setIsEditQuoteOpen(false)}
        quote={quoteToEdit}
        onSave={handleEditQuoteSave}
        onTagLimitExceeded={() => setIsTagLimitModalOpen(true)}
      />

      <DeleteBookModal
        isOpen={isDeleteBookOpen}
        onClose={() => setIsDeleteBookOpen(false)}
        bookTitle={book.title}
        onConfirm={handleDeleteBookConfirm}
      />

      <DeleteQuoteModal
        isOpen={!!quoteToDelete}
        onClose={() => setQuoteToDelete(null)}
        quote={quoteToDelete}
        onConfirm={handleDeleteQuoteConfirm}
      />

      <Modal
        isOpen={isTagLimitModalOpen}
        onClose={() => setIsTagLimitModalOpen(false)}
        title="Tag Limit Exceeded"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-505 leading-relaxed">
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
