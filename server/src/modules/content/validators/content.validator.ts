import { z } from 'zod';

export const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  category: z.string().min(1, 'Category is required'),
  contentType: z.string().min(1, 'Content type is required'),
  editorMode: z.enum(['markdown', 'rich-text']).default('markdown'),
  generatedContent: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  aiProvider: z.string().optional().default('openai'),
  collectionId: z.string().optional(),
});

export const updateContentSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  category: z.string().optional(),
  contentType: z.string().optional(),
  editorMode: z.enum(['markdown', 'rich-text']).optional(),
  generatedContent: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  tags: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional(),
  collectionId: z.string().nullable().optional(),
});

export const generateContentSchema = z.object({
  templateId: z.string().min(1, 'Template ID is required'),
  providerId: z.string().optional().default('openai'),
  variables: z.record(z.string(), z.any()),
});

export const createCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  description: z.string().optional().default(''),
  visibility: z.enum(['private', 'public']).default('private'),
});

export const updateCollectionSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().optional(),
  visibility: z.enum(['private', 'public']).optional(),
});
