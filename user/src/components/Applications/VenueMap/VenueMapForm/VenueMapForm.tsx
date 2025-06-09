import { FC } from 'react';
import { VenueMapResponse } from '@/api/venueMapApi';
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

  const checklistOptions = [
    {
      id: 'trashPosition',
      name: 'ゴミ箱の設置位置を記載しました。',
    },
    {
      id: 'foodStorage',
      name: '食材の保存場所を記載しました。',
    },
    {
      id: 'allItemsListed',
      name: '申請した物品をすべて平面図に記載しました。',
    },
    {
      id: 'fireHazardousMaterials',
      name: '火気・電化製品の使用場所を明記しました。',
    },
    {
      id: 'partitionPlacement',
      name: 'パーテーション/掲示板が調理場内に入っておらず、テントの側面に設置してあることを確認しました。',
    },
  ];

  return (
    <FormContainer>
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        <form
          className="flex w-full flex-col gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* 模擬店平面図画像 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-4">
              <div className="text-base font-medium text-font">
                模擬店平面図画像
              </div>
              <div className="text-xs font-light text-alert">※必須</div>
            </div>
            <Upload
              title=""
              note={[
                '机、椅子、使用機器などの配置が分かるように',
                'ファイル形式：png、jpeg',
                'ファイルサイズ：20MB',
              ]}
              onClick={handleImageUpload}
              idDisable={isMutating}
              error={errors.image?.message as string | undefined}
            />
            {fileName && (
              <div className="mt-2 text-sm text-font">
                アップロード済み: {fileName}
              </div>
            )}
            {venueMap?.picturePath && !values.image && (
              <div className="mt-1 text-xs text-gray-500">
                ※新しい画像をアップロードしない場合、既存の画像がそのまま使用されます。
                <br />
                現在の画像: {venueMap.pictureName || 'ファイル名不明'}
              </div>
            )}
          </div>

          {/* 平面図確認事項 */}
          <Checkbox
            label="平面図確認事項"
            options={checklistOptions}
            value={values.checklist || []}
            onChange={(newValues) =>
              setValue('checklist', newValues, { shouldDirty: true })
            }
            error={errors.checklist?.message as string | undefined}
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
                キャンセル
              </Button>
            )}
            <Button
              size="pc"
              type="submit"
              color="main"
              isDisable={isMutating || (venueMap ? !isDirty : false)}
            >
              {isMutating ? '送信中...' : venueMap ? '修正' : '登録する'}
            </Button>
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default VenueMapForm;
