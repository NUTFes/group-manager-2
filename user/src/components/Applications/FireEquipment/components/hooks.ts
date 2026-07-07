import { useState } from 'react';
import {
  FireEquipmentFuel,
  FireEquipmentResponse,
  useFireEquipmentMutations,
  useGetFireEquipmentOrderByGroupId,
} from '@/api/fireEquipmentApi';
import {
  HealthCenterSubmissionStatus,
  useGetHealthCenterSubmissionStatus,
  useUpdateSubmissionStatusFor,
} from '@/api/healthCenterSubmissionStatusApi';
import { NO_ID_STRING, YES_ID_STRING } from '@/utils/constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useFireEquipmentTexts } from '../constant';
import {
  FireEquipmentFormValues,
  FireEquipmentSchema,
  UnregisteredFireEquipmentFormValues,
  UnregisteredFireEquipmentSchema,
} from './schema';

export const useFireEquipmentOrder = (
  groupId: number,
  fireEquipmentData?: FireEquipmentResponse,
  handleEditCancel?: () => void,
  status?: HealthCenterSubmissionStatus
) => {
  const fireEquipmentTexts = useFireEquipmentTexts();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateFireEquipmentOrder } =
    useGetFireEquipmentOrderByGroupId(groupId);
  const { mutateHealthCenterSubmissionStatus } =
    useGetHealthCenterSubmissionStatus(groupId);

  const {
    postFireEquipmentOrder,
    patchFireEquipmentOrder,
    resubmitFireEquipmentOrder,
  } = useFireEquipmentMutations();
  const updateStatus = useUpdateSubmissionStatusFor(
    groupId,
    'fire_equipment_order'
  );
  const isResubmission = status === 'waiting_resubmission';

  const {
    handleSubmit: handleSubmitUnregistered,
    formState: { errors: errorsUnregistered },
    setValue: setValueUnregistered,
    watch: watchUnregistered,
  } = useForm<UnregisteredFireEquipmentFormValues>({
    resolver: zodResolver(UnregisteredFireEquipmentSchema),
    defaultValues: {
      groupId: groupId,
      // 既存データがある（修正モード）場合は「はい」を初期選択
      isRegister: fireEquipmentData ? !!fireEquipmentData.name : true,
    },
  });

  // 既存の火気申請データがある場合は、編集モードにする
  const isEditing = !!fireEquipmentData;

  const defaultValues: FireEquipmentFormValues = {
    name: fireEquipmentData?.name || '',
    quantity: fireEquipmentData?.quantity || 0,
    fuel: fireEquipmentData?.fuel || FireEquipmentFuel.GAS_BOTTLE,
    usage: fireEquipmentData?.usage || '',
    isTakeaway: fireEquipmentData?.is_takeaway ?? true,
    remarks: fireEquipmentData?.remark || '',
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FireEquipmentFormValues>({
    resolver: zodResolver(FireEquipmentSchema),
    defaultValues: defaultValues,
  });

  const valuesUnregistered = watchUnregistered();
  const isRegister = valuesUnregistered.isRegister;
  const isRegisterValue = isRegister ? YES_ID_STRING : NO_ID_STRING;
  const setIsRegisterValue = (
    value: typeof YES_ID_STRING | typeof NO_ID_STRING
  ) => {
    setValueUnregistered('isRegister', value === YES_ID_STRING);
  };

  const updateStatusToUnapproved = async (): Promise<boolean> => {
    if (status === 'unapproved') return true;

    try {
      await updateStatus('unapproved');
      return true;
    } catch (error) {
      const message = fireEquipmentTexts.messages.submitFailed(
        error instanceof Error ? error.message : String(error)
      );
      setSubmitError(message);
      toast.error(message);
      return false;
    }
  };

  // 火気不使用として登録
  const onSubmitUnregistered = async (
    formData: UnregisteredFireEquipmentFormValues
  ) => {
    if (formData.isRegister) {
      return;
    }
    setSubmitError(null);
    try {
      if (isResubmission) {
        const result = await resubmitFireEquipmentOrder(
          {
            id: fireEquipmentData?.id,
            group_id: groupId,
          },
          false
        );
        if (!result.success) throw result.error;
      } else if (fireEquipmentData?.id !== undefined) {
        await patchFireEquipmentOrder(fireEquipmentData.id, {
          group_id: groupId,
          name: '',
          quantity: 0,
          fuel: FireEquipmentFuel.GAS_BOTTLE,
          usage: '',
          is_takeaway: true,
          remark: '',
        });
        if (!(await updateStatusToUnapproved())) return;
      } else {
        await postFireEquipmentOrder({
          group_id: groupId,
          name: '',
          quantity: 0,
          fuel: FireEquipmentFuel.GAS_BOTTLE,
          usage: '',
          is_takeaway: true,
          remark: '',
        });
        if (!(await updateStatusToUnapproved())) return;
      }

      await mutateFireEquipmentOrder();
      await mutateHealthCenterSubmissionStatus();

      toast.success(fireEquipmentTexts.messages.noApplicationSuccess);
      handleEditCancel?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const submitMessage = fireEquipmentTexts.messages.submitFailed(message);
      setSubmitError(submitMessage);
      toast.error(submitMessage);
    }
  };
  const submitUnregisteredHandler =
    handleSubmitUnregistered(onSubmitUnregistered);

  const values = watch();

  const validate = () => {
    if (!fireEquipmentData) {
      return false;
    }

    return (
      defaultValues.name === values.name &&
      defaultValues.quantity === values.quantity &&
      defaultValues.fuel === values.fuel &&
      defaultValues.usage === values.usage &&
      defaultValues.isTakeaway === values.isTakeaway &&
      defaultValues.remarks === values.remarks
    );
  };

  // 火気申請の登録・更新
  const onSubmitFireEquipment = async (formData: FireEquipmentFormValues) => {
    setSubmitError(null);
    const payload = {
      group_id: groupId,
      name: formData.name,
      quantity: formData.quantity,
      fuel: formData.fuel,
      usage: formData.usage,
      is_takeaway: formData.isTakeaway,
      remark: formData.remarks || '',
    };

    try {
      if (isResubmission) {
        const result = await resubmitFireEquipmentOrder(
          {
            id: fireEquipmentData?.id,
            ...payload,
          },
          true
        );
        if (!result.success) throw result.error;
      } else if (isEditing && fireEquipmentData?.id !== undefined) {
        await patchFireEquipmentOrder(fireEquipmentData.id, payload);
        if (!(await updateStatusToUnapproved())) return;
      } else {
        await postFireEquipmentOrder(payload);
        if (!(await updateStatusToUnapproved())) return;
      }

      await mutateFireEquipmentOrder();
      await mutateHealthCenterSubmissionStatus();

      // 成功後に編集モードを終了
      handleEditCancel?.();
      toast.success(
        isEditing
          ? fireEquipmentTexts.messages.updateSuccess
          : fireEquipmentTexts.messages.registerSuccess
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const submitMessage = fireEquipmentTexts.messages.submitFailed(message);
      setSubmitError(submitMessage);
      toast.error(submitMessage);
    }
  };

  const submitHandler = handleSubmit(onSubmitFireEquipment);

  return {
    isRegister,
    submitUnregisteredHandler,
    errorsUnregistered,
    isRegisterValue,
    setIsRegisterValue,
    values,
    errors,
    setValue,
    submitHandler,
    isEditing,
    validate,
    submitError,
  };
};

export const convertToBoolToString = (value: boolean) => {
  return value ? YES_ID_STRING : NO_ID_STRING;
};
