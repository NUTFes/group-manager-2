/**
 * 従業員申請コンポーネント
 *
 * このコンポーネントは従業員申請機能のメインUIを提供します。
 * カスタムフックを使用してビジネスロジックとUI操作を分離し、
 * 保守性と再利用性を向上させています。
 *
 * 主な機能：
 * - 従業員申請の必要性選択（ラジオボタン）
 * - 従業員情報の入力・編集・削除
 * - 未登録グループ（代表・副代表のみ）の管理
 * - フォームバリデーションと送信処理
 * - 適切なトースト通知の表示
 */
import { FC, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { toast } from 'react-toastify';
import AccordionMenu from '@/components/AccordionMenu';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormList from '@/components/FormList';
import { EmployeeForm } from './EmployeesFrom/EmployeesForm';
import {
  useEmployeesForm,
  useEmployeesFormHandlers,
  useEmployeesFormState,
} from './EmployeesFrom/hooks';
import { useEmployeesBusinessLogic, useUnregisteredGroupLogic } from './hooks';
import { EmployeeFormItem } from './schema';

type EmployeesProps = {
  isDeadline?: boolean; // 申請期限が過ぎているかどうか
  isRegistered?: boolean; // 既に登録済みかどうか
  groupId: number; // 対象のグループID
};

/**
 * 従業員申請のメインコンポーネント
 * AccordionMenuでラップし、編集可能性や必須項目の制御を行います
 */
export const Employees: FC<EmployeesProps> = ({
  isDeadline,
  isRegistered,
  groupId,
}) => {
  return (
    <AccordionMenu
      title="従業員申請"
      isEdit={!isDeadline} // 期限内のみ編集可能
      isExist={isRegistered} // 登録済みの場合に表示
      required={true} // 必須項目として表示
    >
      <Content groupId={groupId} isDeadline={isDeadline} />
    </AccordionMenu>
  );
};

type ContentProps = {
  groupId: number;
  isDeadline?: boolean;
};

/**
 * 従業員申請のコンテンツ部分
 * 実際のフォーム表示とロジック処理を担当します
 */
const Content: FC<ContentProps> = ({ groupId, isDeadline }) => {
  const [isEditing, setEditing] = useState(false); // 編集モードの状態管理

  // トースト通知のコールバック
  const toastCallbacks = {
    onSuccess: (message: string) => toast.success(message),
    onError: (message: string) => toast.error(message),
  };

  // ビジネスロジック関連のhooks
  const {
    getEmployeesData, // 既存の従業員データ
    mutateEmployees, // 従業員データの再取得
    isCreating, // 新規作成中フラグ
    isUpserting, // 一括更新中フラグ
    handleEmployeeApplicationSubmit, // 従業員申請送信処理
    handleNoApplicationSubmit, // 申請なし送信処理
    handleEmployeeDeleteWithToast, // 従業員削除処理（トースト付き）
  } = useEmployeesBusinessLogic(groupId, toastCallbacks);

  // 未登録グループ関連のhooks
  const {
    unregisteredData, // 未登録グループデータ
    handleRegisterUnregisteredGroup, // 未登録グループ登録
    handleDeleteUnregisteredGroup, // 未登録グループ削除
  } = useUnregisteredGroupLogic(groupId, toastCallbacks);

  // フォーム関連のhooks（既存データがある場合はそれを、ない場合は空配列を初期値に設定）
  const form = useEmployeesForm(
    getEmployeesData && getEmployeesData.length > 0
      ? { needApplication: undefined, employees: getEmployeesData }
      : { needApplication: undefined, employees: [] }
  );

  // フォーム状態の監視
  const { needApplication, isSubmitDisabled } = useEmployeesFormState(form);

  // フォーム操作のイベントハンドラ
  const { handleEditStart, handleNeedApplicationChange, handleEmployeeRemove } =
    useEmployeesFormHandlers(form, {
      onEmployeeDelete: handleEmployeeDeleteWithToast, // 削除時のコールバック
      onMutateEmployees: async () => {
        await mutateEmployees(); // データ再取得
      },
    });

  // ===============================
  // UI用のイベントハンドラ群
  // ===============================

  /**
   * 編集ボタンクリック時の処理
   * 既存データでフォームを初期化し、編集モードに切り替え
   */
  const handleEdit = async () => {
    await handleEditStart(getEmployeesData);
    setEditing(true);
  };

  /**
   * ラジオボタン変更時の処理
   * 選択値に応じてフォーム状態を更新し、編集モードに切り替え
   */
  const handleRadioChange = async (value: string) => {
    await handleNeedApplicationChange(value, getEmployeesData);
    setEditing(true);
  };

  /**
   * 従業員削除ボタンクリック時の処理
   */
  const handleEmployeeDelete = async (field: EmployeeFormItem, idx: number) => {
    await handleEmployeeRemove(field, idx);
  };

  /**
   * 未登録グループ状態での編集ボタンクリック時の処理
   * 未登録グループを削除して編集モードに切り替え
   */
  const handleEditClick = async () => {
    await handleDeleteUnregisteredGroup();
    setEditing(true);
  };

  /**
   * 「代表・副代表のみで活動」選択時の登録処理
   * 従業員データを削除し、未登録グループを登録
   */
  const handleNoApplicationClick = async () => {
    try {
      await handleNoApplicationSubmit();
      await handleRegisterUnregisteredGroup();
      setEditing(false);
    } catch {
      // エラーハンドリングはhook内で処理済み
    }
  };

  /**
   * フォーム送信時の処理
   * 選択内容に応じて適切な処理を実行
   */
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (data.needApplication === 'yes' && data.employees) {
        // 従業員申請ありの場合：未登録グループを削除して従業員データを送信
        await handleDeleteUnregisteredGroup();
        await handleEmployeeApplicationSubmit({
          needApplication: data.needApplication,
          employees: data.employees,
        });
      } else if (data.needApplication === 'no') {
        // 従業員申請なしの場合：従業員データを削除して未登録グループを登録
        await handleNoApplicationSubmit();
        await handleRegisterUnregisteredGroup();
      }
      setEditing(false);
    } catch {
      // エラーハンドリングはhook内で処理済み
    }
  });

  // ===============================
  // レンダリング条件分岐
  // ===============================

  // 未登録グループ状態の表示
  if (unregisteredData) {
    return (
      <div className="flex flex-col items-center rounded-2xl border bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <div className="mb-2 text-lg font-bold">
            従業員申請は不要（登録済み）
          </div>
          <div>「代表」または、「副代表」だけで活動します。</div>
        </div>
        <Button
          size="pc"
          color="main"
          icon="pencil"
          type="button"
          onClick={handleEditClick}
        >
          修正
        </Button>
      </div>
    );
  }

  // 従業員データがあり、期限内かつ非編集モードの場合：テーブル表示
  if (
    getEmployeesData &&
    getEmployeesData.length > 0 &&
    !isDeadline &&
    !isEditing
  ) {
    const tableData = (getEmployeesData ?? []).map((i) => ({
      name: i.name,
      studentId: i.studentId,
    }));

    return (
      <FormList
        items={tableData}
        headers={['従業員名', '学籍番号']}
        keys={['name', 'studentId']}
        tableMode
        onEdit={handleEdit}
        isEdit={!isDeadline}
      />
    );
  }

  // フォーム表示（新規登録・編集モード）
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        {/* ラジオボタン：従業員申請の必要性 */}
        <Radio
          label="あなたの団体は「代表」と「副代表」だけで活動していますか？"
          required
          value={
            needApplication === 'yes'
              ? '1' // 「はい」→ 従業員申請なし
              : needApplication === 'no'
                ? '2' // 「いいえ」→ 従業員申請あり
                : ''
          }
          onChange={handleRadioChange}
          options={[
            { id: 1, name: 'はい' },
            { id: 2, name: 'いいえ' },
          ]}
        />

        {/* 未選択時：無効化された送信ボタンのみ表示 */}
        {form.watch('needApplication') === undefined && (
          <div className="mt-6 flex w-full items-center justify-center">
            <Button size="pc" color="main" type="submit" isDisable>
              登録
            </Button>
          </div>
        )}

        {/* 「いいえ」選択時：従業員入力フォーム表示 */}
        {form.watch('needApplication') === 'yes' && (
          <>
            {form.fieldArray.fields.map((field, idx) => (
              <EmployeeForm
                key={field.fieldId}
                index={idx}
                onDelete={() => handleEmployeeDelete(field, idx)}
              />
            ))}
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                size="pc"
                color="main"
                icon="plus"
                variant
                onClick={form.appendEmpty}
              >
                従業員の追加
              </Button>
              <Button
                size="pc"
                color="main"
                type="submit"
                isDisable={isSubmitDisabled || isCreating || isUpserting}
              >
                登録
              </Button>
            </div>
          </>
        )}

        {/* 「はい」選択時：代表・副代表のみで活動する場合の登録ボタン */}
        {needApplication === 'no' && (
          <div className="mt-6 flex w-full items-center justify-center">
            <Button
              size="pc"
              color="main"
              type="button"
              onClick={handleNoApplicationClick}
            >
              登録
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default Employees;
