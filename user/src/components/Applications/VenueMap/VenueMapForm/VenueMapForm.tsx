import { FC, useMemo } from 'react';
import { VenueMapResponse } from '@/api/venueMapApi';
import { useTranslation } from 'next-i18next';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Form/CheckBox';
import FormContainer from '@/components/FormContainer/FormContainer';
import Upload from '@/components/Upload/Upload';
import { useVenueMapFormHooks } from './hooks';

type VenueMapFormProps = {
  groupId: number;
  venueMap?: VenueMapResponse | null;
  toEdit?: () => void;
  onSubmitted?: () => void;
};

const VenueMapForm: FC<VenueMapFormProps> = ({
  groupId,
  venueMap,
  toEdit,
  onSubmitted,
}) => {
  const { t } = useTranslation('common');
  const {
    handleSubmit,
    errors,
    values,
    setValue,
    fileName,
    isFetching,
    isMutating,
    handleImageUpload,
    onSubmit,
    isDirty,
  } = useVenueMapFormHooks(groupId, venueMap, onSubmitted);

  const checklistOptions = useMemo(
    () => [
      {
        id: 'trashPosition',
        name: t('applications.venueMap.checklist.options.trashPosition'),
      },
      {
        id: 'foodStorage',
        name: t('applications.venueMap.checklist.options.foodStorage'),
      },
      {
        id: 'allItemsListed',
        name: t('applications.venueMap.checklist.options.allItemsListed'),
      },
      {
        id: 'fireHazardousMaterials',
        name: t(
          'applications.venueMap.checklist.options.fireHazardousMaterials'
        ),
      },
      {
        id: 'partitionPlacement',
        name: t('applications.venueMap.checklist.options.partitionPlacement'),
      },
    ],
    [t]
  );

  const uploadNotes = useMemo(
    () =>
      t('applications.venueMap.upload.note', {
        returnObjects: true,
      }) as string[],
    [t]
  );

  return (
    <FormContainer>
      {isFetching ? (
        <div>{t('general.loading')}</div>
      ) : (
        <form
          className="flex w-full flex-col gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* 模擬店平面図画像 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-4">
              <div className="text-base font-medium text-font">
                {t('applications.venueMap.fields.picture')}
              </div>
              <div className="text-xs font-light text-alert">
                ※{t('form.required')}
              </div>
            </div>
            <Upload
              title=""
              note={uploadNotes}
              onClick={handleImageUpload}
              idDisable={isMutating}
              error={errors.image?.message as string | undefined}
            />
            {fileName && (
              <div className="mt-2 text-sm text-font">
                {t('applications.venueMap.upload.uploaded', {
                  fileName,
                })}
              </div>
            )}
            {venueMap?.picturePath && !values.image && (
              <div className="mt-1 text-xs text-gray-500">
                {t('applications.venueMap.notes.existing')}
                <br />
                {t('applications.venueMap.notes.currentImage', {
                  name:
                    venueMap.pictureName ||
                    t('applications.venueMap.notes.unknownFile'),
                })}
              </div>
            )}
          </div>

          {/* 平面図確認事項 */}
          <Checkbox
            label={t('applications.venueMap.fields.checklist')}
            options={checklistOptions}
            value={values.checklist || []}
            onChange={(newValues) =>
              setValue('checklist', newValues, { shouldDirty: true })
            }
            error={errors.checklist?.message as string | undefined}
            note={t('applications.venueMap.checklist.note')}
            required
          />

          {/* ボタン */}
          <div className="mt-6 flex w-full items-center justify-center gap-4">
            {venueMap && (
              <Button
                size="pc"
                color="main"
                onClick={toEdit}
                type="button"
                variant
              >
                {t('form.actions.cancel')}
              </Button>
            )}
            <Button
              size="pc"
              type="submit"
              color="main"
              isDisable={isMutating || (venueMap ? !isDirty : false)}
            >
              {isMutating
                ? t('applications.venueMap.buttons.submitting')
                : venueMap
                  ? t('form.actions.edit')
                  : t('form.actions.register')}
            </Button>
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default VenueMapForm;
