import { useState, useEffect } from 'react';
import { Book, Quote } from '../types';
import { bookService } from '../services/bookService';
import { quoteService } from '../services/quoteService';
import { useToast } from '../contexts/ToastContext';

export function useBookDetails(bookId: string | undefined, onBookDeleted: () => void) {
  const { showToast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Modals state
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddQuoteOpen, setIsAddQuoteOpen] = useState(false);
  const [isEditBookOpen, setIsEditBookOpen] = useState(false);
  const [isEditQuoteOpen, setIsEditQuoteOpen] = useState(false);
  const [isDeleteBookOpen, setIsDeleteBookOpen] = useState(false);
  const [isTagLimitModalOpen, setIsTagLimitModalOpen] = useState(false);

  // Item targets for edits/deletes
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null);

  const pageSize = 20;

  useEffect(() => {
    if (bookId) {
      fetchBookData();
      setCurrentPage(1);
    }
  }, [bookId]);

  const fetchBookData = async () => {
    if (!bookId) return;
    try {
      setIsLoading(true);
      const [bookData, quotesData] = await Promise.all([
        bookService.getById(bookId),
        quoteService.getByBookId(bookId)
      ]);
      setBook(bookData);
      setQuotes(quotesData);
    } catch (error) {
      console.error("Error fetching book details:", error);
      showToast("Failed to load book data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBookSave = async (formData: { title: string; author: string; coverUrl?: string }) => {
    if (!bookId) return;
    try {
      const updatedBook = await bookService.update(bookId, formData);
      setBook(updatedBook);
      showToast("Book details updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update book details.", "error");
      throw err;
    }
  };

  const handleDeleteBookConfirm = async () => {
    if (!bookId) return;
    try {
      await bookService.delete(bookId);
      showToast("Book deleted successfully!", "success");
      onBookDeleted();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete book.", "error");
      throw err;
    }
  };

  const handleAddQuoteSave = async (formData: { text: string; page: string; tags: string; characterName: string }) => {
    if (!bookId) return;
    try {
      const tagsArray = formData.tags.split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t);

      const createdQuote = await quoteService.create(bookId, {
        text: formData.text,
        page: formData.page ? parseInt(formData.page) : null,
        tags: tagsArray,
        characterName: formData.characterName.trim() || null
      });

      setQuotes([createdQuote, ...quotes]);
      showToast("Quote added successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to add quote.", "error");
      throw err;
    }
  };

  const handleEditQuoteSave = async (quoteId: number, formData: { text: string; page: string; tags: string; characterName: string }) => {
    if (!bookId) return;
    try {
      const tagsArray = formData.tags.split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t);

      const updatedQuote = await quoteService.update(bookId, quoteId, {
        text: formData.text,
        page: formData.page ? parseInt(formData.page) : null,
        tags: tagsArray,
        characterName: formData.characterName.trim() || null
      });

      setQuotes(quotes.map(q => q.id === quoteId ? updatedQuote : q));
      showToast("Quote updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update quote.", "error");
      throw err;
    }
  };

  const handleDeleteQuoteConfirm = async () => {
    if (!bookId || !quoteToDelete || !quoteToDelete.id) return;
    try {
      await quoteService.delete(bookId, quoteToDelete.id);
      setQuotes(quotes.filter(q => q.id !== quoteToDelete.id));

      // Recalculate pagination bounds
      const totalPages = Math.ceil((quotes.length - 1) / pageSize);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      setQuoteToDelete(null);
      showToast("Quote deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete quote.", "error");
      throw err;
    }
  };

  const handleEditQuoteClick = (quote: Quote) => {
    setQuoteToEdit(quote);
    setIsEditQuoteOpen(true);
  };

  const handleDeleteQuoteClick = (quoteId: number) => {
    const q = quotes.find(quote => quote.id === quoteId);
    if (q) {
      setQuoteToDelete(q);
    }
  };

  const totalPages = Math.ceil(quotes.length / pageSize);
  const paginatedQuotes = quotes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return {
    book,
    quotes,
    paginatedQuotes,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,

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
    setQuoteToEdit,

    // Action Handlers
    handleEditBookSave,
    handleDeleteBookConfirm,
    handleAddQuoteSave,
    handleEditQuoteSave,
    handleDeleteQuoteConfirm,
    handleEditQuoteClick,
    handleDeleteQuoteClick
  };
}
