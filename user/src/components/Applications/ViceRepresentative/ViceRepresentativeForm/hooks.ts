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
import { getDepartmentOptions, getGradeOptions } from '@/utils/list';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { viceRepresentativeLabels } from '@/components/Applications/label';
import { isUnchanged } from '../../shared';
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
    control,
    getValues,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ViceRepresentativeForm>({
    mode: 'onChange',
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

  // 送信ボタンの無効化判定(B-2: isSubmitting || isUnchanged(...)へ統一)。
  // isIndividualがtrueの間は、name等の項目を変えていなくても
  // 「一人での参加」への切り替え自体が意味のある変更なので、常に送信可能にする。
  const validateEdit = () =>
    !isIndividual &&
    isUnchanged(viceRepresentative, values, [
      'name',
      'studentId',
      'gradeId',
      'departmentId',
      'email',
      'tel',
    ]);

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
          await deleteViceRep({});
          await mutateUnregisteredGroup();
        } else {
          // 二人以上の場合
          // 既存の未登録グループを削除する処理とキャッシュの更新を実行
          await deleteUnregisteredGroup(unregisteredData);
          await mutateUnregisteredGroup();
          // 副代表が存在する場合の分岐
          if (viceRepresentative) {
            await update({ body: data });
            await mutatedViceRepresentative();
          } else {
            // 副代表が存在しない場合、未登録グループの新規作成処理を実行し、副代表・登録済みのキャッシュを更新
            await create({ body: data });
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

  return {
    control,
    getValues,
    errors,
    reset,
    watch,
    onSubmit,
    isSubmitting,
    validateEdit,
    isIndividual,
    setIsIndividualById,
    values,
  };
};

export const useViceRepresentativeFormTexts = () => {
  const { t } = useTranslation('common');
  const gradeOptions = useMemo(() => getGradeOptions(t), [t]);
  const departmentOptions = useMemo(() => getDepartmentOptions(t), [t]);
  const labels = viceRepresentativeLabels.map((labelKey) => t(labelKey));
  const radioOptions = [
    {
      id: 1,
      name: t('applications.viceRepresentative.radio.options.individual'),
    },
    {
      id: 0,
      name: t('applications.viceRepresentative.radio.options.group'),
    },
  ];

  return {
    labels,
    notes: {
      name: t('applications.viceRepresentative.notes.name'),
      studentId: t('applications.viceRepresentative.notes.studentId'),
      email: t('applications.viceRepresentative.notes.email'),
      tel: t('applications.viceRepresentative.notes.tel'),
    },
    buttons: {
      register: t('form.actions.register'),
      save: t('form.actions.save'),
    },
    radioOptions,
    gradeOptions,
    departmentOptions,
  };
};
