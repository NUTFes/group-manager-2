import { FC } from 'react';
import { NEED_APPLICATION, RADIO_VALUE } from '@/utils/constants';
import { FormProvider } from 'react-hook-form';
import AccordionMenu from '@/components/AccordionMenu';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormList from '@/components/FormList';
import { EmployeeForm } from './EmployeesFrom/EmployeesForm';
import { useEmployeesMainLogic } from './hooks';

type EmployeesProps = {
  isDeadline?: boolean; // 申請期限が過ぎているかどうか（true: 期限外、false: 期限内）
  isRegistered?: boolean; // 既に登録済みかどうか
  groupId: number; // 対象のグループID
  mutateCheckAllRegisteredGroups: () => void;
};

/**
 * 従業員申請のメインコンポーネント
 */
export const Employees: FC<EmployeesProps> = ({
  isDeadline,
  isRegistered,
  groupId,
  mutateCheckAllRegisteredGroups,
}) => {
  return (
    <AccordionMenu
      title="従業員申請"
      isEdit={!isDeadline} // 期限内（isDeadline=false）の場合のみ編集可能
      isExist={isRegistered} // 登録済みの場合に表示
      required={true} // 必須項目として表示
    >
      <Content
        groupId={groupId}
        isDeadline={isDeadline} // 期限切れ状態をそのまま渡す
        mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
      />
    </AccordionMenu>
  );
};

type ContentProps = {
  groupId: number;
  isDeadline?: boolean; // 申請期限が過ぎているかどうか（true: 期限外、false: 期限内）
  mutateCheckAllRegisteredGroups: () => void;
};
/**
 * 従業員申請のコンテンツ部分
 */
const Content: FC<ContentProps> = ({
  groupId,
  isDeadline,
  mutateCheckAllRegisteredGroups,
}) => {
  // すべてのロジックをhookに委譲
  const logic = useEmployeesMainLogic(
    groupId,
    isDeadline,
    mutateCheckAllRegisteredGroups
  );

  // 申請期限切れかつ、未登録状態（従業員データと申請しないデータが無い）の場合の表示
  if (logic.isDeadlineMode) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
          <div className="mb-4">
            <svg
              className="mx-auto size-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            申請期限が過ぎています
          </h3>
          <p className="text-sm text-gray-600">
            従業員申請の締切期限が過ぎているため、新規申請はできません。
          </p>
        </div>
      </div>
    );
  }

  // 「申請しない」を登録した場合のリスト表示（onEditとidEditで期限内・期限外のボタン表示を切り替える）
  if (logic.isUnregisteredGroup) {
    return (
      <FormList
        items={[
          {
            label: '従業員申請は不要(登録済み)',
            content: '代表と副代表だけで活動します。',
          },
        ]}
        onEdit={!isDeadline ? logic.handleEditClick : undefined} // 期限内の場合のみ編集可能
        isEdit={!isDeadline} // 期限内の場合のみ編集可能
      />
    );
  }

  // 従業員登録後のフォームリスト表示（onEditとidEditで期限内・期限外のボタン表示を切り替える）
  if (logic.isFormListMode) {
    return (
      <FormList
        items={logic.tableData}
        headers={['従業員名', '学籍番号']}
        keys={['name', 'studentId']}
        tableMode
        onEdit={!isDeadline ? logic.handleEdit : undefined} // 期限内の場合のみ編集可能
        isEdit={!isDeadline} // 期限内の場合のみ編集可能
      />
    );
  }

  // 期限前・修正可能な状態での表示
  return (
    <FormProvider {...logic.form}>
      <form onSubmit={logic.handleSubmit}>
        <Radio
          label="「代表」と「副代表」以外の従業員申請を行いますか？"
          required
          value={
            logic.formState.needApplication === NEED_APPLICATION.YES
              ? RADIO_VALUE.YES
              : logic.formState.needApplication === NEED_APPLICATION.NO
                ? RADIO_VALUE.NO
                : ''
          }
          onChange={logic.handleRadioChange}
          options={[
            { id: 1, name: 'はい' },
            { id: 2, name: 'いいえ' },
          ]}
        />

        {/* 未選択時：無効化された送信ボタン */}
        {logic.form.watch('needApplication') === undefined && (
          <div className="mt-6 flex w-full items-center justify-center">
            <Button size="pc" color="main" type="submit" isDisable>
              登録
            </Button>
          </div>
        )}

        {/* 「はい」選択時：従業員入力フォーム表示 */}
        {logic.form.watch('needApplication') === NEED_APPLICATION.YES && (
          <>
            <div className="flex w-full flex-col gap-10">
              {logic.form.fieldArray.fields.map((field, idx) => (
                <EmployeeForm
                  key={`${field.fieldId}-${idx}`}
                  index={idx}
                  onDelete={() => logic.handleEmployeeDelete(field, idx)}
                />
              ))}
              <div className="flex justify-center gap-4">
                <Button
                  type="button"
                  size="pc"
                  color="main"
                  icon="plus"
                  variant
                  onClick={logic.form.appendEmpty}
                >
                  従業員の追加
                </Button>
                <Button
                  size="pc"
                  color="main"
                  type="submit"
                  isDisable={
                    logic.formState.isSubmitDisabled ||
                    logic.businessLogic.isCreating ||
                    logic.businessLogic.isUpserting
                  }
                >
                  登録
                </Button>
              </div>
            </div>
          </>
        )}

        {/* 「いいえ」選択時：代表・副代表のみで活動 */}
        {logic.formState.needApplication === NEED_APPLICATION.NO && (
          <div className="mt-6 flex w-full items-center justify-center">
            <Button
              size="pc"
              color="main"
              type="button"
              onClick={logic.handleNoApplicationClick}
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
