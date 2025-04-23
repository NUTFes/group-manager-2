/**
 * エラーメッセージに基づいて適切なステップを判断する
 * @param errorMessage エラーメッセージ
 * @returns 移動すべきステップのインデックス（0: メールアドレス入力, 1: 代表者情報入力, -1: 該当なし）
 */
export const determineErrorStep = (errorMessage: string): number => {
  // メールアドレスやパスワードに関するエラーであればステップ1に移動
  if (
    errorMessage.includes('メールアドレス') ||
    errorMessage.includes('パスワード') ||
    errorMessage.includes('mail') ||
    errorMessage.includes('email') ||
    errorMessage.includes('password')
  ) {
    return 0; // メールアドレス入力ステップ
  }

  // 代表者情報に関するエラーであればステップ2に移動
  if (
    errorMessage.includes('名前') ||
    errorMessage.includes('学籍番号') ||
    errorMessage.includes('電話番号') ||
    errorMessage.includes('学年') ||
    errorMessage.includes('学科') ||
    errorMessage.includes('name') ||
    errorMessage.includes('studentId') ||
    errorMessage.includes('tel') ||
    errorMessage.includes('gradeId') ||
    errorMessage.includes('departmentId')
  ) {
    return 1; // 代表者情報入力ステップ
  }

  // 該当するエラーカテゴリが見つからない場合
  return -1;
};

/**
 * エラーを処理し、メッセージを表示する
 * @param error エラーオブジェクト
 * @param setDisplayError エラーメッセージを設定する関数
 * @param defaultMessage デフォルトのエラーメッセージ
 * @returns エラーメッセージとエラーステップを含むオブジェクト
 */
export const handleError = (
  error: unknown,
  setDisplayError: (message: string | null) => void,
  defaultMessage = '予期せぬエラーが発生しました。'
): { message: string; step: number } => {
  let errorMessage: string;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = defaultMessage;
  }

  // エラーメッセージを表示
  setDisplayError(errorMessage);

  // 適切なステップを決定
  const step = determineErrorStep(errorMessage);

  return { message: errorMessage, step };
};

/**
 * 登録エラーを処理し、適切なステップに誘導する
 * @param result API呼び出し結果
 * @param registrationError 登録エラー
 * @param setDisplayError エラー表示関数
 * @param navigateToStep ステップ遷移関数
 * @returns エラーメッセージとステップを含むオブジェクト（エラーがない場合はnull）
 */
export const handleRegistrationError = (
  result: { success?: boolean; message?: string } | undefined,
  registrationError: string | null,
  setDisplayError: (message: string | null) => void,
  navigateToStep: (step: number) => void
): { message: string; step: number } | null => {
  // 成功した場合はnullを返す
  if (result?.success) {
    return null;
  }

  let errorMessage: string;

  // エラーメッセージの優先順位: result.message > registrationError > デフォルトメッセージ
  if (result?.message) {
    errorMessage = result.message;
  } else if (registrationError) {
    errorMessage = registrationError;
  } else {
    errorMessage = '登録処理中に不明なエラーが発生しました。';
  }

  // エラーメッセージを設定
  setDisplayError(errorMessage);

  // 適切なステップを決定
  const step = determineErrorStep(errorMessage);

  // 特定のステップに関連するエラーの場合、そのステップに移動
  if (step >= 0) {
    navigateToStep(step);
  }

  return { message: errorMessage, step };
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
