import { FC } from 'react';
import { FireEquipmentResponse } from '@/api/fireEquipmentApi';
import { HealthCenterSubmissionStatus } from '@/api/healthCenterSubmissionStatusApi';
import { NO_ID_STRING, RADIO_OPTIONS, YES_ID_STRING } from '@/utils/constant';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import { useFireEquipmentTexts } from '../constant';
import FireEquipmentForm from './FireEquipmentForm';
import { useFireEquipmentOrder } from './hooks';

type FireEquipmentFormViewProps = {
  groupId: number;
  fireEquipmentData?: FireEquipmentResponse;
  handleEditCancel?: () => void;
  submitLabel?: string;
  disableValidate?: boolean;
  status?: HealthCenterSubmissionStatus;
};

export const FireEquipmentFormView: FC<FireEquipmentFormViewProps> = ({
  groupId,
  fireEquipmentData,
  handleEditCancel,
  submitLabel,
  disableValidate = false,
}) => {
  const fireEquipmentTexts = useFireEquipmentTexts();
  const {
    isRegister,
    submitUnregisteredHandler,
    errorsUnregistered,
    isRegisterValue,
    setIsRegisterValue,
    values,
    errors,
    setValue,
    submitHandler,
    isEditing,
    validate,
    submitError,
  } = useFireEquipmentOrder(groupId, fireEquipmentData, handleEditCancel);

  return (
    <div className="flex flex-col gap-6">
      {/* 火気使用有無の選択 */}
      <div>
        <Radio
          label={fireEquipmentTexts.radio.question}
          value={isRegisterValue}
          onChange={(value) => {
            setIsRegisterValue(
              value as typeof YES_ID_STRING | typeof NO_ID_STRING
            );
          }}
          required
          options={RADIO_OPTIONS.map((option) => ({
            ...option,
            name:
              option.id.toString() === YES_ID_STRING
                ? fireEquipmentTexts.radio.options.yes
                : fireEquipmentTexts.radio.options.no,
          }))}
          error={errorsUnregistered.isRegister?.message}
        />
        <p className="max-w-[400px] break-words text-xs text-[#484848]">
          {fireEquipmentTexts.notes.excludedItems}
        </p>
      </div>

      {/* 火気不使用として登録するボタン */}
      <div style={{ display: isRegister ? 'none' : 'block' }}>
        <form onSubmit={submitUnregisteredHandler}>
          <div className="mt-8 flex flex-col items-center gap-4">
            {submitError && (
              <p className="max-w-[400px] break-words text-sm text-red-500">
                {submitError}
              </p>
            )}
            <Button type="submit" size="pc" color="main">
              {fireEquipmentTexts.buttons.register}
            </Button>
          </div>
        </form>
      </div>

      {/* 火気申請フォーム */}
      <div style={{ display: isRegister ? 'block' : 'none' }}>
        <form onSubmit={submitHandler}>
          <div className="flex w-full flex-col gap-10">
            <FireEquipmentForm
              values={values}
              errors={errors}
              setValue={setValue}
              isEditing={isEditing}
              handleEditCancel={handleEditCancel}
              validate={disableValidate ? undefined : validate}
              submitLabel={submitLabel}
            />
            {submitError && (
              <p className="text-center text-sm text-red-500">{submitError}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
