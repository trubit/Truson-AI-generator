import { create } from 'zustand';

interface WorkspaceState {
  activeView: 'chat' | 'prompt-gen' | 'split';
  splitRatio: number;
  setActiveView: (view: 'chat' | 'prompt-gen' | 'split') => void;
  setSplitRatio: (ratio: number) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeView: 'split',
  splitRatio: 50,
  setActiveView: (activeView) => set({ activeView }),
  setSplitRatio: (splitRatio) => set({ splitRatio }),
}));
