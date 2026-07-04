import { create } from 'zustand';

interface LayoutState {
  isSidebarCollapsed: boolean;
  breadcrumbs: Array<{ label: string; path?: string }>;
  toggleSidebar: () => void;
  setBreadcrumbs: (crumbs: Array<{ label: string; path?: string }>) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: false,
  breadcrumbs: [{ label: 'Home', path: '/' }],
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));
