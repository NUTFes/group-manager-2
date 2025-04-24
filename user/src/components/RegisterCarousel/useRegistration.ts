import { useCallback, useState } from 'react';
import { RegisterParams } from '@/types/register/user';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { RegisterFormSchema } from './schema';

// 元々 errorNavigation.ts にあった関数
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

export const useRegistration = (
  validateForm: (step: number) => Promise<boolean>, // フォーム検証関数を引数で受け取る
  goToStep: (step: number) => void, // ステップ移動関数を引数で受け取る
  currentStep: number, // 現在のステップを引数で受け取る
  onClose?: () => void // モーダルを閉じる関数
) => {
  const { register: authRegister, isLoading } = useAuth();
  const [displayError, setDisplayError] = useState<string | null>(null);

  // APIエラー時に対応するステップへ移動する関数
  const navigateToErrorStep = useCallback(
    (apiErrors: Record<string, string[]> | undefined) => {
      const errorStep = determineErrorStep(apiErrors);
      if (errorStep >= 0) {
        goToStep(errorStep);
      }
    },
    [goToStep]
  );

  // 登録処理を実行する関数
  const handleRegisterSubmit = useCallback(
    async (data: RegisterFormSchema) => {
      setDisplayError(null);

      // フロントエンドバリデーションを実行
      const hasValidationErrors = await validateForm(currentStep);
      if (hasValidationErrors) {
        // エラーメッセージは各フィールドで表示される想定
        return;
      }

      // API に送信するデータ形式に変換
      const registerData: RegisterParams = {
        name: data.name,
        studentId: data.studentId,
        tel: data.tel,
        mail: data.mail,
        departmentId: Number(data.departmentId),
        gradeId: Number(data.gradeId),
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        userId: 0, // バックエンドで割り当てられる想定
      };

      // useAuth フックの register 関数を呼び出し
      const result = await authRegister(registerData);

      if (result.success) {
        toast.success('登録が完了しました。');
        if (onClose) onClose();
      } else {
        // API エラーメッセージを表示
        const errorMessage =
          result.message || '登録処理中に不明なエラーが発生しました。';
        setDisplayError(errorMessage);
        // API エラー内容に基づいてステップを移動
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
