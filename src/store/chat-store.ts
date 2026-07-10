import { create } from 'zustand';

interface ChatLayoutState {
  activeSidebarTab: 'conversations' | 'favorites' | 'archived';
  isRightSidebarOpen: boolean;
  setActiveSidebarTab: (tab: 'conversations' | 'favorites' | 'archived') => void;
  toggleRightSidebar: () => void;
  setRightSidebarOpen: (isOpen: boolean) => void;
}

export const useChatStore = create<ChatLayoutState>((set) => ({
  activeSidebarTab: 'conversations',
  isRightSidebarOpen: true,
  setActiveSidebarTab: (activeSidebarTab) => set({ activeSidebarTab }),
  toggleRightSidebar: () => set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),
  setRightSidebarOpen: (isRightSidebarOpen) => set({ isRightSidebarOpen }),
}));
