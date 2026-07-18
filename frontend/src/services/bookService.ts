import api from './api';
import { Book } from '../types';

export const bookService = {
  getAll: async (): Promise<Book[]> => {
    const response = await api.get('/books');
    return response.data;
  },

  getById: async (id: number | string): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  create: async (bookData: { title: string; author: string; coverUrl?: string }): Promise<Book> => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  update: async (id: number | string, bookData: { title: string; author: string; coverUrl?: string }): Promise<Book> => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`/books/${id}`);
  }
};
