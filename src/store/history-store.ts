import { create } from 'zustand';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

interface HistoryState {
  aiHistory: any[];
  isLoading: boolean;
  fetchAIHistory: () => Promise<void>;
  generateContent: (params: {
    category: string;
    prompt: string;
    providerId?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }) => Promise<any | null>;
  executeAssistant: (params: {
    action: string;
    text: string;
    instructions?: string;
    providerId?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }) => Promise<any | null>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  aiHistory: [],
  isLoading: false,

  fetchAIHistory: async () => {
    try {
      set({ isLoading: true });
      const response = await apiClient.get('/ai/history');
      if (response.data.success) {
        set({ aiHistory: response.data.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch AI history:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  generateContent: async (params) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post('/ai/generate', params);
      if (response.data.success) {
        // Refresh AI History
        await get().fetchAIHistory();
        toast.success('Content generated successfully!');
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      toast.error(error.message || 'Content generation failed.');
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  executeAssistant: async (params) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post('/ai/assistant', params);
      if (response.data.success) {
        // Refresh AI History
        await get().fetchAIHistory();
        toast.success(`Assistant action '${params.action}' complete!`);
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      toast.error(error.message || 'Assistant execution failed.');
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
