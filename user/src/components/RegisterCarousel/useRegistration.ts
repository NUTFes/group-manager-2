import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import type { UseFormHandleSubmit } from 'react-hook-form';
import { toast } from 'react-toastify';
import { RegisterFormSchema } from './schema';

/**
 * APIエラーメッセージから対応するステップを特定する
 * @param errors APIから返されたエラー情報
 * @returns エラーが発生したステップ番号（-1: エラーなし）
 */
const determineErrorStep = (
  errors: Record<string, string[]> | undefined
): number => {
  if (!errors) {
    return -1;
  }
  const errorFields = Object.keys(errors);
  console.log('errorFields', errorFields);
  const step0Fields = ['email', 'mail', 'password', 'password_confirmation'];
  const step1Fields = [
    'name',
    'student_id',
    'tel',
    'grade_id',
    'department_id',
    'user_details',
  ];
  if (errorFields.some((field) => step0Fields.includes(field))) return 0;
  if (errorFields.some((field) => step1Fields.includes(field))) return 1;
  return -1;
};

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
  validateForm: (step: number) => Promise<boolean>,
  goToStep: (step: number) => void,
  currentStep: number,
  handleSubmit: UseFormHandleSubmit<RegisterFormSchema>
) => {
  // stateを定義
  const [isLoading, setIsLoading] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * APIエラー発生時に対応するステップに移動
   * @param apiErrors APIから返されたエラー情報
   */
  const navigateToErrorStep = useCallback(
    (apiErrors: Record<string, string[]> | undefined) => {
      const errorStep = determineErrorStep(apiErrors);
      if (errorStep >= 0) {
        goToStep(errorStep);
      }
    },
    [goToStep]
  );

  /**
   * 登録フォームの送信処理
   * バリデーション → API送信 → エラーハンドリング の流れで実行
   */
  const handleSignUpSubmit = handleSubmit(async (data) => {
    // ローディング状態を更新
    setDisplayError(null);
    setIsLoading(true);

    // バリデーションチェック
    const hasValidationErrors = await validateForm(currentStep);
    if (hasValidationErrors) {
      return;
    }

    // サインアップ関数をPOST
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/`, {
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
          role_id: 4,
        },
        user_details: {
          tel: data.tel,
          student_id: data.studentId,
          grade_id: data.gradeId,
          department_id: data.departmentId,
        },
      }),
      // レスポンスをJSON形式で取得
    }).then((res) => res.json());

    // サインアップの結果が成功の場合
    if (result.status === 'success') {
      toast.success('登録が完了しました。');
      toast.info('自動でログインします。そのままお待ちください。');

      signIn('credentials', {
        redirect: false,
        email: data.mail,
        password: data.password,
      })
        .then(() => {
          toast.success('ログインしました。');
          router.push('/home');
        })
        .catch((error) => {
          console.error('Login error:', error);
          toast.error('ログインに失敗しました。');
          toast.info('再度ログインしてください。');
          router.push('/');
        });

      // サインアップの結果が失敗の場合
    } else {
      // メールアドレスが既に登録されている場合
      if (result.errors.email) {
        if (result.errors.email.includes('has already been taken')) {
          setDisplayError('このメールアドレスは既に登録されています。');
        } else {
          setDisplayError('メールアドレスに誤りがあります。');
        }
        navigateToErrorStep(result.errors);
        setIsLoading(false);
        return;
      }

      // パスワードのバリデーションエラー
      if (result.errors.password) {
        if (result.errors.password.includes('is too short')) {
          setDisplayError('パスワードは6文字以上である必要があります。');
        } else {
          setDisplayError('パスワードに誤りがあります。');
        }
        navigateToErrorStep(result.errors);
        setIsLoading(false);
        return;
      }

      // パスワード確認のバリデーションエラー
      if (result.errors.password_confirmation) {
        if (
          result.errors.password_confirmation.includes("doesn't match Password")
        ) {
          setDisplayError('パスワードが一致しません。');
        } else {
          setDisplayError('パスワード確認に誤りがあります。');
        }
        navigateToErrorStep(result.errors);
        setIsLoading(false);
        return;
      }

      // user_detailsの値に誤りがある場合のエラーハンドリング
      if (result.errors.user_details) {
        // エラーメッセージとフィールドのマッピング
        const errorMapping = {
          tel: '電話番号に誤りがあります。',
          student_id: '学籍番号に誤りがあります。',
          grade_id: '学年に誤りがあります。',
          department_id: '学科に誤りがあります。',
        };

        // 配列に変換する
        const userDetailsErrors = Array.isArray(result.errors.user_details)
          ? result.errors.user_details
          : [result.errors.user_details];

        let foundError = false;

        // Object.entriesでエラーチェック
        for (const [field, message] of Object.entries(errorMapping)) {
          if (
            userDetailsErrors.some((error_txt: string) =>
              error_txt.includes(field)
            )
          ) {
            setDisplayError(message);
            foundError = true;
            break;
          }
        }

        // 特定のエラーが見つからない場合はデフォルトメッセージ
        if (!foundError) {
          setDisplayError('ユーザー詳細情報に誤りがあります。');
        }

        navigateToErrorStep(result.errors);
        setIsLoading(false);
        return;
      }

      // その他のエラー
      const errorMessage =
        result.message || '登録処理中に不明なエラーが発生しました。';
      setDisplayError(errorMessage);
      navigateToErrorStep(result.errors);
      setIsLoading(false);
    }
  });

  return {
    isLoading,
    handleSignUpSubmit,
    displayError,
  };
};
