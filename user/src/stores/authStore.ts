import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  accessToken: string | null;
  client: string | null;
  uid: string | null;
  user: User | null;
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
      setAuth: (accessToken, client, uid) => {
        // Cookieに認証情報を保存（サーバーサイドでの認証チェック用）
        if (typeof document !== 'undefined') {
          document.cookie = `auth-storage=${JSON.stringify({
            state: { accessToken, client, uid, isAuthenticated: true },
            version: 0,
          })}; path=/; max-age=2592000`; // 30日間有効
        }

        set({
          accessToken,
          client,
          uid,
          isAuthenticated: true,
        });
      },
      clearAuth: () => {
        // Cookieを削除
        if (typeof document !== 'undefined') {
          document.cookie =
            'auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }

        set({
          accessToken: null,
          client: null,
          uid: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      // ブラウザのローカルストレージに保存
      name: 'auth-storage',
    }
  )
);
