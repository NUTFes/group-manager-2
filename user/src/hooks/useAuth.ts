import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/authStore';
import { RegisterParams } from '@/types/register/user';
import useSWRMutation from 'swr/mutation';
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

// APIエラーレスポンスを解析するヘルパー関数
const parseApiError = (
  error: unknown
): { message: string; status?: number } => {
  let errorMessage = '不明なエラーが発生しました。';
  let statusCode: number | undefined;

  if (error instanceof Error) {
    try {
      const errorData = JSON.parse(error.message);
      if (errorData.errors) {
        // Railsのバリデーションエラー形式を想定
        errorMessage = Object.entries(errorData.errors)
          .map(([field, messages]) => {
            const fieldName = field; // 必要に応じてフィールド名を変換
            const messageText = Array.isArray(messages)
              ? messages.join(', ')
              : messages;
            return `${fieldName}: ${messageText}`;
          })
          .join('\n');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else {
        errorMessage = error.message; // JSONだが期待した形式ではない
      }
      if (typeof errorData.status === 'number') {
        statusCode = errorData.status;
      }
    } catch {
      errorMessage = error.message; // JSON解析失敗
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof error === 'object' && error !== null) {
    // Axios等のエラーオブジェクトからステータスを取得
    if ('response' in error) {
      const response = (error as { response?: { status?: unknown } }).response;
      if (typeof response?.status === 'number') {
        statusCode = response.status;
      }
    }
    // 一般的なエラーオブジェクトのmessageプロパティ
    if (
      'message' in error &&
      typeof (error as { message?: string }).message === 'string'
    ) {
      if (errorMessage === '不明なエラーが発生しました。') {
        errorMessage = (error as { message: string }).message;
      }
    }
  }

  return { message: errorMessage, status: statusCode };
};

export const useAuth = () => {
  const router = useRouter();
  const { post } = useApiMutations();
  const { setAuth, clearAuth, isAuthenticated, accessToken, client, uid } =
    useAuthStore();

  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
  } = useApiGet<User>(
    isAuthenticated && accessToken && client && uid
      ? '/api/auth/validate_token'
      : null
  );

  // 自動ログイン処理 (エラーハンドリングを強化し、結果オブジェクトを返す)
  const performAutoLogin = useCallback(
    async (email: string, password: string) => {
      try {
        console.log('自動ログイン試行:', email);
        const loginResponse = await post('/api/auth/sign_in', {
          email,
          password,
        });
        console.log('ログインレスポンス:', loginResponse);

        if (!loginResponse?.headers) {
          console.error('ログインレスポンスにヘッダー情報がありません');
          return { success: false, message: '認証情報が取得できませんでした' };
        }

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
        console.log('認証情報をセットしました。');
        return { success: true, data: loginResponse.data };
      } catch (error) {
        console.error('自動ログイン失敗:', error);
        const parsedError = parseApiError(error);
        return {
          success: false,
          message: `自動ログインに失敗しました: ${parsedError.message}`,
        };
      }
    },
    [post, setAuth]
  );

  // エラーメッセージを日本語化する関数
  const translateErrorMessage = (message: string | undefined): string => {
    if (!message) return '不明なエラーが発生しました。';

    if (message.includes('Email has already been taken')) {
      return 'このメールアドレスは既に登録されています。別のメールアドレスを使用してください。';
    }
    if (message.includes('Password is too short')) {
      return 'パスワードが短すぎます。8文字以上で入力してください。';
    }
    if (message.includes("Password confirmation doesn't match Password")) {
      return 'パスワードと確認用パスワードが一致しません。';
    }
    return message;
  };

  // ログイン処理
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const loginResult = await performAutoLogin(email, password);
        if (loginResult.success) {
          router.push('/home');
        } else {
          const errorMessage = translateErrorMessage(loginResult.message);
          // toast.error(errorMessage);
          return { success: false, message: errorMessage };
        }
        return { success: true };
      } catch (error) {
        const parsedError = parseApiError(error);
        const errorMessage = translateErrorMessage(parsedError.message);
        // toast.error(errorMessage);
        return { success: false, message: errorMessage };
      }
    },
    [router, performAutoLogin]
  );

  // ログアウト処理
  const logout = useCallback(async () => {
    try {
      await post('/api/auth/sign_out', {});
      clearAuth();
      router.push('/');
      return { success: true };
    } catch (error) {
      const parsedError = parseApiError(error);
      const errorMessage = translateErrorMessage(parsedError.message);
      // toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [post, router, clearAuth]);

  // ユーザー登録処理
  const {
    trigger: registerTrigger,
    isMutating: isRegistering,
    error: registrationError,
  } = useSWRMutation(
    '/api/auth',
    async (key, { arg }: { arg: RegisterParams }) => {
      const params = arg;
      let userId: number | null = null;

      // --- ステップ 1: ユーザー基本情報登録 ---
      try {
        const userResponse = await post('/api/auth', {
          email: params.mail,
          password: params.password,
          password_confirmation: params.passwordConfirm,
          name: params.name,
          role_id: 4,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userId = (userResponse?.data as any)?.data?.id;
        if (!userId) {
          const potentialError =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (userResponse?.data as any)?.errors ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (userResponse?.data as any)?.message ||
            'ユーザーIDが取得できませんでした';
          const errorMessage = `ユーザー登録に失敗しました: ${JSON.stringify(potentialError)}`;
          // toast.error(errorMessage);
          return { success: false, message: errorMessage };
        }

        // --- ステップ 2: ユーザー詳細情報登録 ---
        await post('/user_details', {
          student_id: params.studentId,
          tel: params.tel,
          department_id: params.departmentId,
          grade_id: params.gradeId,
          user_id: userId,
        });

        // --- ステップ 3: 自動ログイン ---
        const loginResult = await performAutoLogin(
          params.mail,
          params.password
        );

        if (!loginResult.success) {
          const errorMessage = loginResult.message;
          // toast.error(errorMessage);
          return { success: false, message: errorMessage };
        }

        router.push('/home');
        return { success: true, data: loginResult.data };
      } catch (error) {
        const parsedError = parseApiError(error);
        let errorMessage: string;

        if (userId === null) {
          errorMessage = `ユーザー登録に失敗しました: ${translateErrorMessage(parsedError.message)}`;
        } else {
          if (parsedError.status === 404) {
            errorMessage = `ユーザー詳細登録のエンドポイントが見つかりません (404): ${translateErrorMessage(parsedError.message)}`;
          } else {
            errorMessage = `ユーザー登録は完了しましたが、後続処理（詳細登録または自動ログイン）でエラーが発生しました: ${translateErrorMessage(parsedError.message)}`;
          }
        }

        // toast.error(errorMessage);
        return { success: false, message: errorMessage };
      }
    }
  );

  // トークン検証のためのインターバル設定
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
    isUserLoading,
    userError: userError ? parseApiError(userError).message : null,
    isAuthenticated,
    registerTrigger,
    isRegistering,
    registrationError: registrationError
      ? parseApiError(registrationError).message
      : null,
    login,
    logout,
  };
};
