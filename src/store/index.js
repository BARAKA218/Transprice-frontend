import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, notificationService } from '../services/api';

// AUTH STORE
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  token: null,
  error: null,

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        set({
          user: result.user,
          isAuthenticated: true,
          token: result.token,
          loading: false,
          error: null,
        });
        return result;
      }
      set({ loading: false, error: result.error || 'Invalid email or password' });
      return result;
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
    } catch {
      // ignore logout errors
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        token: null,
        loading: false,
        error: null,
      });
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.register(data);
      if (result.success) {
        set({
          user: result.user,
          isAuthenticated: true,
          token: result.token,
          loading: false,
          error: null,
        });
      } else {
        set({ loading: false, error: result.error || 'Registration failed' });
      }
      return result;
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  updateUser: (data) => {
    const { user } = useAuthStore.getState();
    if (!user) return { success: false, error: 'Not authenticated' };
    const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
    set({ user: updated });
    return { success: true, user: updated };
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) return { success: false, error: 'Not authenticated' };
      const result = useAuthStore.getState().updateUser(data);
      set({ loading: false });
      return result;
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },
}));

// THEME STORE (persisted)
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system',

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const current = get().theme;
        if (current === 'light') set({ theme: 'dark' });
        else if (current === 'dark') set({ theme: 'system' });
        else set({ theme: 'light' });
      },

      getResolvedTheme: () => {
        const { theme } = get();
        if (theme !== 'system') return theme;
        if (typeof window !== 'undefined') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        }
        return 'light';
      },
    }),
    {
      name: 'transprice-theme',
    }
  )
);

// NOTIFICATION STORE
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const result = await notificationService.getNotifications(filters);
      const count = await notificationService.getUnreadCount();
      set({ notifications: result.data, unreadCount: count, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationService.markAsRead(id);
      const notifications = get().notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      set({
        notifications,
        unreadCount: Math.max(0, get().unreadCount - 1),
      });
    } catch {
      // silent fail
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      const notifications = get().notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
      set({ notifications, unreadCount: 0 });
    } catch {
      // silent fail
    }
  },
}));

// SEARCH STORE
export const useSearchStore = create((set) => ({
  searchQuery: '',
  searchResults: [],
  filters: {},
  isSearching: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  clearFilters: () =>
    set({ filters: {}, searchQuery: '', searchResults: [] }),

  clearSearch: () =>
    set({
      searchQuery: '',
      searchResults: [],
      filters: {},
      isSearching: false,
    }),
}));

// UI STORE
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  currentModal: null,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  openModal: (modalName) => set({ currentModal: modalName }),

  closeModal: () => set({ currentModal: null }),
}));
