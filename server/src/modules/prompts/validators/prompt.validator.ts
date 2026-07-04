import { z } from 'zod';

export const generatePromptSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  promptType: z.string().min(1, 'Prompt type is required'),
  techStack: z.string().min(1, 'Tech stack is required'),
  requirements: z.string().min(5, 'Requirements must be at least 5 characters'),
  architectureDetails: z.string().optional(),
});
