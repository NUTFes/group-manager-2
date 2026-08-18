import { FC } from 'react';
import {
  HealthCenterSubmissionStatus,
  canEditApplication,
} from '@/api/healthCenterSubmissionStatusApi';
import { MdOutlineAccessTime } from 'react-icons/md';
import AccordionMenu from '@/components/AccordionMenu';
import { PowerNegativeView, PowerSummaryView } from './components';
import { PowerFormView } from './components/PowerFormView';
import { RADIO_OPTIONS } from './constants';
import { usePowerAccordionHooks } from './hooks/usePowerAccordionHooks';
import { usePowerApplication } from './hooks/usePowerApplication';
import { usePowerDisplay } from './hooks/usePowerDisplay';

type PowerProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
  status?: HealthCenterSubmissionStatus;
};

const Power: FC<PowerProps> = ({
  isDeadline,
  isRegistered,
  groupId,
  status,
}) => {
  const powerAccordionHooks = usePowerAccordionHooks();
  const isFormLocked = !canEditApplication(isDeadline, status);

  // 電力申請のカスタムフックから状態とロジックの取得
  const {
    state,
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
  } = usePowerApplication(groupId, status);

  const { isEditing, applyPower, submitError, isSubmitted } = state;
  const { fields, addDevice, removeDevice, totalPower, isValid, formMethods } =
    powerForm;

  const { mode, setNegativeEditMode } = usePowerDisplay({
    applyPower,
    hasExisting,
    isEditing,
    hasUnregistered,
    isDeadline: isFormLocked,
  });

  let content;
  switch (mode) {
    case 'negativeUndecided':
      content = (
        <PowerNegativeView
          radioValue={getRadioValue(applyPower)}
          onRadioChange={(v) => {
            handleRadioChange(v);
          }}
          onNegativeSubmit={() => {
            handleApplyNegative();
            completeSubmission();
            setNegativeEditMode(false);
          }}
          isSubmitted={isSubmitted}
          submitError={submitError}
          // 未選択(undecided)の間は「申請しない」の登録ボタンを出さない。
          // 火気使用申請と同様、「いいえ」を明示的に選んでから
          // (negativeRegister モードへ遷移してから)初めて表示する。
          showRegisterButton={false}
          radioOptions={RADIO_OPTIONS}
          onEdit={() => setNegativeEditMode(true)}
          isEdit={true}
        />
      );
      break;
    case 'negativeRegister':
      content = (
        <PowerNegativeView
          radioValue={getRadioValue(applyPower)}
          onRadioChange={(v) => {
            handleRadioChange(v);
          }}
          onNegativeSubmit={() => {
            handleApplyNegative();
            completeSubmission();
            setNegativeEditMode(false);
          }}
          isSubmitted={isSubmitted}
          submitError={submitError}
          showRegisterButton={!hasUnregistered}
          radioOptions={RADIO_OPTIONS}
          onEdit={() => setNegativeEditMode(true)}
          isEdit={true}
          onCancel={
            hasUnregistered ? () => setNegativeEditMode(false) : undefined
          }
        />
      );
      break;
    case 'negativeDisplay':
      content = (
        <PowerNegativeView
          radioValue={getRadioValue(applyPower)}
          onRadioChange={(v) => {
            handleRadioChange(v);
            setNegativeEditMode(true);
          }}
          onNegativeSubmit={() => {
            handleApplyNegative();
            completeSubmission();
            setNegativeEditMode(false);
          }}
          isSubmitted={isSubmitted}
          submitError={submitError}
          showRegisterButton={false}
          radioOptions={RADIO_OPTIONS}
          onEdit={() => setNegativeEditMode(true)}
          isEdit={false}
          isDeadline={isFormLocked}
        />
      );
      break;
    case 'deadlineNoData':
      content = (
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
            <div className="mb-4">
              <MdOutlineAccessTime className="mx-auto size-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              {powerAccordionHooks.powerAccordionTexts.deadline.title}
            </h3>
            <p className="text-sm text-gray-600">
              {powerAccordionHooks.powerAccordionTexts.deadline.description}
            </p>
          </div>
        </div>
      );
      break;
    case 'summary':
      content = (
        <PowerSummaryView
          devices={devices}
          onEdit={prepareFormForEditing}
          onDeleteDevice={handleDeleteDevice}
          isEditable={!isFormLocked}
        />
      );
      break;
    case 'form':
    default:
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
          submitError={submitError}
          onSubmit={handleFormSubmit}
        />
      );
  }

  return (
    <AccordionMenu
      title={powerAccordionHooks.powerAccordionTexts.title}
      isEdit={!isFormLocked}
      isExist={isRegistered}
      required={true}
      status={status}
    >
      {content}
    </AccordionMenu>
  );
};

export default Power;
