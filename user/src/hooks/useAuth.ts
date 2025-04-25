import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { deleteData, postData } from '@/api/api';
import { useAuthStore } from '@/stores/authStore';
import { RegisterParams } from '@/types/register/user';
import { useApiGet } from '@/hooks/useApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * ユーザー情報の型定義
 */
interface User {
  data: {
    user: {
      id: number;
      email: string;
      name: string;
      role_id: number;
      created_at: string;
      updated_at: string;
    };
  };
}

/**
 * ユーザー登録APIの成功レスポンスの型
 */
interface RegisterSuccessResponse {
  data: {
    id: number;
  };
}

/**
 * API関数の戻り値の型
 * 成功時と失敗時で異なる構造を持つ
 */
type AuthResult<T = unknown> =
  | { success: true; data?: T; message?: string }
  | {
      success: false;
      message: string;
      status?: number;
      errors?: Record<string, string[]>;
    };

/**
 * 認証情報を使用してユーザーデータを取得する
 * @param token アクセストークン
 * @param clientId クライアントID
 * @param uid ユーザーID
 * @returns ユーザー情報またはnull
 */
const getCurrentUser = async (
  token: string,
  clientId: string,
  uid: string
): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/current_user`, {
      headers: {
        'access-token': token,
        client: clientId,
        uid: uid,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error('ユーザーデータの取得中にエラーが発生しました:', error);
    return null;
  }
};

/**
 * 認証関連の機能を提供するカスタムフック
 *
 * 主な機能:
 * - ログイン/ログアウト処理
 * - ユーザー登録（基本情報と詳細情報の2段階登録）
 * - トークン検証
 * - エラーメッセージの日本語化
 */
export const useAuth = () => {
  const router = useRouter();
  const { setAuth, clearAuth, isAuthenticated, accessToken, client, uid } =
    useAuthStore();
  const [isMutating, setIsMutating] = useState(false);

  // 認証情報が存在する場合のみトークン検証を実行
  const { data: user, error: userFetchError } = useApiGet<User>(
    isAuthenticated && accessToken && client && uid
      ? '/api/auth/validate_token'
      : null
  );

  /**
   * APIエラーメッセージを日本語に翻訳
   * 主なエラーパターン:
   * - ログイン認証エラー
   * - メールアドレス重複
   * - パスワード長不足
   * - パスワード確認不一致
   */
  const translateErrorMessage = (message: string | undefined): string => {
    if (!message) return '不明なエラーが発生しました。';

    if (message.includes('Invalid login credentials')) {
      return 'メールアドレスまたはパスワードに誤りがあります。';
    }
    if (message.includes('Email has already been taken')) {
      return 'このメールアドレスは既に登録されています。';
    }
    if (message.includes('Password is too short')) {
      return 'パスワードは8文字以上で入力してください。';
    }
    if (message.includes("Password confirmation doesn't match Password")) {
      return 'パスワードと確認用パスワードが一致しません。';
    }

    return message;
  };

  /**
   * 認証情報を取得して保存する共通処理
   * ログインとユーザー登録の両方で使用
   */
  const performAutoLogin = useCallback(
    async (email: string, password: string): Promise<AuthResult<Headers>> => {
      const response = await postData<User>('/api/auth/sign_in', {
        email,
        password,
      });

      if (response.success) {
        const newAccessToken = response.headers.get('access-token');
        const newClient = response.headers.get('client');
        const newUid = response.headers.get('uid');

        if (!(newAccessToken && newClient && newUid)) {
          console.error('認証情報が不完全です:', {
            newAccessToken,
            newClient,
            newUid,
          });
          const message = '認証情報の取得に失敗しました。';
          return { success: false, message };
        }

        setAuth(newAccessToken, newClient, newUid);
        return { success: true, data: response.headers };
      } else {
        console.error('自動ログインAPI失敗:', response.error);
        const message = translateErrorMessage(response.error.message);
        return {
          success: false,
          message,
          status: response.error.status,
          errors: response.error.errors,
        };
      }
    },
    [setAuth]
  );

  /**
   * ユーザーログイン処理
   * 1. 認証情報の取得
   * 2. ユーザー情報の取得
   * 3. ホーム画面への遷移
   */
  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult<User>> => {
      setIsMutating(true);
      const loginResult = await performAutoLogin(email, password);
      setIsMutating(false);

      if (loginResult.success) {
        router.push('/home');
        const currentUser = await getCurrentUser(
          loginResult.data?.get('access-token') ?? '',
          loginResult.data?.get('client') ?? '',
          loginResult.data?.get('uid') ?? ''
        );
        if (currentUser?.data.user.id) {
          localStorage.setItem('user_id', currentUser.data.user.id.toString());
        }
        return { success: true, data: currentUser as User };
      } else {
        return {
          success: false,
          message: loginResult.message,
          status: loginResult.status,
          errors: loginResult.errors,
        };
      }
    },
    [performAutoLogin, router]
  );

  /**
   * ユーザーログアウト処理
   * 1. 認証情報の削除
   * 2. ルートページへの遷移
   */
  const logout = useCallback(async (): Promise<AuthResult<void>> => {
    setIsMutating(true);
    const response = await deleteData<void>('/api/auth/sign_out');
    setIsMutating(false);

    if (response.success) {
      clearAuth();
      router.push('/');
      return { success: true };
    } else {
      console.error('ログアウトAPI失敗:', response.error);
      const message = translateErrorMessage(response.error.message);
      return {
        success: false,
        message,
        status: response.error.status,
        errors: response.error.errors,
      };
    }
  }, [router, clearAuth]);

  /**
   * ユーザー登録処理
   * 3ステップで実行:
   * 1. ユーザー基本情報登録（メール、パスワード、名前）
   * 2. ユーザー詳細情報登録（学籍番号、電話番号、学部、学年）
   * 3. 自動ログイン
   */
  const register = useCallback(
    async (params: RegisterParams): Promise<AuthResult<User>> => {
      setIsMutating(true);
      let userId: number | null = null;

      // ステップ1: ユーザー基本情報登録
      const userResponse = await postData<RegisterSuccessResponse>(
        '/api/auth',
        {
          email: params.mail,
          password: params.password,
          password_confirmation: params.passwordConfirm,
          name: params.name,
          role_id: 4,
        }
      );

      if (!userResponse.success) {
        console.error('ユーザー登録API失敗(基本情報):', userResponse.error);
        const message = translateErrorMessage(userResponse.error.message);
        setIsMutating(false);
        return {
          success: false,
          message,
          status: userResponse.error.status,
          errors: userResponse.error.errors,
        };
      }

      const responseData = userResponse.data as
        | RegisterSuccessResponse
        | undefined;
      userId = responseData?.data?.id ?? null;
      if (userId === null) {
        console.error(
          'ユーザー登録後、ユーザーIDが取得できませんでした。',
          userResponse.data
        );
        const message =
          'ユーザー登録に成功しましたが、IDを取得できませんでした。';
        setIsMutating(false);
        return { success: false, message };
      }

      // ステップ2: ユーザー詳細情報登録
      const detailResponse = await postData<void>('/user_details', {
        student_id: params.studentId,
        tel: params.tel,
        department_id: params.departmentId,
        grade_id: params.gradeId,
        user_id: userId,
      });

      if (!detailResponse.success) {
        console.error('ユーザー登録API失敗(詳細情報):', detailResponse.error);
        const message = translateErrorMessage(detailResponse.error.message);
        setIsMutating(false);
        return {
          success: false,
          message: `ユーザー詳細情報の登録に失敗: ${message}`,
          status: detailResponse.error.status,
          errors: detailResponse.error.errors,
        };
      }

      // ステップ3: 自動ログイン
      await login(params.mail, params.password);

      router.push('/home');
      return { success: true, data: {} as User };
    },
    [login, router]
  );

  return {
    user,
    userError: userFetchError
      ? translateErrorMessage(userFetchError.message)
      : null,
    isAuthenticated,
    login,
    logout,
    register,
    isLoading: isMutating,
  };
};
