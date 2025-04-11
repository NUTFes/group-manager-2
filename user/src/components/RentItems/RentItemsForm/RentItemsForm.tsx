// src/components/RentItems/RentItemsForm/RentItemsForm.tsx
import { FC } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import FormContainer from '@/components/FormContainer';
import MultiItemFormButton from '@/components/MultiItemFormButton';
import { useRentItemsFormLogic } from '@/components/RentItems/hooks';

const RentItemsForm: FC = () => {
  const {
    hasItems,
    setHasItems,
    itemList,
    itemOptions,
    locationType,
    updateLocationType,
    addItem,
    removeItem,
    updateItemName,
    updateItemCount,
    onSubmit,
    isLoading,
    hasError,
    errors,
    isValid,
    hasExisting,
  } = useRentItemsFormLogic();

  if (isLoading) {
    return (
      <div className="w-full text-center py-4">
        <p>データを読み込み中です...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">エラー：</strong>
        <span className="block sm:inline">
          データの取得に失敗しました。ページを再読込してください。
        </span>
      </div>
    );
  }

  return (
    <form className="w-full flex flex-col gap-8 text-font" onSubmit={onSubmit}>
      <div>
        <p className="mb-1 text-sm text-alert mb-[4px]">
          会場申請を先に申請してください。
        </p>
        <br />
        <Radio
          label="物品申請を行いますか？"
          value={hasItems ? '1' : '0'}
          onChange={(value: string) => setHasItems(value === '1')}
          required
          options={[
            { id: 1, name: 'はい' },
            { id: 0, name: 'いいえ' },
          ]}
          error={errors?.hasItems}
        />
      </div>

      {hasItems && (
        <>
          {/* 屋内/屋外を選択するラジオボタン */}
          <div>
            <Radio
              label="会場申請の第一希望はどちらですか？"
              value={locationType}
              onChange={(value: string) => updateLocationType(value)}
              required
              options={[
                { id: 1, name: '屋内' },
                { id: 2, name: '屋外' },
              ]}
              error={errors?.locationType}
            />
          </div>

          {itemList.map((item, index) => (
            <FormContainer key={index}>
              <div className="mb-4">
                <h3 className="font-bold text-font mb-4">物品 {index + 1}</h3>
                <Selector
                  label="物品名"
                  value={item.itemId}
                  onChange={(value) => updateItemName(index, value)}
                  required
                  options={itemOptions}
                  error={errors?.items?.[index]?.name}
                />
              </div>
              <div>
                <Selector
                  label="個数"
                  value={item.count.toString()}
                  onChange={(value) => updateItemCount(index, value)}
                  required
                  options={Array.from({ length: 20 }, (_, i) => ({
                    id: i + 1,
                    name: `${i + 1}`,
                  }))}
                  error={errors?.items?.[index]?.count}
                />
                <p className="text-xs text-sub">
                  ※必要最低限の数だけ申請してください
                </p>
              </div>
              <div>
                <p className="text-xs text-font">
                  使用する個数が20個以上の場合はメールをお送りください
                  <br />
                  nutfes.soumu@gmail.com
                </p>
              </div>
              <div className="mb-4 mx-auto">
                <MultiItemFormButton
                  type="button"
                  size="pc"
                  color="delete"
                  onClick={() => removeItem(index)}
                >
                  <div className="flex items-center">
                    <RiDeleteBinLine size={18} className="mr-1" />
                    <span>削除</span>
                  </div>
                </MultiItemFormButton>
              </div>
            </FormContainer>
          ))}

          <div className="flex  justify-center mt-4 mb-2 gap-4">
            <MultiItemFormButton
              type="button"
              size="pc"
              color="add"
              onClick={addItem}
            >
              <div className="flex items-center">
                <span className="mr-1 text-lg">+</span> 物品の追加
              </div>
            </MultiItemFormButton>
            <Button type="submit" size="pc" color="main" isDisable={!isValid}>
              {hasExisting ? '更新' : '登録'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default RentItemsForm;
