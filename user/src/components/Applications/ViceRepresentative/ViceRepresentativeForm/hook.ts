import { useMemo, useState } from 'react';
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
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ViceRepresentativeForm, viceRepresentativeSchema } from './schema';

export const useViceRepresentativeFormHook = (
  viceRepresentative: ViceRepresentativeResponse | undefined,
  groupId: number,
  mutatedViceRepresentative: () => void,
  mutateCheckAllRegistered: () => void
) => {
  const { t } = useTranslation('common');
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

  // 一人での参加かどうかを管理するstate
  const [isIndividual, setIsIndividual] = useState(() => {
    if (unregisteredData !== null) {
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
        // 一人での参加の場合
        if (isIndividual) {
          // 未登録データが存在しなければ、未登録グループの登録処理を実行
          if (unregisteredData === null) {
            await registerUnregisteredGroup(data.groupId);
          }
          // 副代表の削除処理を実行と未登録データのキャッシュ更新
          await deleteViceRep();
          await mutateUnregisteredGroup();
        } else {
          // 二人以上の場合
          // 既存の未登録グループを削除する処理とキャッシュの更新を実行
          await deleteUnregisteredGroup(unregisteredData);
          await mutateUnregisteredGroup();
          // 副代表が存在する場合の分岐
          if (viceRepresentative) {
            await update({ query: data });
            await mutatedViceRepresentative();
          } else {
            // 副代表が存在しない場合、未登録グループの新規作成処理を実行し、副代表・登録済みのキャッシュを更新
            await create({ query: data });
            await mutatedViceRepresentative();
            await mutateCheckAllRegistered();
          }
        }
        toast.success(
          t('applications.viceRepresentative.messages.submitSuccess')
        );
        onSuccess();
      } catch {
        toast.error(t('applications.viceRepresentative.messages.submitFailed'));
      }
    });

  const registerOrNotOption = useMemo(
    () => [
      {
        id: 1,
        name: t('applications.viceRepresentative.radio.options.individual'),
      },
      {
        id: 0,
        name: t('applications.viceRepresentative.radio.options.group'),
      },
    ],
    [t]
  );

  return {
    setValue,
    getValues,
    errors,
    reset,
    watch,
    onSubmit,
    registerOrNotOption,
    isIndividual,
    setIsIndividualById,
    values,
  };
};
