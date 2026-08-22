import { FC } from 'react';
import { Controller } from 'react-hook-form';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';
import { useStageFormHooks } from '../hooks';
import { useStageFormViewHooks } from '../hooks/useStageFormViewHooks';

type Props = { isDeadline?: boolean; groupId: number };
const StageForm: FC<Props> = ({ isDeadline, groupId }) => {
  const stageFormHooks = useStageFormHooks(groupId);
  const {
    formState,
    control,
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
    stageFormTexts,
  } = stageFormHooks;

  const stageFormViewHooks = useStageFormViewHooks({
    hasExisting,
    isDeadline,
    isLoadingAll,
    isSubmitted,
  });
  const { isFormMode, toEdit, toCancel } = stageFormViewHooks;

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
      label: stageFormTexts.labels[0],
      content: dateOptions.find((o) => o.id === +date)?.name || '',
    },
    {
      label: stageFormTexts.labels[1],
      content:
        sunnyStageOptions.find((o) => o.id === +sunnyFirstChoice)?.name || '',
    },
    {
      label: stageFormTexts.labels[2],
      content:
        sunnyStageOptions.find((o) => o.id === +sunnySecondChoice)?.name || '',
    },
    {
      label: stageFormTexts.labels[3],
      content:
        rainyStageOptions.find((o) => o.id === +rainyFirstChoice)?.name || '',
    },
    {
      label: stageFormTexts.labels[4],
      content:
        rainyStageOptions.find((o) => o.id === +rainySecondChoice)?.name || '',
    },
    {
      label: stageFormTexts.labels[5],
      content: prepTime ? stageFormTexts.minutes(prepTime) : '',
    },
    {
      label: stageFormTexts.labels[6],
      content: performTime ? stageFormTexts.minutes(performTime) : '',
    },
    {
      label: stageFormTexts.labels[7],
      content: cleanupTime ? stageFormTexts.minutes(cleanupTime) : '',
    },
  ];

  return (
    <>
      {isFormMode === null ? (
        <div className="w-[400px] py-4 text-center">
          <p>{stageFormTexts.loading}</p>
        </div>
      ) : isFormMode ? (
        <FormContainer>
          {hasError && (
            <div className="relative w-[400px] rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">
                {stageFormTexts.errors.fetchTitle}
              </strong>
              <span className="block sm:inline">
                {stageFormTexts.errors.fetchDescription}
              </span>
            </div>
          )}

          {submitError && (
            <div className="relative w-[400px] rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">
                {stageFormTexts.errors.submitTitle}
              </strong>
              <span className="block sm:inline">{submitError}</span>
            </div>
          )}

          {isLoadingAll ? (
            <div className="w-[400px] py-4 text-center">
              <p>{stageFormTexts.loading}</p>
            </div>
          ) : (
            <form
              className="flex w-[400px] flex-col gap-10 text-[#484848]"
              onSubmit={onSubmit}
            >
              <div>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Radio
                      label={stageFormTexts.labels[0]}
                      value={field.value}
                      onChange={(value: string) => updateField('date', value)}
                      required
                      options={dateOptions}
                      error={getErrorMessage('date')}
                    />
                  )}
                />
                {!errors.date && (
                  <p className="text-xs text-[#484848]">
                    {stageFormTexts.notes.select}
                  </p>
                )}
              </div>

              <div>
                <Controller
                  control={control}
                  name="sunnyFirstChoice"
                  render={({ field }) => (
                    <Selector
                      label={stageFormTexts.labels[1]}
                      value={field.value}
                      onChange={(value) =>
                        updateField('sunnyFirstChoice', value)
                      }
                      required
                      options={filteredSunny1}
                      error={getErrorMessage('sunnyFirstChoice')}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="sunnySecondChoice"
                  render={({ field }) => (
                    <Selector
                      label={stageFormTexts.labels[2]}
                      value={field.value}
                      onChange={(value) =>
                        updateField('sunnySecondChoice', value)
                      }
                      required
                      options={filteredSunny2}
                      error={getErrorMessage('sunnySecondChoice')}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="rainyFirstChoice"
                  render={({ field }) => (
                    <Selector
                      label={stageFormTexts.labels[3]}
                      value={field.value}
                      onChange={(value) =>
                        updateField('rainyFirstChoice', value)
                      }
                      required
                      options={filteredRainy1}
                      error={getErrorMessage('rainyFirstChoice')}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="rainySecondChoice"
                  render={({ field }) => (
                    <Selector
                      label={stageFormTexts.labels[4]}
                      value={field.value}
                      onChange={(value) =>
                        updateField('rainySecondChoice', value)
                      }
                      required
                      options={filteredRainy2}
                      error={getErrorMessage('rainySecondChoice')}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="prepTime"
                  render={({ field }) => (
                    <TextBox
                      label={`${stageFormTexts.labels[5]}${stageFormTexts.notes.unit}`}
                      value={field.value}
                      onChange={(value) => updateField('prepTime', value)}
                      required
                      note={stageFormTexts.notes.prepTime}
                      error={getErrorMessage('prepTime')}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="performTime"
                  render={({ field }) => (
                    <TextBox
                      label={`${stageFormTexts.labels[6]}${stageFormTexts.notes.unit}`}
                      value={field.value}
                      onChange={(value) => updateField('performTime', value)}
                      required
                      note={stageFormTexts.notes.performTime}
                      error={getErrorMessage('performTime')}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="cleanupTime"
                  render={({ field }) => (
                    <TextBox
                      label={`${stageFormTexts.labels[7]}${stageFormTexts.notes.unit}`}
                      value={field.value}
                      onChange={(value) => updateField('cleanupTime', value)}
                      required
                      note={stageFormTexts.notes.cleanupTime}
                      error={getErrorMessage('cleanupTime')}
                    />
                  )}
                />
                {getErrorMessage('totalTime') && (
                  <p className="text-xs text-[#FF0000]">
                    {stageFormTexts.formatError(
                      getErrorMessage('totalTime') ?? ''
                    )}
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
                    {stageFormTexts.buttons.cancel}
                  </Button>
                )}
                <Button
                  type="submit"
                  size="pc"
                  color="main"
                  isDisable={!isValid}
                >
                  {hasExisting
                    ? stageFormTexts.buttons.save
                    : stageFormTexts.buttons.register}
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
