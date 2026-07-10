import { create } from 'zustand';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

export interface Conversation {
  _id: string;
  title: string;
  provider: string;
  category: string;
  status: 'active' | 'archived';
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  searchQuery: string;
  categoryFilter: string;
  providerFilter: string;

  setSearchQuery: (q: string) => void;
  setCategoryFilter: (cat: string) => void;
  setProviderFilter: (prov: string) => void;
  setActiveConversationId: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  createConversation: (params: { title: string; provider?: string; category?: string }) => Promise<Conversation | null>;
  renameConversation: (id: string, title: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  updateConversation: (id: string, updates: Partial<Conversation>) => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  searchQuery: '',
  categoryFilter: '',
  providerFilter: '',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setProviderFilter: (providerFilter) => set({ providerFilter }),
  setActiveConversationId: (activeConversationId) => set({ activeConversationId }),

  fetchConversations: async () => {
    try {
      set({ isLoading: true });
      const { searchQuery, categoryFilter, providerFilter } = get();
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter) params.append('category', categoryFilter);
      if (providerFilter) params.append('provider', providerFilter);

      const response = await apiClient.get(`/chat/conversations?${params.toString()}`);
      if (response.data.success) {
        set({ conversations: response.data.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createConversation: async (params) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post('/chat/conversations', params);
      if (response.data.success) {
        const newConv = response.data.data;
        set((state) => ({
          conversations: [newConv, ...state.conversations],
          activeConversationId: newConv._id,
        }));
        toast.success('Conversation created');
        return newConv;
      }
      return null;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create conversation');
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  renameConversation: async (id, title) => {
    try {
      const response = await apiClient.patch(`/chat/conversations/${id}`, { title });
      if (response.data.success) {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === id ? { ...c, title } : c
          ),
        }));
        toast.success('Conversation renamed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to rename conversation');
    }
  },

  togglePin: async (id) => {
    try {
      const conv = get().conversations.find((c) => c._id === id);
      if (!conv) return;
      const response = await apiClient.patch(`/chat/conversations/${id}`, { isPinned: !conv.isPinned });
      if (response.data.success) {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === id ? { ...c, isPinned: !c.isPinned } : c
          ).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)),
        }));
        toast.success(conv.isPinned ? 'Unpinned' : 'Pinned');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to pin conversation');
    }
  },

  toggleFavorite: async (id) => {
    try {
      const conv = get().conversations.find((c) => c._id === id);
      if (!conv) return;
      const response = await apiClient.patch(`/chat/conversations/${id}`, { isFavorite: !conv.isFavorite });
      if (response.data.success) {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === id ? { ...c, isFavorite: !c.isFavorite } : c
          ),
        }));
        toast.success(conv.isFavorite ? 'Removed from favorites' : 'Added to favorites');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle favorite');
    }
  },

  deleteConversation: async (id) => {
    try {
      const response = await apiClient.delete(`/chat/conversations/${id}`);
      if (response.data.success) {
        set((state) => ({
          conversations: state.conversations.filter((c) => c._id !== id),
          activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
        }));
        toast.success('Conversation deleted');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete conversation');
    }
  },

  updateConversation: async (id, updates) => {
    try {
      const response = await apiClient.patch(`/chat/conversations/${id}`, updates);
      if (response.data.success) {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === id ? { ...c, ...updates } : c
          ),
        }));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update conversation settings');
    }
  },
}));
