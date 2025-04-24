// src/components/RentItems/RentItemsForm/RentItemsForm.tsx
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useRentItemsFormLogic } from '@/components/Applications/MultiItemForms/RentItems/hooks/useRentItemsFormLogic';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import FormContainer from '@/components/FormContainer';
import MultiItemFormButton from '../../MultiItemFormButton';

const RentItemsForm: FC = () => {
  const {
    form,
    fields,
    control,
    hasItems,
    updateLocationType,
    itemOptions,
    addItem,
    remove,
    handleSubmit,
    isLoading,
    hasError,
    errors,
    submitError,
    isValid,
    hasExisting,
  } = useRentItemsFormLogic();

  if (isLoading) {
    return (
      <div className="w-full py-4 text-center">
        <p>データを読み込み中です...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="relative w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
        <strong className="font-bold">エラー：</strong>
        <span className="block sm:inline">
          データの取得に失敗しました。ページを再読込してください。
        </span>
      </div>
    );
  }

  return (
    <form
      className="flex w-full flex-col gap-8 text-font"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="mb-[4px] text-sm text-alert">
          会場申請を先に申請してください。
        </p>
        <br />
        <Controller
          name="hasItems"
          control={control}
          render={({ field }) => (
            <Radio
              label="物品申請を行いますか？"
              value={field.value ? '1' : '0'}
              onChange={(value: string) => {
                field.onChange(value === '1');
                // 値が変更されたらバリデーションを実行
                form.trigger();
              }}
              required
              options={[
                { id: 1, name: 'はい' },
                { id: 0, name: 'いいえ' },
              ]}
              error={errors.hasItems?.message?.toString()}
            />
          )}
        />
      </div>

      {hasItems && (
        <>
          {/* 屋内/屋外を選択するラジオボタン */}
          <div>
            <Controller
              name="locationType"
              control={control}
              render={({ field }) => (
                <Radio
                  label="会場申請の第一希望はどちらですか？"
                  value={field.value}
                  onChange={(value: string) => {
                    field.onChange(value);
                    updateLocationType(value);
                  }}
                  required
                  options={[
                    { id: 1, name: '屋内' },
                    { id: 2, name: '屋外' },
                  ]}
                  error={errors.locationType?.message}
                />
              )}
            />
          </div>

          {fields.map((field, index) => (
            <FormContainer key={field.id}>
              <div className="mb-4">
                <h3 className="mb-4 font-bold text-font">物品 {index + 1}</h3>
                <Controller
                  name={`items.${index}.itemId`}
                  control={control}
                  render={({ field }) => (
                    <Selector
                      label="物品名"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        // 値が変更されたらバリデーションを実行
                        form.trigger(`items.${index}.itemId`);
                      }}
                      required
                      options={itemOptions}
                      error={errors.items?.[index]?.itemId?.message?.toString()}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name={`items.${index}.count`}
                  control={control}
                  render={({ field }) => (
                    <Selector
                      label="個数"
                      value={field.value.toString()}
                      onChange={(value) => {
                        field.onChange(parseInt(value, 10));
                        // 値が変更されたらバリデーションを実行
                        form.trigger(`items.${index}.count`);
                      }}
                      required
                      options={Array.from({ length: 20 }, (_, i) => ({
                        id: i + 1,
                        name: `${i + 1}`,
                      }))}
                      error={errors.items?.[index]?.count?.message?.toString()}
                    />
                  )}
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
              <div className="mx-auto mb-4">
                {fields.length > 1 ? (
                  <MultiItemFormButton
                    type="button"
                    size="pc"
                    color="delete"
                    onClick={() => remove(index)}
                  >
                    <div className="flex items-center">
                      <RiDeleteBinLine size={18} className="mr-1" />
                      <span>削除</span>
                    </div>
                  </MultiItemFormButton>
                ) : null}
              </div>
            </FormContainer>
          ))}

          <div className="mb-2 mt-4 flex justify-center gap-4">
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

      {submitError && (
        <div className="relative mt-4 w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {submitError}
        </div>
      )}

      {/* フォーム全体のバリデーションエラーを表示 */}
      {errors.root?.message && (
        <div className="relative mt-4 w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {errors.root.message.toString()}
        </div>
      )}
    </form>
  );
};

export default RentItemsForm;
