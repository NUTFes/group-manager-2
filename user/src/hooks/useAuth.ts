import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/authStore';
import { RegisterParams } from '@/types/register/user';
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

  // APIエラーを処理する関数
  const handleAuthError = (error: unknown) => {
    console.error('Auth error:', error);
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          return errorMessages.join('\n');
        }
      } catch {
        // JSON解析に失敗した場合は元のエラーメッセージを使用
        return error.message;
      }
    }
    return '認証エラーが発生しました';
  };

  // 自動ログイン処理
  const autoLogin = async (email: string, password: string) => {
    try {
      console.log('自動ログイン試行:', email);
      const loginResponse = await post('/api/auth/sign_in', {
        email,
        password,
      });

      if (!loginResponse?.headers) {
        console.error('ログインレスポンスにヘッダー情報がありません');
        return { success: false, message: '認証情報が取得できませんでした' };
      }

      // レスポンスヘッダーから認証情報を取得
      const accessToken =
        loginResponse.headers instanceof Headers
          ? loginResponse.headers.get('access-token')
          : loginResponse.headers['access-token'];
      const client =
        loginResponse.headers instanceof Headers
          ? loginResponse.headers.get('client')
          : loginResponse.headers['client'];
      const uid =
        loginResponse.headers instanceof Headers
          ? loginResponse.headers.get('uid')
          : loginResponse.headers['uid'];

      if (!(accessToken && client && uid)) {
        console.error('認証情報が不完全です:', { accessToken, client, uid });
        return { success: false, message: '認証情報が不完全です' };
      }

      setAuth(accessToken, client, uid);
      return { success: true, userData: loginResponse.data };
    } catch (error) {
      console.error('自動ログイン失敗:', error);
      return { success: false, message: handleAuthError(error) };
    }
  };

  // ログイン処理
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const loginResult = await autoLogin(email, password);
        if (loginResult.success) {
          router.push('/dashboard');
        } else {
          setError(loginResult.message || 'ログインに失敗しました');
          throw new Error(loginResult.message);
        }
      } catch (error) {
        setError('ログインに失敗しました');
        throw error;
      }
    },
    [router, setAuth, setError, post]
  );

  const register = useCallback(
    async (params: RegisterParams) => {
      try {
        console.log('ユーザー登録パラメータ:', {
          email: params.mail,
          password: params.password,
          name: params.name,
        });

        const response = await post('/api/auth', {
          email: params.mail,
          password: params.password,
          password_confirmation: params.passwordConfirm,
          name: params.name,
          role_id: 1, // デフォルトのロールID
          user_detail_attributes: {
            student_id: params.studentId,
            department_id: params.departmentId,
            grade_id: params.gradeId,
            tel: params.tel,
          },
        });

        console.log('登録レスポンス:', response);

        // レスポンスの構造を確認
        if (!response || !response.data) {
          return {
            success: false,
            message: '登録に失敗しました: サーバーからの応答が無効です',
          };
        }

        if (response.data.status === 'error') {
          const errorMsg =
            '登録に失敗しました: ' + JSON.stringify(response.data.errors || {});
          return { success: false, message: errorMsg };
        }

        // ユーザーIDが存在するか確認
        const userId = response.data.data?.id;
        if (!userId) {
          return {
            success: false,
            message: '登録に失敗しました: ユーザーIDが見つかりません',
          };
        }

        // 登録成功時は自動ログイン
        const loginResult = await autoLogin(params.mail, params.password);

        if (loginResult.success) {
          router.push('/dashboard');
          return {
            success: true,
            data: response.data.data,
            userData: loginResult.userData,
          };
        } else {
          // 登録は成功したがログインに失敗した場合
          router.push('/login?registered=true');
          return {
            success: false,
            message:
              'ユーザー登録は完了しましたが、自動ログインに失敗しました。ログインページからログインしてください。',
            data: response.data.data,
          };
        }
      } catch (error) {
        const errorMsg = handleAuthError(error);
        return { success: false, message: errorMsg };
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
