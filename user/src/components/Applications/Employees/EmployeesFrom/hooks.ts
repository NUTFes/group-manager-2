/**
 * 従業員申請フォーム関連のカスタムフック集
 *
 * このファイルには、従業員申請フォームのUI操作とフォーム状態管理に関する
 * ロジックがまとめられています。ビジネスロジックとは分離されており、
 * 再利用性と保守性を向上させています。
 *
 * 主な機能：
 * - フォームの初期化と動的フィールド管理
 * - フォーム状態の監視と送信ボタンの制御
 * - 編集、削除、ラジオボタン変更などのイベントハンドリング
 */
import { useCallback, useMemo } from 'react';
import {
  NEED_APPLICATION,
  type NeedApplicationValue,
  RADIO_VALUE,
} from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  EmployeeFormItem,
  EmployeesForm,
  employeesFormSchema,
} from '../schema';

/**
 * 従業員申請フォームの基本機能を提供するhook
 *
 * @param initial - フォームの初期値
 * @returns react-hook-formのメソッド群と動的フィールド操作機能
 */
export const useEmployeesForm = (initial: EmployeesForm) => {
  // Zodスキーマを使用したバリデーション設定
  const methods = useForm<EmployeesForm>({
    resolver: zodResolver(employeesFormSchema),
    defaultValues: initial,
    mode: 'onChange', // リアルタイムバリデーション
  });

  // 動的な従業員フィールドの配列管理
  const fieldArray = useFieldArray({
    control: methods.control,
    name: 'employees',
    keyName: 'fieldId', // 一意キーとしてfieldIdを使用
  });

  // 空の従業員フィールドを追加する関数
  const appendEmpty = useCallback(async () => {
    fieldArray.append({ name: '', studentId: '' });
    await methods.trigger(); // バリデーションを再実行
  }, [fieldArray, methods]);

  return { ...methods, fieldArray, appendEmpty };
};

/**
 * フォーム状態監視と送信ボタン制御のhook
 *
 * フォームの状態（ラジオボタンの選択、バリデーション状態、従業員の有無）を
 * 監視し、送信ボタンの有効/無効状態を適切に制御します。
 *
 * @param form - useEmployeesFormから返されるフォームオブジェクト
 * @returns フォーム状態と送信ボタンの制御情報
 */
export const useEmployeesFormState = (
  form: ReturnType<typeof useEmployeesForm>
) => {
  // 従業員申請の必要性（ラジオボタンの値）
  const needApplication = form.watch('needApplication') as
    | NeedApplicationValue
    | undefined;

  // フォーム全体のバリデーション状態
  const isFormValid = form.formState.isValid;

  // 従業員が1人以上入力されているかチェック
  const hasEmployees = form.fieldArray.fields.length > 0;

  // 送信ボタンの有効/無効状態を計算
  const isSubmitDisabled = useMemo(() => {
    if (needApplication === NEED_APPLICATION.YES) {
      // 「はい」選択時：フォームが有効かつ従業員が1人以上必要
      return !isFormValid || !hasEmployees;
    } else if (needApplication === NEED_APPLICATION.NO) {
      // 「いいえ」選択時：常に送信可能
      return false;
    }
    // 未選択時：送信不可
    return true;
  }, [needApplication, isFormValid, hasEmployees]);

  return {
    needApplication,
    isFormValid,
    hasEmployees,
    isSubmitDisabled,
  };
};

/**
 * 従業員データの型定義
 * DB形式とフォーム形式の両方に対応するため、studentIdはstring|numberとしています
 */
interface EmployeeDataItem {
  id?: number;
  name: string;
  studentId: string | number; // DBでは number、フォームでは string
}

/**
 * フォーム操作のイベントハンドラを提供するhook
 *
 * 編集開始、ラジオボタン変更、従業員削除などのフォーム操作に関する
 * イベントハンドラをまとめて提供します。DB形式とフォーム形式の
 * データ変換も含まれています。
 *
 * @param form - useEmployeesFormから返されるフォームオブジェクト
 * @param callbacks - 外部処理（従業員削除、データ再取得）のコールバック
 * @returns フォーム操作のイベントハンドラ群
 */
