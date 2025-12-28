import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import type { UseFormHandleSubmit } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { RegisterFormSchema } from './schema';

type ApiErrors = Record<string, string[]>;

const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  email: {
    'has already been taken': 'このメールアドレスは既に登録されています。',
    default: 'メールアドレスに誤りがあります。',
  },
  password: {
    'is too short': 'パスワードは6文字以上である必要があります。',
    default: 'パスワードに誤りがあります。',
  },
  password_confirmation: {
    "doesn't match Password": 'パスワードが一致しません。',
    default: 'パスワード確認に誤りがあります。',
  },
  user_details: {
    tel: '電話番号に誤りがあります。',
    student_id: '学籍番号に誤りがあります。',
    grade_id: '学年に誤りがあります。',
    department_id: '学科に誤りがあります。',
    default: 'ユーザー詳細情報に誤りがあります。',
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
function mapErrorMessage(errors: ApiErrors = {}): string {
  for (const [field, msgs] of Object.entries(errors)) {
    // 各フィールドに対応するエラーメッセージのマッピングを取得
    const mapping = ERROR_MESSAGES[field] || {};
    for (const key of Object.keys(mapping)) {
      // キーワードが一致するエラーメッセージを返す
      if (key !== 'default' && msgs.some((m) => m.includes(key))) {
        return mapping[key];
      }
    }
    // デフォルトメッセージがあればそれを返す
    if (mapping.default) {
      return mapping.default;
    }
  }
  // 該当するメッセージがない場合は空文字を返す
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
        toast.success('登録が完了しました。');
        toast.info('自動でログインします。そのままお待ちください。');

        await signIn('credentials', {
          redirect: false,
          email: data.mail,
          password: data.password,
        })
          .then(() => {
            toast.success('ログインしました。');
            router.push('/home'); // ホーム画面にリダイレクト
          })
          .catch((error) => {
            console.error('Login error:', error); // ログインエラーをログ出力
            toast.error('ログインに失敗しました。');
            toast.info('再度ログインしてください。');
            router.push('/'); // トップページにリダイレクト
          });
        return;
      } else {
        // エラー時の処理
        const message =
          mapErrorMessage(result.errors) ||
          result.message ||
          '通信エラーが発生しました。';
        setDisplayError(message); // エラーメッセージを設定
        navigateToStep(result.errors); // エラーが発生したステップに移動
      }
    } catch {
      // 通信エラー時の処理
      setDisplayError('通信に失敗しました。時間をおいて再度お試しください。');
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
