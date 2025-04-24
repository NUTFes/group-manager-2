import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RegisterFormSchema, RegisterSchema } from './schema';

// 元々 errorNavigation.ts にあった関数 - 使われていないので削除
// const validateCurrentStepFieldsInternal = <T extends RegisterFormSchema>(...

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

  // フロントエンドバリデーションを実行する関数
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
