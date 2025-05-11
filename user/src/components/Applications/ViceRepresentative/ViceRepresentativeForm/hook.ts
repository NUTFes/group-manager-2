import { useState } from 'react';
import {
  ORDER_TYPES,
  useGetUnregisteredGroup,
  useMutateUnregisteredGroup,
} from '@/api/unRegisteredGroupApi';
import {
  ViceRepresentativeResponse,
  useCreateViceRepresentative,
  useDeleteViceRepresentative,
  useUpdateViceRepresentative,
} from '@/api/viceRepresentativesApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ViceRepresentativeForm, viceRepresentativeSchema } from './schema';

export const useViceRepresentativeFormHook = (
  viceRepresentative: ViceRepresentativeResponse | undefined,
  groupId: number,
  mutatedViceRepresentative: () => void,
  mutateCheckAllRegistered: () => void
) => {
  // 副代表申請のAPIを呼び出すためのフック
  const { trigger: create } = useCreateViceRepresentative();
  const { trigger: update } = useUpdateViceRepresentative(
    viceRepresentative?.id
  );
  const { trigger: deleteViceRep } = useDeleteViceRepresentative(
    viceRepresentative?.id
  );

  // 申請しないを登録するためのAPIを呼び出すためのフック
  const { registerUnregisteredGroup } = useMutateUnregisteredGroup(
    ORDER_TYPES.SUB_REP
  );
  const { deleteUnregisteredGroup } = useMutateUnregisteredGroup(
    ORDER_TYPES.SUB_REP
  );
  const { unregisteredData, mutateUnregisteredGroup } = useGetUnregisteredGroup(
    groupId,
    ORDER_TYPES.SUB_REP
  );

  const [isIndividual, setIsIndividual] = useState(() => {
    if (unregisteredData) {
      return true;
    } else if (viceRepresentative) {
      return false;
    } else {
      return undefined;
    }
  });

  const setIsIndividualById = (id: number) => {
    setIsIndividual(id === 1);
  };

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
    watch,
  } = useForm<ViceRepresentativeForm>({
    resolver: isIndividual
      ? async (values: ViceRepresentativeForm) => ({
          values,
          errors: {},
        })
      : zodResolver(viceRepresentativeSchema),
    defaultValues: {
      groupId: groupId,
      name: viceRepresentative?.name || '',
      studentId: viceRepresentative?.studentId || 0,
      gradeId: viceRepresentative?.gradeId || 0,
      departmentId: viceRepresentative?.departmentId || 0,
      email: viceRepresentative?.email || '',
      tel: viceRepresentative?.tel || '',
    },
  });

  const values = watch();

  const onSubmit = (onSuccess: () => void) =>
    handleSubmit(async (data) => {
      try {
        if (isIndividual === true) {
          if (unregisteredData === null) {
            await registerUnregisteredGroup(data.groupId);
          }
          await deleteViceRep();
          await mutateUnregisteredGroup();
        } else {
          await deleteUnregisteredGroup(unregisteredData);
          await mutateUnregisteredGroup();
          if (viceRepresentative) {
            await update({ query: data });
            await mutatedViceRepresentative();
          } else {
            await create({ query: data });
            await mutatedViceRepresentative();
            await mutateCheckAllRegistered();
          }
        }
        toast.success('送信に成功しました');
        onSuccess();
      } catch {
        toast.error('送信に失敗しました');
      }
    });

  return {
    setValue,
    getValues,
    errors,
    reset,
    watch,
    onSubmit,
    option2,
    isIndividual,
    setIsIndividualById,
    values,
  };
};

export const option2 = [
  { id: 1, name: 'はい(一人での参加)' },
  { id: 0, name: 'いいえ(グループで参加)' },
];
