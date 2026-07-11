import { FC } from 'react';
import { HealthCenterSubmissionStatus } from '@/api/healthCenterSubmissionStatusApi';
import { NEED_APPLICATION, RADIO_VALUE } from '@/utils/constants';
import { FormProvider } from 'react-hook-form';
import { MdOutlineAccessTime } from 'react-icons/md';
import AccordionMenu from '@/components/AccordionMenu';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormList from '@/components/FormList';
import { EmployeeForm } from './EmployeesFrom/EmployeesForm';
import { useEmployeesApplicationHooks } from './hooks';

type EmployeesProps = {
  isDeadline?: boolean; // 申請期限が過ぎているかどうか（true: 期限外、false: 期限内）
  isRegistered?: boolean; // 既に登録済みかどうか
  groupId: number; // 対象のグループID
  mutateCheckAllRegisteredGroups: () => void;
  status?: HealthCenterSubmissionStatus; // 申請のステータス
};

/**
 * 従業員申請のメインコンポーネント
 */
export const Employees: FC<EmployeesProps> = ({
  isDeadline,
  isRegistered,
  groupId,
  mutateCheckAllRegisteredGroups,
  status,
}) => {
  const employeesApplicationHook = useEmployeesApplicationHooks(
    groupId,
    isDeadline,
    mutateCheckAllRegisteredGroups,
    status
  );
  return (
    <AccordionMenu
      title={employeesApplicationHook.texts.title}
      isEdit={!isDeadline} // 期限内の場合に編集可能
      isExist={isRegistered} // 登録済みの場合に表示
      required={true} // 必須項目として表示
      status={status} // 申請のステータスを渡す
    >
      <Content
        employeesApplicationHook={employeesApplicationHook}
        isDeadline={isDeadline}
        status={status}
      />
    </AccordionMenu>
  );
};

type ContentProps = {
  employeesApplicationHook: ReturnType<typeof useEmployeesApplicationHooks>;
  isDeadline?: boolean; // 申請期限が過ぎているかどうか（true: 期限外、false: 期限内）
  status?: HealthCenterSubmissionStatus; // 申請のステータス
};
/**
 * 従業員申請のコンテンツ部分
 */
const Content: FC<ContentProps> = ({
  employeesApplicationHook,
  isDeadline,
  status,
}) => {
  const { texts } = employeesApplicationHook;
  const isResubmission = status === 'waiting_resubmission'; // 再提出待ちの状態かどうか

  // 申請期限切れかつ、未登録状態（従業員データと申請しないデータが無い）の場合の表示
  if (employeesApplicationHook.isDeadlineMode) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
          <div className="mb-4">
            <MdOutlineAccessTime className="mx-auto size-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            {texts.deadline.title}
          </h3>
          <p className="text-sm text-gray-600">{texts.deadline.description}</p>
        </div>
      </div>
    );
  }

  // 「申請しない」を登録した場合のリスト表示（onEditとidEditで期限内・期限外のボタン表示を切り替える）
  if (employeesApplicationHook.isUnregisteredGroup) {
    return (
      <FormList
        items={[
          {
            label: texts.summary.noApplication.label,
            content: texts.summary.noApplication.description,
          },
        ]}
        onEdit={
          !isDeadline || isResubmission
            ? employeesApplicationHook.handleEditClick
            : undefined
        }
        isEdit={!isDeadline || isResubmission}
      />
    );
  }

  // 従業員登録後のフォームリスト表示（onEditとidEditで期限内・期限外のボタン表示を切り替える）
  if (employeesApplicationHook.isFormListMode) {
    return (
      <FormList
        items={employeesApplicationHook.tableData}
        headers={[texts.summary.headers.name, texts.summary.headers.studentId]}
        keys={['name', 'studentId']}
        tableMode
        onEdit={
          !isDeadline || isResubmission
            ? employeesApplicationHook.handleEdit
            : undefined
        }
        isEdit={!isDeadline || isResubmission}
      />
    );
  }

  // 期限前・修正可能な状態での表示
  return (
    <FormProvider {...employeesApplicationHook.form}>
      <form onSubmit={employeesApplicationHook.handleSubmit}>
        <Radio
          label={texts.radio.label}
          required
          value={
            employeesApplicationHook.formState.needApplication ===
            NEED_APPLICATION.YES
              ? RADIO_VALUE.YES
              : employeesApplicationHook.formState.needApplication ===
                  NEED_APPLICATION.NO
                ? RADIO_VALUE.NO
                : ''
          }
          onChange={employeesApplicationHook.handleRadioChange}
          options={texts.radio.options}
        />

        {/* 未選択時：無効化された送信ボタン */}
        {employeesApplicationHook.form.watch('needApplication') ===
          undefined && (
          <div className="mt-6 flex w-full items-center justify-center">
            <Button size="pc" color="main" type="submit" isDisable>
              {texts.formActions.register}
            </Button>
          </div>
        )}

        {/* 「はい」選択時：従業員入力フォーム表示 */}
        {employeesApplicationHook.form.watch('needApplication') ===
          NEED_APPLICATION.YES && (
          <>
            <div className="flex w-full flex-col gap-10">
              {employeesApplicationHook.form.fieldArray.fields.map(
                (field, idx) => (
                  <EmployeeForm
                    key={`${field.fieldId}-${idx}`}
                    index={idx}
                    onDelete={() =>
                      employeesApplicationHook.handleEmployeeDelete(field, idx)
                    }
                  />
                )
              )}
              <div className="flex justify-center gap-4">
                <Button
                  type="button"
                  size="pc"
                  color="main"
                  icon="plus"
                  variant
                  onClick={employeesApplicationHook.form.appendEmpty}
                >
                  {texts.buttons.addEmployee}
                </Button>
                <Button
                  size="pc"
                  color="main"
                  type="submit"
                  isDisable={
                    employeesApplicationHook.formState.isSubmitDisabled ||
                    employeesApplicationHook.employeesBusinessHooks
                      .isCreating ||
                    employeesApplicationHook.employeesBusinessHooks.isUpserting
                  }
                >
                  {texts.formActions.register}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* 「いいえ」選択時：代表・副代表のみで活動 */}
        {employeesApplicationHook.formState.needApplication ===
          NEED_APPLICATION.NO && (
          <div className="mt-6 flex w-full items-center justify-center">
            <Button
              size="pc"
              color="main"
              type="button"
              onClick={employeesApplicationHook.handleNoApplicationClick}
            >
              {texts.formActions.register}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default Employees;
