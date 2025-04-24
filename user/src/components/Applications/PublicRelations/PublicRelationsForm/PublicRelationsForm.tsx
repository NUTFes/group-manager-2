import { FC } from 'react';
import { PublicRelationResponse } from '@/api/publicRelationsApi';
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

  return (
    <FormContainer>
      {isFetching || isMutating ? (
        <div>loading...</div>
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
                label="PR文(HP,パンフレット,アナウンスに使用)"
                value={values.prText || ''}
                onChange={(value) => setValue('prText', value)}
                required
                note="日本語の場合：0~50文字、英語の場合：0~25words"
                error={errors.prText?.message}
              />
            </div>

            {/* アナウンス選択 */}
            <div className="flex flex-col items-start justify-start gap-6">
              <Radio
                label="アナウンスを行いますか？"
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
                title="PR画像"
                note={[
                  'ファイル形式：png、jpeg',
                  'ファイルサイズ：10MB未満',
                  '画像、イラストの形：正方形（できれば料理の写真）',
                ]}
                onClick={handleImageUpload}
                idDisable={false}
                error={errors.image?.message}
              />
              {fileName && (
                <div className="mt-2 text-sm text-font">
                  <p>アップロード済み: {fileName}</p>
                  {publicRelation && (
                    <p className="mt-1 text-gray-500">
                      ※新しい画像をアップロードしない場合、既存の画像がそのまま使用されます
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
                    キャンセル
                  </Button>
                </div>
              )}
              <Button
                size="pc"
                color="main"
                type="submit"
                isDisable={isMutating || validateEdit()}
              >
                {publicRelation ? '修正' : '登録'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default PublicRelationsForm;
