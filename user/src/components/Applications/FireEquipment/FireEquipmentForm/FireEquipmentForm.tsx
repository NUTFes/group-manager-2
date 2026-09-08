import { FC } from 'react';
import {
  FireEquipmentFuel,
  FireEquipmentResponse,
} from '@/api/fireEquipmentApi';
import { useTranslation } from 'next-i18next';
import { Controller } from 'react-hook-form';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import TextArea from '@/components/Form/TextArea';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';
import { useFireEquipmentFormHooks } from './hooks';

type FireEquipmentFormProps = {
  groupId: number;
  existingOrders?: FireEquipmentResponse[];
  onComplete?: () => Promise<void>;
  onDeleteOrder?: (id: number) => void;
  toEdit?: () => void;
  isViewMode?: boolean;
  canAdd?: boolean;
  canEdit?: boolean;
  // 既存申請の編集中かどうか。一覧の削除ボタンから全件をローカル除外して
  // 0件になった場合でも、新規登録用の空テンプレートに戻さないための区別。
  isEditingExisting?: boolean;
};

const FireEquipmentForm: FC<FireEquipmentFormProps> = ({
  groupId,
  existingOrders,
  onComplete,
  onDeleteOrder,
  toEdit,
  isViewMode = false,
  canAdd = true,
  canEdit = true,
  isEditingExisting = false,
}) => {
  const { t } = useTranslation('common');
  const {
    handleSubmit,
    errors,
    control,
    isSubmitting,
    items,
    fields,
    addItem,
    removeItem,
    onSubmit,
    isEditing,
    isFormValid,
    fireEquipmentFormTexts,
  } = useFireEquipmentFormHooks(
    groupId,
    existingOrders,
    onComplete,
    isEditingExisting
  );

  const getFuelLabel = (fuel: FireEquipmentFuel) => {
    switch (fuel) {
      case FireEquipmentFuel.LP_GAS:
        return t('applications.fireEquipment.fuel.lpGas');
      case FireEquipmentFuel.CHARCOAL:
        return t('applications.fireEquipment.fuel.charcoal');
      default:
        return t('applications.fireEquipment.fuel.gasBottle');
    }
  };

  // ビューモード：カード表示
  if (isViewMode) {
    if (!existingOrders || existingOrders.length === 0) return null;

    return (
      <div className="flex flex-col gap-6">
        {existingOrders.map((order) => {
          const formItems: FormItem[] = [
            {
              label: fireEquipmentFormTexts.fields.name,
              content: order.name,
            },
            {
              label: fireEquipmentFormTexts.fields.quantity,
              content: String(order.quantity),
            },
            {
              label: fireEquipmentFormTexts.fields.fuel,
              content: getFuelLabel(order.fuel),
            },
            {
              label: fireEquipmentFormTexts.fields.usage,
              content: order.usage,
            },
            {
              label: fireEquipmentFormTexts.fields.isTakeaway,
              content: order.is_takeaway
                ? fireEquipmentFormTexts.isTakeawayOptions[0].name
                : fireEquipmentFormTexts.isTakeawayOptions[1].name,
            },
            {
              label: fireEquipmentFormTexts.fields.remark,
              content: order.remark || '',
            },
          ];

          return (
            <div key={order.id} className="mb-4">
              <FormList
                items={formItems}
                isDelete={!!onDeleteOrder}
                onDelete={
                  onDeleteOrder ? () => onDeleteOrder(order.id) : undefined
                }
              />
            </div>
          );
        })}

        {toEdit && (
          <div className="mt-4 flex w-full items-center justify-center gap-4">
            <Button
              size="pc"
              color="main"
              type="button"
              icon="pencil"
              onClick={toEdit}
            >
              {fireEquipmentFormTexts.buttons.edit}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // フォームモード
  return (
    <div>
      {isSubmitting ? (
        <div className="flex items-center justify-center py-8">
          <div className="size-8 animate-spin rounded-full border-b-2 border-blue-500" />
          <span className="ml-2">{t('general.loading')}</span>
        </div>
      ) : (
        <form
          className="w-full"
          onSubmit={handleSubmit(async (data) => {
            await onSubmit(data);
          })}
        >
          <div className="flex w-full flex-col items-start justify-center gap-10">
            {fields.map((formField, index) => (
              <FormContainer key={formField.id}>
                <div className="flex w-full flex-col items-start justify-center gap-6 text-[#484848]">
                  <Controller
                    control={control}
                    name={`items.${index}.name` as const}
                    render={({ field }) => (
                      <TextBox
                        label={fireEquipmentFormTexts.fields.name}
                        required
                        value={field.value || ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.items?.[index]?.name?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`items.${index}.quantity` as const}
                    render={({ field }) => (
                      <TextBox
                        label={fireEquipmentFormTexts.fields.quantity}
                        required
                        type="number"
                        value={String(field.value || 0)}
                        note={fireEquipmentFormTexts.notes.quantity}
                        onChange={(value) => field.onChange(Number(value))}
                        onBlur={field.onBlur}
                        error={errors.items?.[index]?.quantity?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`items.${index}.fuel` as const}
                    render={({ field }) => (
                      <Selector
                        label={fireEquipmentFormTexts.fields.fuel}
                        required
                        options={fireEquipmentFormTexts.fuelOptions}
                        value={field.value}
                        onChange={(value) =>
                          field.onChange(Number(value) as FireEquipmentFuel)
                        }
                        error={errors.items?.[index]?.fuel?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`items.${index}.usage` as const}
                    render={({ field }) => (
                      <TextArea
                        label={fireEquipmentFormTexts.fields.usage}
                        required
                        value={field.value || ''}
                        onChange={field.onChange}
                        error={errors.items?.[index]?.usage?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`items.${index}.isTakeaway` as const}
                    render={({ field }) => (
                      <Radio
                        label={fireEquipmentFormTexts.fields.isTakeaway}
                        name={`items.${index}.isTakeaway`}
                        options={fireEquipmentFormTexts.isTakeawayOptions}
                        value={
                          field.value !== undefined
                            ? field.value
                              ? '1'
                              : '2'
                            : '1'
                        }
                        onChange={(value) => field.onChange(value === '1')}
                        required
                        error={errors.items?.[index]?.isTakeaway?.message}
                      />
                    )}
                  />
                  <p className="-mt-10 max-w-[400px] break-words text-xs text-[#484848]">
                    {fireEquipmentFormTexts.notes.takeaway
                      .split('\n')
                      .map((line, i) => (
                        <span key={i}>
                          {line}
                          {i === 0 && <br />}
                        </span>
                      ))}
                  </p>
                  <p className="max-w-[400px] break-words text-xs text-[#484848]">
                    {fireEquipmentFormTexts.notes.remark}
                  </p>
                  <Controller
                    control={control}
                    name={`items.${index}.remarks` as const}
                    render={({ field }) => (
                      <TextArea
                        label={fireEquipmentFormTexts.fields.remark}
                        required
                        requireMessage={
                          fireEquipmentFormTexts.notes.remarkRequired
                        }
                        value={field.value || ''}
                        onChange={field.onChange}
                        error={errors.items?.[index]?.remarks?.message}
                      />
                    )}
                  />
                  {/* フォーム内削除ボタン：canEdit で制御。最後の1件も削除可能で、
                      0件になったら保存ボタン側をdisabledにする（下記ガイダンス参照） */}
                  {canEdit && (
                    <div className="flex w-full justify-center">
                      <Button
                        size="pc"
                        color="alert"
                        variant
                        type="button"
                        onClick={() => removeItem(index)}
                        icon="delete"
                      >
                        {fireEquipmentFormTexts.buttons.delete}
                      </Button>
                    </div>
                  )}
                </div>
              </FormContainer>
            ))}

            {items.length === 0 && (
              <p className="max-w-[400px] break-words text-center text-xs text-[#484848]">
                {fireEquipmentFormTexts.notes.allDeleted}
              </p>
            )}

            <div className="mx-auto flex justify-center gap-4">
              {/* 追加ボタン：canAdd で制御 */}
              {canAdd && (
                <Button
                  size="pc"
                  color="main"
                  variant
                  type="button"
                  onClick={addItem}
                  icon="plus"
                >
                  {fireEquipmentFormTexts.buttons.add}
                </Button>
              )}
              {/* 登録・更新ボタン：新規はcanAdd、更新はcanEdit */}
              {((!isEditing && canAdd) || (isEditing && canEdit)) && (
                <Button
                  size="pc"
                  color="main"
                  type="submit"
                  isDisable={isSubmitting || !isFormValid}
                  icon={isEditing ? 'save' : 'send'}
                >
                  {isEditing
                    ? fireEquipmentFormTexts.buttons.update
                    : fireEquipmentFormTexts.buttons.register}
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default FireEquipmentForm;
