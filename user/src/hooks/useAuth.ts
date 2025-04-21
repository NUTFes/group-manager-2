import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/authStore';
import { RegisterParams } from '@/types/auth';
import { useApiGet, useApiMutations } from '@/hooks/useApi';

interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

export const useAuth = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const { post } = useApiMutations();
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore();

  const { data: user, error: userError } = useApiGet<User>(
    isAuthenticated ? '/api/auth/validate_token' : null
  );

  const handleAuthError = (error: unknown) => {
    console.error('Auth error:', error);
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          throw new Error(errorMessages.join('\n'));
        }
      } catch {
        throw error;
      }
    }
    throw error;
  };

  const autoLogin = async (email: string, password: string) => {
    const loginResponse = await post('/api/auth/sign_in', {
      email,
      password,
    });

    if (!loginResponse?.auth) {
      console.error('ログインレスポンスに認証情報がありません');
      router.push('/login');
      return;
    }

    const { 'access-token': accessToken, client, uid } = loginResponse.auth;
    if (!(accessToken && client && uid)) {
      console.error('認証情報が不完全です:', { accessToken, client, uid });
      router.push('/login');
      return;
    }

    setAuth(accessToken, client, uid);
    router.push('/dashboard');
  };

  const register = useCallback(
    async (params: RegisterParams) => {
      try {
        const response = await post('/api/auth', {
          ...params,
          user_detail_attributes: params.user_detail_attributes,
        });

        if (
          !(response?.data?.status === 'success' && response?.data?.data?.id)
        ) {
          throw new Error('ユーザー登録に失敗しました');
        }

        // 登録成功時は自動ログイン
        await autoLogin(response.data.data.email, params.password).catch(
          (error) => {
            console.error('Auto login failed:', error);
            router.push('/login');
          }
        );

        return response;
      } catch (error) {
        handleAuthError(error);
      }
    },
    [post, router, setAuth]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await autoLogin(email, password);
      } catch (error) {
        setError('ログインに失敗しました');
        throw error;
      }
    },
    [setAuth, router]
  );

  const logout = useCallback(async () => {
    try {
      await post('/api/auth/sign_out', {});
      clearAuth();
      router.push('/login');
    } catch (error) {
      setError('ログアウトに失敗しました');
      throw error;
    }
  }, [post, router, clearAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(
        () => {
          // トークン検証は useApiGet フックによって自動的に行われます
          // このインターバルは主にユーザー情報の更新のために使用されます
        },
        5 * 60 * 1000
      ); // 5分ごとに実行

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return {
    user,
    isAuthenticated: !!user,
    error: error || userError?.message,
    login,
    register,
    logout,
  };
};
