import { create } from 'zustand';
import { CollectionData } from '../api/content.api';

interface CollectionStoreState {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  activeCollection: CollectionData | null;
  setCreateModalOpen: (isOpen: boolean) => void;
  setEditModalOpen: (isOpen: boolean, collection?: CollectionData | null) => void;
}

export const useCollectionStore = create<CollectionStoreState>((set) => ({
  isCreateModalOpen: false,
  isEditModalOpen: false,
  activeCollection: null,
  setCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),
  setEditModalOpen: (isEditModalOpen, activeCollection = null) =>
    set({ isEditModalOpen, activeCollection }),
}));
