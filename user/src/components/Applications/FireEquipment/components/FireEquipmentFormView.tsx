import { FC } from 'react';
import { NO_ID_STRING, RADIO_OPTIONS, YES_ID_STRING } from '@/utils/constant';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import FireEquipmentForm from './FireEquipmentForm';
import { useFireEquipmentOrder } from './hooks';

type FireEquipmentFormViewProps = {
  groupId: number;
};
export const FireEquipmentFormView: FC<FireEquipmentFormViewProps> = ({
  groupId,
}) => {
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
  } = useFireEquipmentOrder(groupId);

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={submitUnregisteredHandler}>
        <Radio
          label="火器申請を使用しますか？"
          value={isRegisterValue}
          onChange={(value) => {
            setIsRegisterValue(
              value as typeof YES_ID_STRING | typeof NO_ID_STRING
            );
          }}
          required
          options={RADIO_OPTIONS}
          error={errorsUnregistered.isRegister?.message}
        />
        {!isRegister && (
          <div className="flex flex-col items-center gap-4">
            <Button type="submit" size="pc" color="main">
              登録
            </Button>
          </div>
        )}
      </form>
      {isRegister && (
        <form onSubmit={submitHandler}>
          <div className="flex w-full flex-col gap-10">
            <FireEquipmentForm
              values={values}
              errors={errors}
              setValue={setValue}
            />
          </div>
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4">
              <Button type="submit" size="pc" color="main">
                登録
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
