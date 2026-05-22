import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface User {
  username: string;
  email: string;
  role: string;
}

interface AppState {
  // Theme state
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // User session state
  user: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;

  // Toast / Alerts notification queue
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme defaults to 'dark' for the premium dark mode default look
      theme: 'dark',
      toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        // Synchronize HTML element classes for Tailwind
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: nextTheme };
      }),

      // User session initial state
      user: {
        username: 'Developer',
        email: 'dev@vite-template.io',
        role: 'Admin'
      },
      loginUser: (user) => set({ user }),
      logoutUser: () => set({ user: null }),

      // Notification management
      notifications: [],
      addNotification: (message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          notifications: [...state.notifications, { id, type, message }]
        }));
        
        // Auto-remove notification after 4 seconds
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id)
          }));
        }, 4000);
      },
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }))
    }),
    {
      name: 'app-storage',
      // Persist only the theme and user settings
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
      }),
    }
  )
);
