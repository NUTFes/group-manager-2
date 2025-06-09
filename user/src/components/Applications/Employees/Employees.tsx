import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import AccordionMenu from '@/components/AccordionMenu';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormList from '@/components/FormList';
import { EmployeeForm } from './EmployeesFrom/EmployeesForm';
import { NEED_APPLICATION, RADIO_VALUE } from './constants';
import { useEmployeesMainLogic } from './hooks';

type EmployeesProps = {
  isDeadline?: boolean; // 申請期限が過ぎているかどうか
  isRegistered?: boolean; // 既に登録済みかどうか
  groupId: number; // 対象のグループID
};

/**
 * 従業員申請のメインコンポーネント
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
 */
const Content: FC<ContentProps> = ({ groupId, isDeadline }) => {
  // すべてのロジックをhookに委譲
  const logic = useEmployeesMainLogic(groupId, isDeadline);

  // 「申請しない」を登録した場合のリスト表示
  if (logic.isUnregisteredGroup) {
    return (
      <FormList
        items={[
          {
            label: '従業員申請は不要(登録済み)',
            content: '代表と副代表だけで活動します。',
          },
        ]}
        onEdit={logic.handleEditClick}
        isEdit={!isDeadline}
      ></FormList>
    );
  }

  // 従業員登録後のフォームリスト表示
  if (logic.isFormListMode) {
    return (
      <FormList
        items={logic.tableData}
        headers={['従業員名', '学籍番号']}
        keys={['name', 'studentId']}
        tableMode
        onEdit={logic.handleEdit}
        isEdit={!isDeadline}
      />
    );
  }

  // 申請前のフォーム表示
  return (
    <FormProvider {...logic.form}>
      <form onSubmit={logic.handleSubmit}>
        {/* ラジオボタン：従業員申請の必要性 */}
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
                  key={field.fieldId}
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
