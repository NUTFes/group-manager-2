import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import type { TFunction } from 'i18next';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import type { UseFormHandleSubmit } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { RegisterFormSchema } from './schema';

type ApiErrors = Record<string, string[]>;

const ERROR_MESSAGE_KEYS: Record<string, Record<string, string>> = {
  email: {
    'has already been taken': 'registerCarousel.errors.emailTaken',
    default: 'registerCarousel.errors.emailDefault',
  },
  password: {
    'is too short': 'registerCarousel.errors.passwordShort',
    default: 'registerCarousel.errors.passwordDefault',
  },
  password_confirmation: {
    "doesn't match Password": 'registerCarousel.errors.passwordConfirmMismatch',
    default: 'registerCarousel.errors.passwordConfirmDefault',
  },
  user_details: {
    tel: 'registerCarousel.errors.telInvalid',
    student_id: 'registerCarousel.errors.studentIdInvalid',
    grade_id: 'registerCarousel.errors.gradeInvalid',
    department_id: 'registerCarousel.errors.departmentInvalid',
    default: 'registerCarousel.errors.userDetailsDefault',
  },
};

const STEP_FIELDS: Record<number, string[]> = {
  0: ['email', 'password', 'password_confirmation'],
  1: ['name', 'tel', 'student_id', 'grade_id', 'department_id', 'user_details'],
};

/**
 * エラーメッセージをマッピングして適切なメッセージを返す関数
 * @param errors APIから返されたエラー情報
 * @returns 対応するエラーメッセージ（なければ空文字）
 */
function mapErrorMessage(
  errors: ApiErrors = {},
  t: TFunction<'common'>
): string {
  for (const [field, msgs] of Object.entries(errors)) {
    const mapping = ERROR_MESSAGE_KEYS[field];
    if (!mapping) continue;

    for (const [key, translationKey] of Object.entries(mapping)) {
      if (key !== 'default' && msgs.some((m) => m.includes(key))) {
        return t(translationKey);
      }
    }
    if (mapping.default) {
      return t(mapping.default);
    }
  }
  return '';
}

/**
 * エラーが発生したフォームステップを特定する関数
 * @param errors APIから返されたエラー情報
 * @returns エラーが発生したステップ番号（-1: エラーなし）
 */
function detectErrorStep(errors: ApiErrors = {}): number {
  const fields = Object.keys(errors); // エラーフィールドを取得
  for (const [step, targetFields] of Object.entries(STEP_FIELDS)) {
    // 各ステップのフィールドとエラーフィールドを比較
    if (fields.some((f) => targetFields.includes(f))) {
      return Number(step); // 該当するステップ番号を返す
    }
  }
  return -1; // 該当するステップがない場合は-1を返す
}

/**
 * ユーザー登録処理を管理するカスタムフック
 *
 * 機能:
 * - フォームデータの送信
 * - エラーハンドリング
 * - 登録成功時の処理
 * - ローディング状態の管理
 */
export const useRegistration = (
  validateForm: (step: number) => Promise<boolean>, // 各ステップのバリデーション関数
  goToStep: (step: number) => void, // 指定ステップに移動する関数
  currentStep: number, // 現在のステップ番号
  handleSubmit: UseFormHandleSubmit<RegisterFormSchema> // フォーム送信ハンドラー
) => {
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const [displayError, setDisplayError] = useState<string>(); // 表示するエラーメッセージ
  const router = useRouter(); // ルーターオブジェクト
  const { t } = useTranslation('common');

  /**
   * APIエラー発生時に対応するステップに移動
   * @param errors APIから返されたエラー情報
   */
  const navigateToStep = useCallback(
    (errors?: ApiErrors) => {
      const step = detectErrorStep(errors); // エラーが発生したステップを特定
      if (step >= 0) {
        goToStep(step); // 該当ステップに移動
      }
    },
    [goToStep] // goToStep関数を依存関係に追加
  );

  /**
   * 登録フォームの送信処理
   * バリデーション → API送信 → エラーハンドリング の流れで実行
   */
  const handleSignUpSubmit = handleSubmit(async (data) => {
    setDisplayError(undefined); // エラーメッセージをリセット
    setIsLoading(true); // ローディング状態を開始

    // 各ステップのバリデーション
    if (await validateForm(currentStep)) {
      setIsLoading(false); // バリデーション失敗時にローディング終了
      return;
    }

    try {
      // APIリクエストを送信
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          registration: {
            name: data.name,
            email: data.mail,
            password: data.password,
            password_confirmation: data.passwordConfirm,
            role_id: 3, // 固定値としてrole_idを設定
          },
          user_details: {
            tel: data.tel,
            student_id: data.studentId,
            grade_id: data.gradeId,
            department_id: data.departmentId,
          },
        }),
      });
      const result = await res.json(); // レスポンスをJSON形式で取得

      if (result.status === 'success') {
        // 登録成功時の処理
        toast.success(t('registerCarousel.toasts.registrationSuccess'));
        toast.info(t('registerCarousel.toasts.autoLogin'));

        await signIn('credentials', {
          redirect: false,
          email: data.mail,
          password: data.password,
        })
          .then(() => {
            toast.success(t('registerCarousel.toasts.loginSuccess'));
            router.push('/home'); // ホーム画面にリダイレクト
          })
          .catch((error) => {
            console.error('Login error:', error); // ログインエラーをログ出力
            toast.error(t('registerCarousel.toasts.loginFailed'));
            toast.info(t('registerCarousel.toasts.retryLogin'));
            router.push('/'); // トップページにリダイレクト
          });
        return;
      } else {
        // エラー時の処理
        const message =
          mapErrorMessage(result.errors, t) ||
          result.message ||
          t('registerCarousel.errors.requestError');
        setDisplayError(message); // エラーメッセージを設定
        navigateToStep(result.errors); // エラーが発生したステップに移動
      }
    } catch {
      // 通信エラー時の処理
      setDisplayError(t('registerCarousel.errors.requestFailed'));
    } finally {
      setIsLoading(false); // 最終的にローディング状態を終了
    }
  });

  return {
    handleSignUpSubmit, // フォーム送信ハンドラーを返す
    isLoading, // ローディング状態を返す
    displayError, // 表示するエラーメッセージを返す
    setDisplayError, // エラーメッセージを設定する関数を返す
  };
};
