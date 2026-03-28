import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewMode, User } from '@/types';

interface AppState {
  // 用户信息
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // 主题设置
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;

  // 侧边栏折叠
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // 当前模块
  currentModule: string;
  setCurrentModule: (module: string) => void;

  // 全局加载状态
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // 通知消息
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // 最近访问
  recentViews: string[];
  addRecentView: (path: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
  read?: boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      theme: 'light',
      setTheme: (theme) => set({ theme }),

      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      currentModule: 'tlc',
      setCurrentModule: (module) => set({ currentModule: module }),

      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      notifications: [],
      addNotification: (notification) => {
        const id = Date.now().toString();
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id }],
        }));
        // 自动移除
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 3000);
        }
      },
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),

      recentViews: [],
      addRecentView: (path) =>
        set((state) => {
          const filtered = state.recentViews.filter((p) => p !== path);
          return { recentViews: [path, ...filtered].slice(0, 10) };
        }),
    }),
    {
      name: 'lingma-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        recentViews: state.recentViews,
      }),
    }
  )
);