export const useEmployeesFormHandlers = (
  form: ReturnType<typeof useEmployeesForm>,
  callbacks: {
    onEmployeeDelete?: (employeeId: number) => Promise<void>;
    onMutateEmployees?: () => Promise<void>;
  }
) => {
  /**
   * DB従業員データをフォーム形式に変換するヘルパー関数
   * studentIdをnumberからstringに変換します
   */
  const convertEmployeesToFormData = useCallback(
    (employees?: EmployeeDataItem[]) => {
      return employees?.map((employee) => ({
        ...employee,
        studentId: String(employee.studentId),
      }));
    },
    []
  );

  /**
   * 編集モード開始処理
   * 既存の従業員データがある場合はそれを、ない場合は適切な初期状態を設定します
   */
  const handleEditStart = useCallback(
    async (existingEmployees?: EmployeeDataItem[]) => {
      const employees = convertEmployeesToFormData(existingEmployees);

      if (existingEmployees && existingEmployees.length > 0) {
        // 既存データがある場合：「はい」を選択状態にして既存データを表示
        form.reset({
          needApplication: NEED_APPLICATION.YES,
          employees: employees,
        });
      } else {
        // データがない場合：「いいえ」を選択状態にして空フィールド1つを表示
        form.reset({
          needApplication: NEED_APPLICATION.NO,
          employees: [{ name: '', studentId: '' }],
        });
      }
      await form.trigger(); // バリデーション実行
    },
    [form, convertEmployeesToFormData]
  );

  /**
   * ラジオボタン変更時の処理
   * ラジオボタンの値に応じてフォーム状態を適切に更新します
   */
  const handleNeedApplicationChange = useCallback(
    async (value: string, existingEmployees?: EmployeeDataItem[]) => {
      // 文字列値をyes/noに変換（1='はい'=yes, 2='いいえ'=no）
      const newValue =
        value === RADIO_VALUE.YES ? NEED_APPLICATION.YES : NEED_APPLICATION.NO;
      await form.setValue('needApplication', newValue, {
        shouldValidate: true,
        shouldDirty: true,
      });

      const employees = convertEmployeesToFormData(existingEmployees);
      await form.trigger();

      if (newValue === NEED_APPLICATION.YES) {
        // 「はい」選択時：従業員フィールドを表示
        form.reset({
          needApplication: NEED_APPLICATION.YES,
          employees:
            employees && employees.length > 0
              ? employees
              : [{ name: '', studentId: '' }],
        });
      }
    },
    [form, convertEmployeesToFormData]
  );

  /**
   * 従業員削除処理
   * DB上の従業員データとフォーム上の従業員フィールドの両方を削除します
   */
  const handleEmployeeRemove = useCallback(
    async (field: EmployeeFormItem, index: number) => {
      // DBに保存済みの従業員を削除（IDがある場合）
      if (field.id && callbacks.onEmployeeDelete) {
        await callbacks.onEmployeeDelete(field.id);
        if (callbacks.onMutateEmployees) {
          await callbacks.onMutateEmployees(); // データ再取得
        }
      }
      // フォームから該当フィールドを削除
      form.fieldArray.remove(index);
    },
    [form.fieldArray, callbacks]
  );

  return {
    handleEditStart,
    handleNeedApplicationChange,
    handleEmployeeRemove,
    convertEmployeesToFormData,
  };
};

export const useEmployeeFormTexts = () => {
  const { t } = useTranslation('common');
  return {
    fields: {
      name: {
        label: t('applications.employees.form.labels.name'),
        note: t('applications.employees.form.notes.name'),
      },
      studentId: {
        label: t('applications.employees.form.labels.studentId'),
        note: t('applications.employees.form.notes.studentId'),
      },
    },
    buttons: {
      delete: t('form.actions.delete'),
    },
  };
};
