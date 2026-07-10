import { create } from 'zustand';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

export interface PromptCard {
  _id: string;
  prompt: string;
  category: string;
  programmingLanguage: string;
  framework: string;
  tags: string[];
  createdAt: string;
}

interface PromptLibraryState {
  savedPrompts: PromptCard[];
  isLoading: boolean;
  searchQuery: string;
  categoryFilter: string;
  languageFilter: string;

  setSearchQuery: (q: string) => void;
  setCategoryFilter: (cat: string) => void;
  setLanguageFilter: (lang: string) => void;
  fetchLibrary: () => Promise<void>;
  saveToLibrary: (params: {
    prompt: string;
    category: string;
    programmingLanguage: string;
    framework: string;
    tags?: string[];
  }) => Promise<PromptCard | null>;
  deleteFromLibrary: (id: string) => Promise<void>;
}

export const usePromptLibraryStore = create<PromptLibraryState>((set, get) => ({
  savedPrompts: [],
  isLoading: false,
  searchQuery: '',
  categoryFilter: '',
  languageFilter: '',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setLanguageFilter: (languageFilter) => set({ languageFilter }),

  fetchLibrary: async () => {
    try {
      set({ isLoading: true });
      const { searchQuery, categoryFilter, languageFilter } = get();

      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter) params.append('category', categoryFilter);
      if (languageFilter) params.append('language', languageFilter);

      const response = await apiClient.get(`/prompts/library?${params.toString()}`);
      if (response.data.success) {
        set({ savedPrompts: response.data.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch prompt library:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveToLibrary: async (params) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post('/prompts/library', params);
      if (response.data.success) {
        const newCard = response.data.data;
        set((state) => ({
          savedPrompts: [newCard, ...state.savedPrompts],
        }));
        toast.success('Prompt saved to library!');
        return newCard;
      }
      return null;
    } catch (error: any) {
      toast.error(error.message || 'Failed to save prompt to library');
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFromLibrary: async (id) => {
    try {
      const response = await apiClient.delete(`/prompts/library/${id}`);
      if (response.data.success) {
        set((state) => ({
          savedPrompts: state.savedPrompts.filter((p) => p._id !== id),
        }));
        toast.success('Prompt removed from library');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete prompt from library');
    }
  },
}));
