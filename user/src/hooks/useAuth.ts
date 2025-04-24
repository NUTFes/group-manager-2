import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { deleteData, postData } from '@/api/api';
import { useAuthStore } from '@/stores/authStore';
import { RegisterParams } from '@/types/register/user';
import { useApiGet } from '@/hooks/useApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
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

// ユーザー登録APIの成功レスポンスの型 (仮)
interface RegisterSuccessResponse {
  data: {
    id: number;
    // 他のユーザー情報...
  };
  // 他のレスポンス情報...
}

// ユーザー詳細登録APIの成功レスポンスの型 (仮、通常は成功ステータスのみか？)
// type UserDetailSuccessResponse = {}; // 使わない場合は不要

// API関数の戻り値の型 (T = unknown に変更)
type AuthResult<T = unknown> =
  | { success: true; data?: T; message?: string }
  | {
      success: false;
      message: string;
      status?: number;
      errors?: Record<string, string[]>;
    };

// ユーザーデータを取得する関数
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
    console.log('response:', response);

    if (response.ok) {
      const data = await response.json();
      console.log('data:', data);
      return data;
    }
    return null;
  } catch (error) {
    console.error('ユーザーデータの取得中にエラーが発生しました:', error);
    return null;
  }
};

export const useAuth = () => {
  const router = useRouter();
  const { setAuth, clearAuth, isAuthenticated, accessToken, client, uid } =
    useAuthStore();
  // 各アクション実行中のローディング状態
  const [isMutating, setIsMutating] = useState(false);

  // useApiGet は SWR ベースなのでエラーを throw する fetcher を使う
  const {
    data: user,
    error: userFetchError, // SWR が fetcher から throw されたエラーを受け取る
  } = useApiGet<User>(
    // 条件付きフェッチ
    isAuthenticated && accessToken && client && uid
      ? '/api/auth/validate_token'
      : null
  );

  // エラーメッセージを日本語化するヘルパー関数
  const translateErrorMessage = (message: string | undefined): string => {
    if (!message) return '不明なエラーが発生しました。';
    // 翻訳ルールを追加・修正
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
    // 他の英語メッセージに対する翻訳ルール...
    return message; // 翻訳ルールがなければそのまま返す
  };

  // 自動ログイン処理
  const performAutoLogin = useCallback(
    async (email: string, password: string): Promise<AuthResult<Headers>> => {
      // postData は ApiResponse<T> を返す (エラーは throw しない)
      const response = await postData<User>('/api/auth/sign_in', {
        email,
        password,
      });

      if (response.success) {
        // 成功した場合、ヘッダーから認証情報を取得
        const newAccessToken = response.headers.get('access-token');
        const newClient = response.headers.get('client');
        const newUid = response.headers.get('uid');

        if (!(newAccessToken && newClient && newUid)) {
          console.error('認証情報が不完全です:', {
            newAccessToken,
            newClient,
            newUid,
          });
          // 成功レスポンスだが情報不備の場合もエラー扱い
          const message = '認証情報の取得に失敗しました。';
          return { success: false, message };
        }

        // 認証情報をストアに保存
        setAuth(newAccessToken, newClient, newUid);
        return { success: true, data: response.headers };
      } else {
        // API呼び出しが失敗した場合 (response.success が false)
        console.error('自動ログインAPI失敗:', response.error);
        const message = translateErrorMessage(response.error.message);
        // 呼び出し元にエラー情報を返す
        return {
          success: false,
          message,
          status: response.error.status,
          errors: response.error.errors,
        };
      }
    },
    [setAuth] // 依存配列: setAuth
  );

  // ログイン処理
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

  // ログアウト処理
  const logout = useCallback(async (): Promise<AuthResult<void>> => {
    setIsMutating(true);
    const response = await deleteData<void>('/api/auth/sign_out');
    setIsMutating(false);

    if (response.success) {
      clearAuth(); // ストアの認証情報をクリア
      router.push('/'); // ルートページにリダイレクト
      return { success: true };
    } else {
      // API呼び出しが失敗した場合
      console.error('ログアウトAPI失敗:', response.error);
      const message = translateErrorMessage(response.error.message);
      return {
        success: false,
        message,
        status: response.error.status,
        errors: response.error.errors,
      };
    }
  }, [router, clearAuth]); // 依存配列: router, clearAuth

  // ユーザー登録処理
  const register = useCallback(
    async (params: RegisterParams): Promise<AuthResult<User>> => {
      setIsMutating(true);
      let userId: number | null = null;

      // --- ステップ 1: ユーザー基本情報登録 ---
      const userResponse = await postData<RegisterSuccessResponse>(
        '/api/auth',
        {
          email: params.mail,
          password: params.password,
          password_confirmation: params.passwordConfirm,
          name: params.name,
          role_id: 4, // 固定値？
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

      // レスポンスからユーザーIDを取得 (レスポンス形式に合わせて要調整)
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

      // --- ステップ 2: ユーザー詳細情報登録 ---
      const detailResponse = await postData<void>('/user_details', {
        student_id: params.studentId,
        tel: params.tel,
        department_id: params.departmentId,
        grade_id: params.gradeId,
        user_id: userId, // 取得した user_id を使用
      });

      if (!detailResponse.success) {
        console.error('ユーザー登録API失敗(詳細情報):', detailResponse.error);
        // ここでロールバック処理が必要な場合がある（例: 作成したユーザーを削除）
        const message = translateErrorMessage(detailResponse.error.message);
        setIsMutating(false);
        return {
          success: false,
          message: `ユーザー詳細情報の登録に失敗: ${message}`,
          status: detailResponse.error.status,
          errors: detailResponse.error.errors,
        };
      }

      // --- ステップ 3: 自動ログイン ---
      await login(params.mail, params.password);

      // 全て成功
      router.push('/home');
      return { success: true, data: {} as User };
    },
    [login, router] // 依存配列: login, router
  );

  // トークン検証 (useApiGetが担当、エラーはuserFetchErrorで受け取る)
  // useEffect(() => { ... }, [isAuthenticated]);

  return {
    user,
    // useApiGet (SWR) が throw したエラー
    userError: userFetchError
      ? translateErrorMessage(userFetchError.message) // SWRエラーも翻訳
      : null,
    isAuthenticated,
    login,
    logout,
    register,
    isLoading: isMutating, // 登録/ログイン/ログアウト実行中のローディング状態
  };
};
