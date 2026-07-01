import { useEffect, useRef } from 'react';
import {
  FireEquipmentFuel,
  FireEquipmentResponse,
  useFireEquipmentMutations,
  useGetFireEquipmentOrdersByGroupId,
} from '@/api/fireEquipmentApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  FireEquipmentFormSchema,
  FireEquipmentFormValues,
  FireEquipmentItemValues,
} from './schema';

export const DEFAULT_FIRE_EQUIPMENT_ITEM = (): FireEquipmentItemValues => ({
  name: '',
  quantity: 0,
  fuel: FireEquipmentFuel.GAS_BOTTLE,
  usage: '',
  isTakeaway: true,
  remarks: '',
});

const createDefaultItems = (
  orders?: FireEquipmentResponse[]
): FireEquipmentItemValues[] => {
  if (orders && orders.length > 0) {
    return orders.map((o) => ({
      id: o.id,
      name: o.name,
      quantity: o.quantity,
      fuel: o.fuel,
      usage: o.usage,
      isTakeaway: o.is_takeaway ?? true,
      remarks: o.remark || '',
    }));
  }
  return [DEFAULT_FIRE_EQUIPMENT_ITEM()];
};

const isItemValid = (item: FireEquipmentItemValues): boolean => {
  if (!item.name || item.name.trim() === '') return false;
  if (!item.quantity || item.quantity < 1) return false;
  if (!item.fuel) return false;
  if (!item.usage || item.usage.trim() === '') return false;
  return !(!item.isTakeaway && (item.remarks ?? '').trim() === '');
};

export const useFireEquipmentFormHooks = (
  groupId: number,
  existingOrders?: FireEquipmentResponse[],
  onComplete?: () => Promise<void>
) => {
  const { t } = useTranslation('common');
  const { mutateFireEquipmentOrders } =
    useGetFireEquipmentOrdersByGroupId(groupId);
  const { postFireEquipmentOrder, patchFireEquipmentOrder } =
    useFireEquipmentMutations();

  const isEditing = !!existingOrders && existingOrders.length > 0;

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
    reset,
  } = useForm<FireEquipmentFormValues>({
    mode: 'onChange',
    resolver: zodResolver(FireEquipmentFormSchema),
    defaultValues: {
      items: createDefaultItems(existingOrders),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // watch() の代わりに useWatch で各フィールドを直接監視
  const items = useWatch({
    control,
    name: 'items',
  }) as FireEquipmentItemValues[];

  // existingOrders が変わったらフォームをリセット
  const prevOrdersRef = useRef<string>('__initial__');
  useEffect(() => {
    const nextIds = (existingOrders ?? []).map((o) => o.id).join(',');
    if (prevOrdersRef.current !== nextIds) {
      reset(
        { items: createDefaultItems(existingOrders) },
        {
          keepDirty: false,
          keepErrors: false,
          keepDirtyValues: false,
          keepValues: false,
          keepDefaultValues: false,
        }
      );
      prevOrdersRef.current = nextIds;
    }
  }, [existingOrders, reset]);

  const isFormValid = items.length > 0 && items.every(isItemValid);

  const addItem = () => append(DEFAULT_FIRE_EQUIPMENT_ITEM());

  const removeItem = (index: number) => {
    if (items.length > 1) remove(index);
  };

  const onSubmit = async (
    formData: FireEquipmentFormValues
  ): Promise<boolean> => {
    try {
      await Promise.all(
        formData.items.map((item, index) => {
          const payload = {
            group_id: groupId,
            name: item.name,
            quantity: item.quantity,
            fuel: item.fuel,
            usage: item.usage,
            is_takeaway: item.isTakeaway,
            remark: item.remarks || '',
          };
          const existingId = existingOrders?.[index]?.id;
          if (existingId !== undefined) {
            return patchFireEquipmentOrder(existingId, payload);
          }
          return postFireEquipmentOrder(payload);
        })
      );

      toast.success(
        isEditing
          ? t('applications.fireEquipment.messages.updateSuccess')
          : t('applications.fireEquipment.messages.registerSuccess')
      );

      if (onComplete) {
        await onComplete();
      } else {
        await mutateFireEquipmentOrders();
      }

      return true;
    } catch (error) {
      console.error('火気申請送信エラー:', error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error(
        t('applications.fireEquipment.messages.submitFailed', { message })
      );
      return false;
    }
  };

  const fireEquipmentFormTexts = {
    fields: {
      name: t('applications.fireEquipment.fields.name'),
      quantity: t('applications.fireEquipment.fields.quantity'),
      fuel: t('applications.fireEquipment.fields.fuel'),
      usage: t('applications.fireEquipment.fields.usage'),
      isTakeaway: t('applications.fireEquipment.fields.isTakeaway'),
      remark: t('applications.fireEquipment.fields.remark'),
    },
    notes: {
      quantity: t('applications.fireEquipment.notes.quantity'),
      takeaway: t('applications.fireEquipment.notes.takeaway'),
      remark: t('applications.fireEquipment.notes.remark'),
      remarkRequired: t('applications.fireEquipment.notes.remarkRequired'),
    },
    fuelOptions: [
      { id: 0, name: t('form.validation.select'), disabled: true },
      {
        id: Number(FireEquipmentFuel.GAS_BOTTLE),
        name: t('applications.fireEquipment.fuel.gasBottle'),
        disabled: false,
      },
      {
        id: Number(FireEquipmentFuel.LP_GAS),
        name: t('applications.fireEquipment.fuel.lpGas'),
        disabled: false,
      },
      {
        id: Number(FireEquipmentFuel.CHARCOAL),
        name: t('applications.fireEquipment.fuel.charcoal'),
        disabled: false,
      },
    ],
    isTakeawayOptions: [
      { id: 1, name: t('applications.fireEquipment.radio.options.yes') },
      { id: 2, name: t('applications.fireEquipment.radio.options.no') },
    ],
    buttons: {
      add: t('form.actions.add'),
      register: t('form.actions.register'),
      update: t('form.actions.save'),
      delete: t('form.actions.delete'),
      edit: t('form.actions.edit'),
    },
  };

  return {
    handleSubmit,
    control,
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
  };
};
