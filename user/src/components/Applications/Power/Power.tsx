import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import { PowerNegativeView, PowerSummaryView } from './components';
import { PowerFormView } from './components/PowerFormView';
import { RADIO_OPTIONS } from './constants';
import { usePowerApplication } from './hooks/usePowerApplication';

type PowerProps = {
  isDeadline?: boolean;
};

const Power: FC<PowerProps> = ({ isDeadline = false }) => {
  // TODO: ログイン認証が実装されたら修正する
  const groupId = 8;

  // 電力申請のカスタムフックから状態とロジックの取得
  const {
    state,
    isLoading,
    hasError,
    hasExisting,
    hasUnregistered,
    devices,
    powerForm,
    handleFormSubmit,
    handleApplyNegative,
    handleDeleteDevice,
    handleRadioChange,
    prepareFormForEditing,
    completeSubmission,
    getRadioValue,
  } = usePowerApplication(groupId);

  const { isEditing, applyPower, submitError, isSubmitted } = state;
  const { fields, addDevice, removeDevice, totalPower, isValid, formMethods } =
    powerForm;

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="w-[400px] py-4 text-center">
        <p>データを読み込み中です...</p>
      </div>
    );
  }

  // エラー表示
  if (hasError) {
    return (
      <div className="relative w-[400px] rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
        <strong className="font-bold">エラー：</strong>
        <span className="block sm:inline">
          データの取得に失敗しました。ページを再読込してください。
        </span>
      </div>
    );
  }

  let content;

  // 「いいえ」が選択された場合は最優先で処理
  if (applyPower === 'no') {
    content = (
      <PowerNegativeView
        radioValue={getRadioValue(applyPower)}
        onRadioChange={handleRadioChange}
        onNegativeSubmit={() => {
          handleApplyNegative();
          completeSubmission();
        }}
        isSubmitted={isSubmitted}
        submitError={submitError}
        showRegisterButton={!hasUnregistered}
        radioOptions={RADIO_OPTIONS}
      />
    );
  } else if (hasExisting && !isEditing) {
    // 既存データの表示（「いいえ」が選択されていない場合だけ）
    content = (
      <PowerSummaryView
        devices={devices}
        onEdit={prepareFormForEditing}
        onDeleteDevice={handleDeleteDevice}
        isDeadline={isDeadline}
      />
    );
  } else {
    // 新規登録・編集モード
    content = (
      <PowerFormView
        radioValue={getRadioValue(applyPower)}
        onRadioChange={handleRadioChange}
        formMethods={formMethods}
        fields={fields}
        onRemove={removeDevice}
        onAddDevice={addDevice}
        totalPower={totalPower}
        isValid={isValid}
        radioOptions={RADIO_OPTIONS}
        showForm={applyPower === 'yes'}
        onSubmit={handleFormSubmit}
      />
    );
  }

  return (
    <AccordionMenu
      title={'電力申請'}
      isEdit={false}
      isExist={false}
      required={true}
    >
      {content}
    </AccordionMenu>
  );
};

export default Power;
