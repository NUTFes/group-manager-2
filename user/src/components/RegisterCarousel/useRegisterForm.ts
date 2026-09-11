import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RegisterFormSchema, RegisterSchema } from './schema';

/**
 * ユーザー登録フォームの状態管理とバリデーションを提供するカスタムフック
 *
 * 機能:
 * - フォームの状態管理（値の取得、設定、監視）
 * - バリデーション（Zodスキーマによる検証）
 * - ステップごとのフィールド検証
 */
export const useRegisterForm = () => {
  const formMethods = useForm<RegisterFormSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      studentId: '',
      mail: '',
      password: '',
      passwordConfirm: '',
      gradeId: 0,
      departmentId: 0,
      tel: '',
    },
    mode: 'all', // mode: 'onChange' や 'onBlur' も検討可
  });

  const { trigger, formState, watch } = formMethods;

  // 明示的に errors を使用していることを示す
  const { errors } = formState;
  const values = watch();

  /**
   * 現在のステップのフィールドをバリデーション
   * @param currentStep 現在のステップ番号
   * @returns バリデーションエラーの有無（true: エラーあり）
   */
  const validateCurrentStep = useCallback(
    async (currentStep: number): Promise<boolean> => {
      // 各ステップで検証するフィールド
      const stepFields: Record<number, Array<keyof RegisterFormSchema>> = {
        0: ['mail', 'password', 'passwordConfirm'],
        1: ['name', 'studentId', 'tel', 'gradeId', 'departmentId'],
      };

      const fieldsToValidate = stepFields[currentStep] || [];
      // trigger を await してバリデーション結果を待つ
      const results = await Promise.all(
        fieldsToValidate.map((field) => trigger(field))
      );
      // すべてのバリデーションが成功したか (true を返すか)
      const isValid = results.every((result) => result === true);

      // trigger 後に errors オブジェクトが更新されるのを待つのは難しいため、
      // trigger の結果 (isValid) を直接使用する
      return !isValid; // エラーがあれば true を返す
    },
    [trigger]
  );

  return {
    ...formMethods, // register, handleSubmit, errors, watch, setValue などを含む
    values, // watchの結果も返す
    validateCurrentStep,
    errors, // 明示的に errors を返す
  };
};
