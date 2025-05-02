import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import { PowerNegativeView, PowerSummaryView } from './components';
import { PowerFormView } from './components/PowerFormView';
import { RADIO_OPTIONS } from './constants';
import { usePowerApplication } from './hooks/usePowerApplication';
import { usePowerDisplay } from './hooks/usePowerDisplay';

type PowerProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
};

const Power: FC<PowerProps> = ({ isDeadline, isRegistered, groupId }) => {
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
  } = usePowerApplication(groupId);

  const { isEditing, applyPower, submitError, isSubmitted } = state;
  const { fields, addDevice, removeDevice, totalPower, isValid, formMethods } =
    powerForm;

  const { mode, setNegativeEditMode } = usePowerDisplay({
    applyPower,
    hasExisting,
    isEditing,
  });

  let content;
  switch (mode) {
    case 'negativeUndecided':
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
          showRegisterButton={!hasUnregistered}
          radioOptions={RADIO_OPTIONS}
          onEdit={() => setNegativeEditMode(true)}
          isEdit={true}
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
        />
      );
      break;
    case 'negativeRegister':
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
          showRegisterButton={!hasUnregistered}
          radioOptions={RADIO_OPTIONS}
          onEdit={() => setNegativeEditMode(true)}
          isEdit={true}
        />
      );
      break;
    case 'summary':
      content = (
        <PowerSummaryView
          devices={devices}
          onEdit={prepareFormForEditing}
          onDeleteDevice={handleDeleteDevice}
          isDeadline={!isDeadline}
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
          onSubmit={handleFormSubmit}
        />
      );
  }

  return (
    <AccordionMenu
      title={'電力申請'}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required={true}
    >
      {content}
    </AccordionMenu>
  );
};

export default Power;
