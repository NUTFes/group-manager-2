import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { stageLabels } from '@/components/Applications/label';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import { useStageFormLogic } from '../hooks';
import { useStageFormViewLogic } from '../hooks/useStageFormViewLogic';

type Props = { isDeadline?: boolean; groupId: number };
const StageForm: FC<Props> = ({ isDeadline, groupId }) => {
  const { t } = useTranslation('common');
  const {
    formState,
    updateField,
    dateOptions,
    filteredSunny1,
    filteredSunny2,
    filteredRainy1,
    filteredRainy2,
    onSubmit,
    isLoadingAll,
    hasError,
    submitError,
    hasExisting,
    isValid,
    isSubmitted,
    sunnyStageOptions,
    rainyStageOptions,
    getErrorMessage,
    resetForm,
  } = useStageFormLogic(groupId);

  const { isFormMode, toEdit, toCancel } = useStageFormViewLogic({
    hasExisting,
    isDeadline,
    isLoadingAll,
    isSubmitted,
  });

  const {
    date,
    sunnyFirstChoice,
    sunnySecondChoice,
    rainyFirstChoice,
    rainySecondChoice,
    prepTime,
    performTime,
    cleanupTime,
    errors,
  } = formState;

  const items: FormItem[] = [
    {
      label: t(stageLabels[0]),
      content: dateOptions.find((o) => o.id === +date)?.name || '',
    },
    {
      label: t(stageLabels[1]),
      content:
        sunnyStageOptions.find((o) => o.id === +sunnyFirstChoice)?.name || '',
    },
    {
      label: t(stageLabels[2]),
      content:
        sunnyStageOptions.find((o) => o.id === +sunnySecondChoice)?.name || '',
    },
    {
      label: t(stageLabels[3]),
      content:
        rainyStageOptions.find((o) => o.id === +rainyFirstChoice)?.name || '',
    },
    {
      label: t(stageLabels[4]),
      content:
        rainyStageOptions.find((o) => o.id === +rainySecondChoice)?.name || '',
    },
    {
      label: t(stageLabels[5]),
      content: prepTime
        ? t('applications.stage.minutes', { value: prepTime })
        : '',
    },
    {
      label: t(stageLabels[6]),
      content: performTime
        ? t('applications.stage.minutes', { value: performTime })
        : '',
    },
    {
      label: t(stageLabels[7]),
      content: cleanupTime
        ? t('applications.stage.minutes', { value: cleanupTime })
        : '',
    },
  ];

  return (
    <>
      {isFormMode ? (
        <FormContainer>
          {hasError && (
            <div className="relative w-[400px] rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">
                {t('applications.stage.errors.fetchTitle')}
              </strong>
              <span className="block sm:inline">
                {t('applications.stage.errors.fetchDescription')}
              </span>
            </div>
          )}

          {submitError && (
            <div className="relative w-[400px] rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">
                {t('applications.stage.errors.submitTitle')}
              </strong>
              <span className="block sm:inline">{submitError}</span>
            </div>
          )}

          {isLoadingAll ? (
            <div className="w-[400px] py-4 text-center">
              <p>{t('applications.stage.loading')}</p>
            </div>
          ) : (
            <form
              className="flex w-[400px] flex-col gap-10 text-[#484848]"
              onSubmit={onSubmit}
            >
              <div>
                <Radio
                  label={t(stageLabels[0])}
                  value={date}
                  onChange={(value: string) => updateField('date', value)}
                  required
                  options={dateOptions}
                  error={getErrorMessage('date')}
                />
                {!errors.date && (
                  <p className="text-xs text-[#484848]">
                    {t('applications.stage.notes.select')}
                  </p>
                )}
              </div>

              <div>
                <Selector
                  label={t(stageLabels[1])}
                  value={sunnyFirstChoice}
                  onChange={(value) => updateField('sunnyFirstChoice', value)}
                  required
                  options={filteredSunny1}
                  error={getErrorMessage('sunnyFirstChoice')}
                />
              </div>

              <div>
                <Selector
                  label={t(stageLabels[2])}
                  value={sunnySecondChoice}
                  onChange={(value) => updateField('sunnySecondChoice', value)}
                  required
                  options={filteredSunny2}
                  error={getErrorMessage('sunnySecondChoice')}
                />
              </div>

              <div>
                <Selector
                  label={t(stageLabels[3])}
                  value={rainyFirstChoice}
                  onChange={(value) => updateField('rainyFirstChoice', value)}
                  required
                  options={filteredRainy1}
                  error={getErrorMessage('rainyFirstChoice')}
                />
              </div>

              <div>
                <Selector
                  label={t(stageLabels[4])}
                  value={rainySecondChoice}
                  onChange={(value) => updateField('rainySecondChoice', value)}
                  required
                  options={filteredRainy2}
                  error={getErrorMessage('rainySecondChoice')}
                />
              </div>

              <div>
                <TextBox
                  label={`${t(stageLabels[5])}${t('applications.stage.notes.unit')}`}
                  value={prepTime}
                  onChange={(value) => updateField('prepTime', value)}
                  required
                  note={t('applications.stage.notes.prepTime')}
                  error={getErrorMessage('prepTime')}
                />
              </div>

              <div>
                <TextBox
                  label={`${t(stageLabels[6])}${t('applications.stage.notes.unit')}`}
                  value={performTime}
                  onChange={(value) => updateField('performTime', value)}
                  required
                  note={t('applications.stage.notes.performTime')}
                  error={getErrorMessage('performTime')}
                />
              </div>

              <div>
                <TextBox
                  label={`${t(stageLabels[7])}${t('applications.stage.notes.unit')}`}
                  value={cleanupTime}
                  onChange={(value) => updateField('cleanupTime', value)}
                  required
                  note={t('applications.stage.notes.cleanupTime')}
                  error={getErrorMessage('cleanupTime')}
                />
                {getErrorMessage('totalTime') && (
                  <p className="text-xs text-[#FF0000]">
                    {t(getErrorMessage('totalTime') ?? '', {
                      defaultValue: getErrorMessage('totalTime') ?? '',
                    })}
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-center gap-4">
                {hasExisting && (
                  <Button
                    type="button"
                    size="pc"
                    color="main"
                    variant
                    onClick={() => toCancel(resetForm)}
                  >
                    {t('form.actions.cancel')}
                  </Button>
                )}
                <Button
                  type="submit"
                  size="pc"
                  color="main"
                  isDisable={!isValid}
                >
                  {hasExisting
                    ? t('form.actions.edit')
                    : t('form.actions.register')}
                </Button>
              </div>
            </form>
          )}
        </FormContainer>
      ) : (
        <FormList items={items} onEdit={toEdit} isEdit={!isDeadline} />
      )}
    </>
  );
};

export default StageForm;
