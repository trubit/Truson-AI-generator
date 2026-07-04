import { create } from 'zustand';
import { AIProviderId, AIProviderInfo } from '@shared/types/ai.types';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

interface AIState {
  activeProvider: AIProviderId;
  providers: AIProviderInfo[];
  isLoading: boolean;
  fetchProviders: () => Promise<void>;
  switchProvider: (providerId: AIProviderId) => Promise<void>;
}

export const useAIStore = create<AIState>((set) => ({
  activeProvider: 'openai',
  providers: [],
  isLoading: false,

  fetchProviders: async () => {
    try {
      set({ isLoading: true });
      const response = await apiClient.get('/ai/providers');
      if (response.data.success) {
        set({
          activeProvider: response.data.activeProvider,
          providers: response.data.data,
        });
      }
    } catch (error) {
      console.error('Failed to fetch AI providers:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  switchProvider: async (providerId: AIProviderId) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post('/ai/switch-provider', { providerId });
      if (response.data.success) {
        set({ activeProvider: providerId });
        toast.success(`Switched AI provider to ${providerId.toUpperCase()}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to switch AI provider');
    } finally {
      set({ isLoading: false });
    }
  },
}));
