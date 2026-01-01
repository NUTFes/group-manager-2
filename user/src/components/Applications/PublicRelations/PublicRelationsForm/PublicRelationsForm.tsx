import { FC } from 'react';
import { PublicRelationResponse } from '@/api/publicRelationsApi';
import { useTranslation } from 'next-i18next';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import TextArea from '@/components/Form/TextArea/TextArea';
import FormContainer from '@/components/FormContainer/FormContainer';
import Upload from '@/components/Upload/Upload';
import { usePublicRelationsFormHooks } from './hooks';

type PublicRelationsFormProps = {
  groupId: number;
  publicRelation?: PublicRelationResponse | null;
  toEdit: () => void; // Make toEdit required
};

const PublicRelationsForm: FC<PublicRelationsFormProps> = ({
  groupId,
  publicRelation,
  toEdit,
}) => {
  const { t } = useTranslation('common');
  // PublicRelationsForm receives toEdit as a required prop
  const {
    handleSubmit,
    errors,
    values,
    setValue,
    fileName,
    isFetching,
    isMutating,
    handleImageUpload,
    handleAnnounceChange,
    announceOptions,
    onSubmit,
    validateEdit,
  } = usePublicRelationsFormHooks(groupId, publicRelation);
  const uploadNote = t('applications.publicRelations.notes.upload', {
    returnObjects: true,
  }) as string[];

  return (
    <FormContainer>
      {isFetching || isMutating ? (
        <div>{t('general.loading')}</div>
      ) : (
        <form
          className="w-full"
          onSubmit={handleSubmit(async (data) => {
            const success = await onSubmit(data);
            if (success) {
              // 成功したら toEdit を呼び出す
              toEdit();
            }
          })}
        >
          <div className="flex w-full flex-col items-start justify-center gap-10">
            {/* PR文入力 */}
            <div className="relative h-44 w-96">
              <TextArea
                label={t('applications.publicRelations.fields.text')}
                value={values.prText || ''}
                onChange={(value) => setValue('prText', value)}
                required
                note={t('applications.publicRelations.notes.text')}
                error={errors.prText?.message}
              />
            </div>

            {/* アナウンス選択 */}
            <div className="flex flex-col items-start justify-start gap-6">
              <Radio
                label={t('applications.publicRelations.fields.announce')}
                value={
                  values.announce === 'yes'
                    ? '1'
                    : values.announce === 'no'
                      ? '0'
                      : ''
                }
                onChange={handleAnnounceChange}
                required
                options={announceOptions}
                error={errors.announce?.message}
              />
            </div>

            {/* PR画像アップロード */}
            <div className="flex w-96 flex-col items-start justify-start gap-1">
              <Upload
                title={t('applications.publicRelations.fields.image')}
                note={uploadNote}
                onClick={handleImageUpload}
                idDisable={false}
                error={errors.image?.message}
              />
              {fileName && (
                <div className="mt-2 text-sm text-font">
                  <p>
                    {t('applications.publicRelations.uploadStatus', {
                      fileName,
                    })}
                  </p>
                  {publicRelation && (
                    <p className="mt-1 text-gray-500">
                      {t('applications.publicRelations.notes.existingImage')}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ボタン */}
            <div className="mt-10 flex w-full items-center justify-center">
              {publicRelation && (
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
                isDisable={isMutating || validateEdit()}
              >
                {publicRelation
                  ? t('form.actions.edit')
                  : t('form.actions.register')}
              </Button>
            </div>
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default PublicRelationsForm;
