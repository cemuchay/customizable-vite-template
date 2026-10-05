import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeLocalStorage } from '../services/storage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;
}

// Preset demo accounts for instant developer testing
export const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@example.com',
    password: 'password123',
    user: {
      id: 'usr_admin_01',
      name: 'Alex Rivera',
      email: 'admin@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=80',
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
    },
  },
  user: {
    email: 'user@example.com',
    password: 'password123',
    user: {
      id: 'usr_member_02',
      name: 'Sarah Connor',
      email: 'user@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    },
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate network latency (400ms)
          await new Promise((resolve) => setTimeout(resolve, 400));

          const cleanEmail = email.trim().toLowerCase();

          // Check against demo accounts or accept valid standard email formats
          let matchedUser: User;
          if (cleanEmail === DEMO_ACCOUNTS.admin.email) {
            matchedUser = DEMO_ACCOUNTS.admin.user;
          } else if (cleanEmail === DEMO_ACCOUNTS.user.email) {
            matchedUser = DEMO_ACCOUNTS.user.user;
          } else {
            // Default user fallback for custom email testing
            const username = cleanEmail.split('@')[0];
            matchedUser = {
              id: `usr_${Date.now()}`,
              name: username.charAt(0).toUpperCase() + username.slice(1),
              email: cleanEmail,
              role: 'user',
              createdAt: new Date().toISOString(),
            };
          }

          const mockToken = `jwt_mock_${matchedUser.id}_${Date.now()}`;

          // Synchronize token safely for Axios interceptor access
          safeLocalStorage.setItem('token', mockToken);

          set({
            user: matchedUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.message || 'Authentication failed. Please check your credentials.',
          });
          return false;
        }
      },

      logout: () => {
        safeLocalStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (data) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...data } });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
