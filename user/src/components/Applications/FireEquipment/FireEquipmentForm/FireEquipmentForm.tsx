import { FC } from 'react';
import { FireEquipmentFuel, FireEquipmentResponse } from '@/api/fireEquipmentApi';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextArea from '@/components/Form/TextArea/TextArea';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer/FormContainer';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import { useTranslation } from 'next-i18next';
import { useFireEquipmentFormHooks } from './hooks';

type FireEquipmentFormProps = {
    groupId: number;
    existingOrders?: FireEquipmentResponse[];
    onComplete?: () => Promise<void>;
    onDeleteOrder?: (id: number) => Promise<void>;
    toEdit?: () => void;
    isViewMode?: boolean;
};

const FireEquipmentForm: FC<FireEquipmentFormProps> = ({
                                                           groupId,
                                                           existingOrders,
                                                           onComplete,
                                                           onDeleteOrder,
                                                           toEdit,
                                                           isViewMode = false,
                                                       }) => {
    const { t } = useTranslation('common');
    const {
        handleSubmit,
        errors,
        setValue,
        isSubmitting,
        items,
        fields,
        addItem,
        removeItem,
        onSubmit,
        isEditing,
        isFormValid,
        fireEquipmentFormTexts,
    } = useFireEquipmentFormHooks(groupId, existingOrders, onComplete);

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
                        {fields.map((field, index) => (
                            <FormContainer key={field.id}>
                                <div className="flex w-full flex-col items-start justify-center gap-6 text-[#484848]">
                                    <TextBox
                                        label={fireEquipmentFormTexts.fields.name}
                                        required
                                        value={items[index]?.name || ''}
                                        onChange={(value) =>
                                            setValue(`items.${index}.name`, value, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            })
                                        }
                                        error={errors.items?.[index]?.name?.message}
                                    />
                                    <TextBox
                                        label={fireEquipmentFormTexts.fields.quantity}
                                        required
                                        type="number"
                                        value={String(items[index]?.quantity || 0)}
                                        note={fireEquipmentFormTexts.notes.quantity}
                                        onChange={(value) =>
                                            setValue(`items.${index}.quantity`, Number(value), {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            })
                                        }
                                        error={errors.items?.[index]?.quantity?.message}
                                    />
                                    <Selector
                                        label={fireEquipmentFormTexts.fields.fuel}
                                        required
                                        options={fireEquipmentFormTexts.fuelOptions}
                                        value={items[index]?.fuel}
                                        onChange={(value) =>
                                            setValue(
                                                `items.${index}.fuel`,
                                                Number(value) as FireEquipmentFuel,
                                                {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                }
                                            )
                                        }
                                        error={errors.items?.[index]?.fuel?.message}
                                    />
                                    <TextArea
                                        label={fireEquipmentFormTexts.fields.usage}
                                        required
                                        value={items[index]?.usage || ''}
                                        onChange={(value) =>
                                            setValue(`items.${index}.usage`, value, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            })
                                        }
                                        error={errors.items?.[index]?.usage?.message}
                                    />
                                    <Radio
                                        label={fireEquipmentFormTexts.fields.isTakeaway}
                                        name={`items.${index}.isTakeaway`}
                                        options={fireEquipmentFormTexts.isTakeawayOptions}
                                        value={
                                            items[index]?.isTakeaway !== undefined
                                                ? items[index].isTakeaway
                                                    ? '1'
                                                    : '2'
                                                : '1'
                                        }
                                        onChange={(value) =>
                                            setValue(`items.${index}.isTakeaway`, value === '1', {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            })
                                        }
                                        required
                                        error={errors.items?.[index]?.isTakeaway?.message}
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
                                    <TextArea
                                        label={fireEquipmentFormTexts.fields.remark}
                                        required
                                        requireMessage={fireEquipmentFormTexts.notes.remarkRequired}
                                        value={items[index]?.remarks || ''}
                                        onChange={(value) =>
                                            setValue(`items.${index}.remarks`, value, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            })
                                        }
                                        error={errors.items?.[index]?.remarks?.message}
                                    />
                                    {items.length > 1 && (
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

                        <div className="mx-auto flex justify-center gap-4">
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
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default FireEquipmentForm;