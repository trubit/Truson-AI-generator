import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (item) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    set((state) => ({ notifications: [newItem, ...state.notifications] }));
  },
  removeNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
  clearAll: () => set({ notifications: [] }),
}));
