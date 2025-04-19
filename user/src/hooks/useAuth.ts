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

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await post('/api/auth/sign_in', {
          email,
          password,
        });

        if (response) {
          const accessToken = response.headers.get('access-token');
          const client = response.headers.get('client');
          const uid = response.headers.get('uid');
          if (accessToken && client && uid) {
            setAuth(accessToken, client, uid);
            router.push('/dashboard');
          } else {
            console.error('認証情報が不完全です:', {
              accessToken,
              client,
              uid,
            });
            router.push('/login');
          }
        } else {
          throw new Error('ログインに失敗しました');
        }
      } catch (error) {
        setError('ログインに失敗しました');
        throw error;
      }
    },
    [post, router, setAuth]
  );

  const register = useCallback(
    async (params: RegisterParams) => {
      try {
        const response = await post('/api/auth', {
          ...params,
          user_detail_attributes: params.user_detail_attributes,
        });

        console.log('Registration response:', response);

        if (
          response &&
          response.data?.status === 'success' &&
          response.data?.data?.id
        ) {
          // 登録成功時は自動ログイン
          const { email } = response.data.data;

          // 登録成功後、ログインを実行して認証情報を取得
          try {
            console.log('Attempting auto login with:', email);
            const loginResponse = await post('/api/auth/sign_in', {
              email: email,
              password: params.password,
            });

            console.log('Login response:', loginResponse);

            if (loginResponse && loginResponse.auth) {
              // ログイン成功時は認証情報を設定
              const accessToken = loginResponse.auth['access-token'];
              const client = loginResponse.auth.client;
              const uid = loginResponse.auth.uid;

              console.log('Auth headers:', { accessToken, client, uid });

              if (accessToken && client && uid) {
                setAuth(accessToken, client, uid);
                router.push('/dashboard');
              } else {
                console.error('認証情報が不完全です:', {
                  accessToken,
                  client,
                  uid,
                });
                router.push('/login');
              }
            } else {
              console.error('ログインレスポンスに認証情報がありません');
              router.push('/login');
            }
          } catch (loginError) {
            console.error('Auto login error:', loginError);
            // 自動ログインに失敗した場合は、ログインページにリダイレクト
            router.push('/login');
          }
        } else {
          throw new Error('ユーザー登録に失敗しました');
        }

        return response;
      } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof Error) {
          try {
            const errorData = JSON.parse(error.message);
            if (errorData.errors) {
              const errorMessages = Object.values(errorData.errors).flat();
              throw new Error(errorMessages.join('\n'));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (parseError) {
            // JSON解析に失敗した場合は元のエラーメッセージを使用
          }
        }
        throw error;
      }
    },
    [post, router, setAuth]
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
