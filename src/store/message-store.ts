import { create } from 'zustand';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

export interface Message {
  _id: string;
  conversation: string;
  sender: 'user' | 'ai';
  content: string;
  generationStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  processingTime?: number;
  createdAt: string;
}

interface MessageState {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  regenerateMessage: (conversationId: string, content: string) => Promise<void>;
  deleteMessage: (conversationId: string, messageId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  isLoading: false,
  isStreaming: false,

  fetchMessages: async (conversationId) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
      if (response.data.success) {
        set({ messages: response.data.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (conversationId, content) => {
    try {
      set({ isStreaming: true });
      // Instantly append user message optimistically
      const tempUserMsg: Message = {
        _id: `temp_${Date.now()}`,
        conversation: conversationId,
        sender: 'user',
        content,
        generationStatus: 'SUCCESS',
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ messages: [...state.messages, tempUserMsg] }));

      const response = await apiClient.post(`/chat/conversations/${conversationId}/messages`, { content });
      if (response.data.success) {
        const { userMessage, aiResponse } = response.data.data;
        set((state) => {
          // Replace temp user message with actual DB message and append AI response
          const filtered = state.messages.filter((m) => m._id !== tempUserMsg._id);
          return {
            messages: [...filtered, userMessage || tempUserMsg, aiResponse],
          };
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      set({ isStreaming: false });
    }
  },

  regenerateMessage: async (conversationId, content) => {
    try {
      set({ isStreaming: true });
      const response = await apiClient.post(`/chat/conversations/${conversationId}/messages`, {
        content,
        regenerate: true,
      });
      if (response.data.success) {
        const { aiResponse } = response.data.data;
        set((state) => ({
          messages: [...state.messages, aiResponse],
        }));
        toast.success('Response regenerated');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to regenerate response');
    } finally {
      set({ isStreaming: false });
    }
  },

  deleteMessage: async (conversationId, messageId) => {
    try {
      const response = await apiClient.delete(`/chat/conversations/${conversationId}/messages/${messageId}`);
      if (response.data.success) {
        set((state) => ({
          messages: state.messages.filter((m) => m._id !== messageId),
        }));
        toast.success('Message deleted');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete message');
    }
  },
}));
