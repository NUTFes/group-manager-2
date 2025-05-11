import { useEffect, useState } from 'react';
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
import { mutate } from 'swr';
import { ViceRepresentativeForm, viceRepresentativeSchema } from './schema';

export const useViceRepresentativeFormHook = (
  viceRepresentative: ViceRepresentativeResponse | undefined,
  groupId: number
) => {
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
    watch,
  } = useForm<ViceRepresentativeForm>({
    resolver: zodResolver(viceRepresentativeSchema),
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

  const [isIndividual, setIsIndividual] = useState<boolean | undefined>(
    undefined
  );

  const setIsIndividualById = (id: number) => {
    setIsIndividual(id === 1);
  };

  const { trigger: create } = useCreateViceRepresentative();

  const { trigger: update } = useUpdateViceRepresentative(
    viceRepresentative?.id
  );

  const { trigger: deleteViceRep } = useDeleteViceRepresentative(
    viceRepresentative?.id
  );

  const { registerUnregisteredGroup } = useMutateUnregisteredGroup(
    ORDER_TYPES.SUB_REP
  );

  const { deleteUnregisteredGroup } = useMutateUnregisteredGroup(
    ORDER_TYPES.SUB_REP
  );

  const { unregisteredData } = useGetUnregisteredGroup(
    groupId,
    ORDER_TYPES.SUB_REP
  );

  useEffect(() => {
    if (unregisteredData) {
      setIsIndividual(true);
    } else if (viceRepresentative) {
      setIsIndividual(false);
    } else {
      setIsIndividual(undefined);
    }
  }, [unregisteredData, viceRepresentative]);

  const onSubmit = (onSuccess: () => void) =>
    handleSubmit(async (data) => {
      try {
        if (isIndividual === true) {
          if (!unregisteredData) {
            await registerUnregisteredGroup(data.groupId);
          }
          await mutate(
            `/un_registered_groups/group/${data.groupId}?type=${ORDER_TYPES.SUB_REP}`,
            undefined,
            {
              revalidate: true,
            }
          );
          await deleteViceRep();
        } else {
          if (viceRepresentative) {
            await update({ query: data });
            await mutate(`/sub_reps/group/${data.groupId}`, undefined, {
              revalidate: true,
            });
          } else {
            await create({ query: data });
            await mutate(`/sub_reps/group/${data.groupId}`, undefined, {
              revalidate: true,
            });
            await mutate(`/check_all_registered/${data.groupId}`, undefined, {
              revalidate: true,
            });
          }
          await deleteUnregisteredGroup(unregisteredData);
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
