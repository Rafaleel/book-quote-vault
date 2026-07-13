import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const QuoteSchema = z.object({
  id: z.number().optional(),
  text: z.string().min(1, "Text is required"),
  page: z.number().nullable().optional(),
  createdAt: z.string().optional(),
  bookId: z.number().optional(),
  tags: z.array(z.string()).optional(),
});
export type Quote = z.infer<typeof QuoteSchema>;

export const BookSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  coverUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  userId: z.number().optional(),
  quotes: z.array(QuoteSchema).optional(),
  color: z.string().optional(),
});
export type Book = z.infer<typeof BookSchema>;

export const AuthResponseSchema = z.object({
  token: z.string(),
  type: z.string(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
