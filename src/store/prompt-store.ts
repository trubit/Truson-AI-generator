import { create } from 'zustand';
import { apiClient } from '../api/client';
import { PromptGeneratorResult } from '@shared/types/prompt.types';
import toast from 'react-hot-toast';

interface PromptState {
  promptHistory: any[];
  generatedPrompt: string;
  isLoading: boolean;
  fetchHistory: () => Promise<void>;
  generatePrompt: (params: {
    category: string;
    promptType: string;
    techStack: string;
    requirements: string;
    architectureDetails?: string;
  }) => Promise<PromptGeneratorResult | null>;
  toggleFavorite: (id: string) => Promise<void>;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  promptHistory: [],
  generatedPrompt: '',
  isLoading: false,

  fetchHistory: async () => {
    try {
      set({ isLoading: true });
      const response = await apiClient.get('/prompts/history');
      if (response.data.success) {
        set({ promptHistory: response.data.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch prompt history:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  generatePrompt: async (params) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post('/prompts/generate', params);
      if (response.data.success) {
        const result = response.data.data;
        set({ generatedPrompt: result.generatedPrompt });
        // Refresh history to include new item
        await get().fetchHistory();
        toast.success('Prompt successfully generated!');
        return result;
      }
      return null;
    } catch (error: any) {
      toast.error(error.message || 'Prompt generation failed.');
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (id: string) => {
    try {
      const response = await apiClient.post(`/prompts/favorites/${id}`);
      if (response.data.success) {
        set((state) => ({
          promptHistory: state.promptHistory.map((item) =>
            item._id === id ? { ...item, favoriteStatus: response.data.data.favoriteStatus } : item
          ),
        }));
        const updated = response.data.data;
        if (updated.favoriteStatus) {
          toast.success('Added to favorites!');
        } else {
          toast.success('Removed from favorites.');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle favorite status.');
    }
  },
}));
