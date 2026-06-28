// src/components/Applications/MultiItemForms/RentItems/RentItemsForm/RentItemsForm.tsx
import { FC } from 'react';
import { HealthCenterSubmissionStatus } from '@/api/healthCenterSubmissionStatusApi';
import { Controller } from 'react-hook-form';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useRentItemsFormHooks } from '@/components/Applications/MultiItemForms/RentItems/hooks';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import FormContainer from '@/components/FormContainer';
import MultiItemFormButton from '../../MultiItemFormButton';
import { LOCATION_TYPES } from '../RentItemsForm/schema';

type RentItemsFormProps = {
  groupId: number;
  groupCategoryId?: number; // 団体カテゴリID
  isDeadline: boolean;
  status?: HealthCenterSubmissionStatus;
};

const RentItemsForm: FC<RentItemsFormProps> = ({
  groupId,
  groupCategoryId,
  isDeadline,
  status,
}) => {
  const {
    form,
    fields,
    control,
    hasItems,
    updateLocationType,
    itemOptions,
    addItem,
    remove,
    registerNoItems,
    isLoading,
    hasError,
    errors,
    submitError,
    isValid,
    hasExisting,
    openEditMode,
    isEditMode,
    hasExplicitlyDeclinedItems,
    isDeclinedStateLoading,
    handleFormSubmit,
    hideLocationTypeSelect, // 会場タイプ選択を非表示にするフラグ
    isFoodSellingGroup, // 食品販売団体かどうかのフラグ
    getMaxCountByItemId, // 物品ID別の最大個数を取得する関数
    rentItemsFormTexts,
  } = useRentItemsFormHooks(groupId, status, groupCategoryId);

  if (isLoading) {
    return (
      <div className="w-full py-4 text-center">
        <p>{rentItemsFormTexts.general.loading}</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="relative w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
        <strong className="font-bold">
          {rentItemsFormTexts.errors.fetch.title}
        </strong>
        <span className="block sm:inline">
          {rentItemsFormTexts.errors.fetch.description}
        </span>
      </div>
    );
  }

  // 締め切り後で、データがない（未登録）かつ再提出でない場合
  // isDeclinedStateLoadingがtrueの間は非同期チェック完了前なので、この分岐を保留する
  if (
    !isDeclinedStateLoading &&
    !isDeadline &&
    !hasExisting &&
    hasExplicitlyDeclinedItems === false &&
    status !== 'waiting_resubmission'
  ) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
          <div className="mb-4">
            <svg
              className="mx-auto size-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            {rentItemsFormTexts.deadline.title}
          </h3>
          <p className="text-sm text-gray-600">
            {rentItemsFormTexts.deadline.description}
          </p>
        </div>
      </div>
    );
  }

  // 「物品申請を行わない」場合の表示（UnRegisteredGroupが登録されている場合）
  if (!isEditMode && hasExplicitlyDeclinedItems && !hasExisting) {
    return (
      <div className="w-full text-font">
        <div className="flex w-full flex-col gap-10 rounded-[20px] border border-[#b2b2b2] bg-baseColor p-6 shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] md:p-20">
          <div className="mb-4">
            <p className="text-xs">
              {rentItemsFormTexts.summary.noApplication.label}
            </p>
            <p>{rentItemsFormTexts.summary.noApplication.description}</p>
          </div>
          {(isDeadline || status === 'waiting_resubmission') && (
            <div className="mt-4 flex w-full items-center justify-center gap-4">
              <Button
                size="pc"
                color="main"
                type="button"
                icon="pencil"
                onClick={openEditMode}
              >
                {rentItemsFormTexts.buttons.edit}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 既存の申請データがあり、編集モードでない場合は申請内容を表示
  if (hasExisting && !isEditMode) {
    return (
      <div className="w-full text-font">
        {!hideLocationTypeSelect && ( // 特殊団体でない場合のみ表示
          <div className="mb-4">
            <p className="font-bold">
              {rentItemsFormTexts.location.displayLabel}
              {form.getValues('locationType') === LOCATION_TYPES.INDOOR
                ? rentItemsFormTexts.location.options.indoor
                : rentItemsFormTexts.location.options.outdoor}
            </p>
          </div>
        )}
        {isFoodSellingGroup && (
          <div className="mb-4">
            <p className="font-bold text-alert">
              {rentItemsFormTexts.location.notes.foodOnlyOutdoor}
            </p>
          </div>
        )}

        <div className="flex w-full max-w-full flex-col items-start justify-start gap-10 overflow-hidden rounded-[20px] border border-[#b2b2b2] bg-baseColor p-6 shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] md:p-20">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="mb-4 w-full border-b border-gray-200 pb-4 last:mb-0 last:border-b-0 last:pb-0"
            >
              <div className="flex w-full items-center justify-between">
                <div className="w-full">
                  <p className="font-medium text-font">
                    {itemOptions.find(
                      (option) =>
                        option.id.toString() ===
                        form.getValues(`items.${index}.itemId`)
                    )?.name || ''}
                  </p>
                  <p className="text-sm text-font">
                    {rentItemsFormTexts.summary.count(
                      form.getValues(`items.${index}.count`)
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(isDeadline || status === 'waiting_resubmission') && (
          <div className="mt-4 flex w-full items-center justify-center gap-4">
            <Button
              size="pc"
              color="main"
              type="button"
              icon="pencil"
              onClick={openEditMode}
            >
              {rentItemsFormTexts.buttons.edit}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // 編集モード、または新規申請の場合はフォームを表示
  return (
    <form
      className="flex w-full max-w-full flex-col gap-8 text-font"
      onSubmit={handleFormSubmit}
    >
      <div>
        <div className="mb-[4px] text-sm text-alert">
          {!hideLocationTypeSelect && (
            <p>{rentItemsFormTexts.location.notes.preApplication}</p>
          )}
          {isFoodSellingGroup && (
            <p>{rentItemsFormTexts.location.notes.foodOnlyOutdoor}</p>
          )}
        </div>
        <br />
        <Controller
          name="hasItems"
          control={control}
          render={({ field }) => (
            <Radio
              label={rentItemsFormTexts.radio.question}
              value={field.value ? '1' : '0'}
              onChange={(value: string) => {
                field.onChange(value === '1');
                form.trigger();
              }}
              required
              options={[
                {
                  id: 1,
                  name: rentItemsFormTexts.radio.options.yes,
                },
                {
                  id: 0,
                  name: rentItemsFormTexts.radio.options.no,
                },
              ]}
              error={errors.hasItems?.message?.toString()}
            />
          )}
        />
      </div>

      {!hasItems && (
        <>
          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              size="pc"
              color="main"
              onClick={async () => {
                // registerNoItems関数を直接呼び出し
                const succeeded = await registerNoItems();
                if (!succeeded) {
                  // エラー処理
                }
              }}
            >
              {rentItemsFormTexts.buttons.register}
            </Button>
          </div>
        </>
      )}

      {hasItems && (
        <>
          {/* 特殊団体でない場合のみ、会場タイプ選択を表示 */}
          {!hideLocationTypeSelect && (
            <div>
              <Controller
                name="locationType"
                control={control}
                render={({ field }) => (
                  <Radio
                    label={rentItemsFormTexts.location.radioQuestion}
                    value={field.value}
                    onChange={(value: string) => {
                      // 新しい値でupdateLocationTypeを呼び出す
                      updateLocationType(value);
                    }}
                    required
                    options={[
                      {
                        id: 1,
                        name: rentItemsFormTexts.location.options.indoor,
                      },
                      {
                        id: 2,
                        name: rentItemsFormTexts.location.options.outdoor,
                      },
                    ]}
                    error={errors.locationType?.message}
                  />
                )}
              />
            </div>
          )}
          {fields.map((field, index) => (
            <div key={field.id} className="mx-auto flex w-full justify-center">
              <FormContainer>
                <div className="mb-4">
                  <h3 className="mb-4 font-bold text-font">
                    {rentItemsFormTexts.fields.sectionTitle(index + 1)}
                  </h3>
                  <Controller
                    name={`items.${index}.itemId`}
                    control={control}
                    render={({ field }) => {
                      // 現在選択されている全アイテムを取得
                      const currentItems = form.getValues('items');

                      // 既に選択されているアイテムを除外したオプションリストを作成
                      // 自身の選択は除外しない
                      const filteredOptions = itemOptions.filter((option) => {
                        const optionId = option.id.toString();
                        return !currentItems.some(
                          (item, idx) =>
                            idx !== index && item.itemId === optionId
                        );
                      });

                      return (
                        <Selector
                          label={rentItemsFormTexts.fields.item}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            // 物品変更時に個数が上限を超えていたら1にリセットする
                            const maxCount = getMaxCountByItemId(value);
                            const currentCount = form.getValues(
                              `items.${index}.count`
                            );
                            if (currentCount > maxCount) {
                              form.setValue(`items.${index}.count`, 1, {
                                shouldValidate: true,
                              });
                            }
                            // 物品変更時にバリデーションを実行
                            form.trigger('items');
                          }}
                          required
                          options={filteredOptions}
                          error={errors.items?.[
                            index
                          ]?.itemId?.message?.toString()}
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <Controller
                    name={`items.${index}.count`}
                    control={control}
                    render={({ field }) => {
                      // 現在選択されている物品に基づいて最大個数を取得
                      const currentItemId = form.getValues(
                        `items.${index}.itemId`
                      );
                      const maxCount = getMaxCountByItemId(currentItemId);

                      return (
                        <Selector
                          label={rentItemsFormTexts.fields.count}
                          value={field.value.toString()}
                          onChange={(value) => {
                            const numValue = parseInt(value, 10);

                            // setValueを使用してフォーム状態を正しく更新
                            form.setValue(`items.${index}.count`, numValue, {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            });

                            // React Hook Form用にfieldのonChangeも呼び出す
                            field.onChange(numValue);

                            // 再検証を強制実行
                            form.trigger('items');
                          }}
                          required
                          options={Array.from({ length: maxCount }, (_, i) => ({
                            id: i + 1,
                            name: `${i + 1}`,
                          }))}
                          error={errors.items?.[
                            index
                          ]?.count?.message?.toString()}
                        />
                      );
                    }}
                  />
                  <p className="text-xs text-sub">
                    {rentItemsFormTexts.notes.minRequest}
                  </p>
                </div>
                <div className="w-full">
                  <p className="text-xs text-font">
                    {rentItemsFormTexts.notes.contactLimit}
                    <br />
                    {rentItemsFormTexts.notes.contactEmail}
                  </p>
                </div>
                {fields.length > 1 && (
                  <div className="mx-auto mt-4 flex w-full justify-center text-right">
                    <MultiItemFormButton
                      type="button"
                      size="mobile"
                      color="delete"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <div className="flex items-center">
                        <RiDeleteBinLine size={18} className="mr-1" />
                        {rentItemsFormTexts.buttons.delete}
                      </div>
                    </MultiItemFormButton>
                  </div>
                )}
              </FormContainer>
            </div>
          ))}

          {/* エラーメッセージを追加・登録ボタンの上に移動 */}
          {submitError && (
            <div className="relative mt-4 w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              {submitError}
            </div>
          )}

          {errors.root?.message && (
            <div className="relative mt-4 w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              {rentItemsFormTexts.errors.translate(
                errors.root.message.toString()
              )}
            </div>
          )}

          {/* フォームバリデーションエラーがあれば表示（アイテム制限関連のエラーも含む） */}
          {errors.items?.message && (
            <div className="relative mt-4 w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              {rentItemsFormTexts.errors.translate(
                errors.items.message.toString()
              )}
            </div>
          )}

          <div className="mb-2 mt-4 flex justify-center gap-4">
            <MultiItemFormButton
              type="button"
              size="pc"
              color="add"
              onClick={() => {
                addItem();
              }}
            >
              <div className="flex items-center">
                <span className="mr-1 text-lg">+</span>{' '}
                {rentItemsFormTexts.buttons.addItem}
              </div>
            </MultiItemFormButton>
            <Button type="submit" size="pc" color="main" isDisable={!isValid}>
              {hasExisting
                ? rentItemsFormTexts.buttons.edit
                : rentItemsFormTexts.buttons.register}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default RentItemsForm;
