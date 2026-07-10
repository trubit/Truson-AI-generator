import { create } from 'zustand';
import { DocumentData } from '../api/content.api';

interface ContentState {
  activeDocument: DocumentData | null;
  activeSidebarTab: 'all' | 'favorites' | 'drafts' | 'archived' | 'collections' | 'templates';
  selectedCollectionId: string | null;
  selectedTemplateId: string | null;
  searchQuery: string;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  undoStack: string[];
  redoStack: string[];
  isRightSidebarOpen: boolean;
  
  setActiveDocument: (doc: DocumentData | null) => void;
  setActiveSidebarTab: (tab: 'all' | 'favorites' | 'drafts' | 'archived' | 'collections' | 'templates') => void;
  setSelectedCollectionId: (id: string | null) => void;
  setSelectedTemplateId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  toggleRightSidebar: () => void;
  
  pushToUndo: (content: string) => void;
  undo: (currentContent: string) => string | null;
  redo: (currentContent: string) => string | null;
  clearUndoRedo: () => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  activeDocument: null,
  activeSidebarTab: 'all',
  selectedCollectionId: null,
  selectedTemplateId: null,
  searchQuery: '',
  isSaving: false,
  saveStatus: 'idle',
  undoStack: [],
  redoStack: [],
  isRightSidebarOpen: true,

  setActiveDocument: (doc) => {
    set({ activeDocument: doc, undoStack: [], redoStack: [] });
  },
  setActiveSidebarTab: (activeSidebarTab) => set({ activeSidebarTab, selectedCollectionId: null, selectedTemplateId: null }),
  setSelectedCollectionId: (selectedCollectionId) => set({ selectedCollectionId, activeSidebarTab: 'collections', selectedTemplateId: null }),
  setSelectedTemplateId: (selectedTemplateId) => set({ selectedTemplateId, activeSidebarTab: 'templates', selectedCollectionId: null }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSaveStatus: (saveStatus) => set({ saveStatus, isSaving: saveStatus === 'saving' }),
  toggleRightSidebar: () => set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),

  pushToUndo: (content) => {
    const { undoStack } = get();
    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === content) {
      return;
    }
    set({
      undoStack: [...undoStack.slice(-50), content],
      redoStack: [],
    });
  },

  undo: (currentContent) => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return null;
    const previous = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, currentContent],
    });
    return previous;
  },

  redo: (currentContent) => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return null;
    const next = redoStack[redoStack.length - 1];
    set({
      undoStack: [...undoStack, currentContent],
      redoStack: redoStack.slice(0, -1),
    });
    return next;
  },

  clearUndoRedo: () => set({ undoStack: [], redoStack: [] }),
}));
