import { FC } from 'react';
import { StageOptionResponse } from '@/api/stageOptionApi';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormContainer from '@/components/FormContainer';
import { stageOptionLabels } from '../../label';
import { useStageOptionFormHooks } from './hooks';

type StageOptionFormProps = {
  stageOptions?: StageOptionResponse;
  toEdit?: () => void;
  groupId?: number;
};

const StageOptionForm: FC<StageOptionFormProps> = ({
  stageOptions,
  toEdit,
  groupId,
}) => {
  const { t } = useTranslation('common');
  const {
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    createError,
    createIsMutating,
    updateError,
    updateIsMutating,
    options,
    convertToBoolean,
    validateEdit,
    formatRadioValue,
    values,
  } = useStageOptionFormHooks(stageOptions, groupId);

  if (createError || updateError) {
    toast.error(t('applications.stageOptions.messages.submitFailed'));
  }

  return (
    <FormContainer>
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.table(err))}
        className="w-full"
      >
        <div className="flex flex-col space-y-10">
          <Radio
            label={t(stageOptionLabels[0])}
            note={t('applications.stageOptions.notes.select')}
            onChange={(value) =>
              setValue('ownEquipment', convertToBoolean(value))
            }
            options={options}
            required
            value={formatRadioValue(values.ownEquipment)}
            error={errors.ownEquipment?.message}
          />
          <Radio
            label={t(stageOptionLabels[1])}
            note={t('applications.stageOptions.notes.select')}
            onChange={(value) => setValue('bgm', convertToBoolean(value))}
            options={options}
            required
            value={formatRadioValue(values.bgm)}
            error={errors.bgm?.message}
          />
          <Radio
            label={t(stageOptionLabels[2])}
            note={t('applications.stageOptions.notes.select')}
            onChange={(value) =>
              setValue('cameraPermission', convertToBoolean(value))
            }
            options={options}
            required
            value={formatRadioValue(values.cameraPermission)}
            error={errors.cameraPermission?.message}
          />
          <Radio
            label={t(stageOptionLabels[3])}
            note={t('applications.stageOptions.notes.select')}
            onChange={(value) => setValue('loudSound', convertToBoolean(value))}
            options={options}
            required
            value={formatRadioValue(values.loudSound)}
            error={errors.loudSound?.message}
          />
        </div>
        <div className="mt-10 flex w-full items-center justify-center">
          {stageOptions && (
            <div className="mr-4">
              <Button
                size="pc"
                color="main"
                variant
                type="button"
                onClick={toEdit}
              >
                {t('form.actions.cancel')}
              </Button>
            </div>
          )}
          <Button
            size="pc"
            color="main"
            type="submit"
            isDisable={createIsMutating || updateIsMutating || validateEdit()}
          >
            {stageOptions ? t('form.actions.edit') : t('form.actions.register')}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default StageOptionForm;
