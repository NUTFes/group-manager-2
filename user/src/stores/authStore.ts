import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  client: string | null;
  uid: string | null;
  user: unknown | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, client: string, uid: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      client: null,
      uid: null,
      user: null,
      isAuthenticated: false,
      setAuth: (accessToken, client, uid) =>
        set({ accessToken, client, uid, isAuthenticated: true }),
      clearAuth: () =>
        set({
          accessToken: null,
          client: null,
          uid: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth',
    }
  )
);
