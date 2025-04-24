import { useCallback, useState } from 'react';
import { RegisterParams } from '@/types/register/user';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
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
  const step0Fields = ['email', 'mail', 'password', 'password_confirmation'];
  const step1Fields = [
    'name',
    'student_id',
    'tel',
    'grade_id',
    'department_id',
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
  onClose?: () => void
) => {
  const { register: authRegister, isLoading } = useAuth();
  const [displayError, setDisplayError] = useState<string | null>(null);

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
  const handleRegisterSubmit = useCallback(
    async (data: RegisterFormSchema) => {
      setDisplayError(null);

      const hasValidationErrors = await validateForm(currentStep);
      if (hasValidationErrors) {
        return;
      }

      const registerData: RegisterParams = {
        name: data.name,
        studentId: data.studentId,
        tel: data.tel,
        mail: data.mail,
        departmentId: Number(data.departmentId),
        gradeId: Number(data.gradeId),
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        userId: 0,
      };

      const result = await authRegister(registerData);

      if (result.success) {
        toast.success('登録が完了しました。');
        if (onClose) onClose();
      } else {
        const errorMessage =
          result.message || '登録処理中に不明なエラーが発生しました。';
        setDisplayError(errorMessage);
        navigateToErrorStep(result.errors);
      }
    },
    [authRegister, onClose, validateForm, currentStep, navigateToErrorStep]
  );

  return {
    handleRegisterSubmit,
    isLoading,
    displayError,
  };
};
