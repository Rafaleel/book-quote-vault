import api from './api';
import { Quote } from '../types';

export const quoteService = {
  getByBookId: async (bookId: number | string): Promise<Quote[]> => {
    const response = await api.get(`/books/${bookId}/quotes`);
    return response.data;
  },

  create: async (
    bookId: number | string, 
    quoteData: { text: string; page?: number | null; tags?: string[]; characterName?: string | null }
  ): Promise<Quote> => {
    const response = await api.post(`/books/${bookId}/quotes`, quoteData);
    return response.data;
  },

  update: async (
    bookId: number | string, 
    quoteId: number | string, 
    quoteData: { text: string; page?: number | null; tags?: string[]; characterName?: string | null }
  ): Promise<Quote> => {
    const response = await api.put(`/books/${bookId}/quotes/${quoteId}`, quoteData);
    return response.data;
  },

  delete: async (bookId: number | string, quoteId: number | string): Promise<void> => {
    await api.delete(`/books/${bookId}/quotes/${quoteId}`);
  }
};
