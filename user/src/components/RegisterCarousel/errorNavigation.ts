/**
 * エラーオブジェクトに基づいて適切なステップを判断する
 * @param errors APIから返された可能性のあるエラーオブジェクト (フィールド名がキー)
 * @returns 移動すべきステップのインデックス（0: メール/パスワード関連, 1: ユーザー情報関連, -1: 該当なし）
 */
export const determineErrorStep = (
  errors: Record<string, string[]> | undefined
): number => {
  if (!errors) {
    return -1; // エラーオブジェクトがない場合は判断不可
  }

  const errorFields = Object.keys(errors);

  // ステップ0に関連する可能性のあるバックエンドのフィールド名
  const step0Fields = ['email', 'mail', 'password', 'password_confirmation'];
  // ステップ1に関連する可能性のあるバックエンドのフィールド名
  const step1Fields = [
    'name',
    'student_id',
    'tel',
    'grade_id',
    'department_id',
  ];

  // エラーフィールドにステップ0のものが含まれるかチェック
  if (errorFields.some((field) => step0Fields.includes(field))) {
    return 0;
  }

  // エラーフィールドにステップ1のものが含まれるかチェック
  if (errorFields.some((field) => step1Fields.includes(field))) {
    return 1;
  }

  // どのステップにも該当しない場合
  return -1;
};

/**
 * フィールドのバリデーションエラーを処理する
 * @param errors エラーオブジェクト
 * @param values 入力値オブジェクト
 * @param currentStep 現在のステップ
 * @param trigger バリデーションをトリガーする関数
 * @returns エラーがあるかどうか
 */
export const validateCurrentStepFields = <T extends Record<string, unknown>>(
  errors: Record<string, unknown>,
  values: T,
  currentStep: number,
  trigger: (name: keyof T | (keyof T)[]) => Promise<boolean>
): boolean => {
  // 各ステップで検証するフィールド
  const stepFields: Record<number, Array<keyof T & string>> = {
    0: ['mail', 'password', 'passwordConfirm'] as Array<keyof T & string>, // メールアドレス入力ステップ
    1: ['name', 'studentId', 'tel', 'gradeId', 'departmentId'] as Array<
      keyof T & string
    >, // 代表者情報入力ステップ
  };

  const fieldsToValidate = stepFields[currentStep] || [];

  // 現在のステップのフィールドをすべて検証
  fieldsToValidate.forEach((field) => {
    trigger(field);
  });

  // フィールドに入力があるか、エラーがないか確認
  const hasEmptyFields = fieldsToValidate.some((field) => {
    if (field === 'gradeId' || field === 'departmentId') {
      return values[field] === 0;
    }
    return !values[field];
  });

  // エラーがあるか確認
  const hasErrors = fieldsToValidate.some((field) => !!errors[field]);

  // 空フィールドがあるかエラーがある場合はtrueを返す
  return hasEmptyFields || hasErrors;
};
