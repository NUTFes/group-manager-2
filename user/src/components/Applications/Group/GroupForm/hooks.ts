import { useEffect } from 'react';
import {
  GroupResponse,
  useCreateGroups,
  useUpdateGroups,
} from '@/api/groupApi';
import { GROUP_CATEGORY } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { GroupForm, groupSchema } from './schema';

export const useGroupFormHooks = (
  // groupsがすでに申請されている場合，formに表示させるため，引数として渡す
  groups: GroupResponse | undefined,
  userId: number,
  mutateGroups: () => void,
  mutateCheckAllRegisteredGroups: () => void,
  mutateGroupByUserId: () => void
) => {
  const { t } = useTranslation('common');
  // 団体カテゴリー一覧を取得
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<GroupForm>({
    resolver: zodResolver(groupSchema),
    mode: 'onChange',
    defaultValues: {
      name: groups?.name ?? '',
      projectName: groups?.projectName ?? '',
      isInternational: groups?.isInternational ?? false,
      isExternal: groups?.isExternal ?? false,
      groupCategoryId: groups?.groupCategoryId ?? GROUP_CATEGORY.FOOD_SALES,
      activity: groups?.activity ?? '',
      userId: groups?.userId ?? userId,
      fesYearId: groups?.fesYearId ?? 1,
      committee: groups?.committee ? 1 : 0,
    },
  });

  // フォームをリアルタイム監視
  const values = watch();

  // 団体カテゴリーが「実行委員」の場合は，committeeを1にする
  useEffect(() => {
    if (values.groupCategoryId === GROUP_CATEGORY.COMMITTEE) {
      setValue('committee', 1);
    } else {
      setValue('committee', 0);
    }
  }, [values.groupCategoryId, setValue]);

  const formatRadioValue = (v: boolean | undefined): '' | '1' | '0' => {
    if (v === undefined) return '';
    return v ? '1' : '0';
  };

  // 新しい団体申請を作成
  const {
    trigger: create,
    error: createError,
    isMutating: createIsMutating,
  } = useCreateGroups();

  // 既存の団体申請を更新
  const {
    trigger: update,
    error: updateError,
    isMutating: updateIsMutating,
  } = useUpdateGroups(groups?.id ?? 0);

  const onSubmit = async (formData: GroupForm) => {
    // 既存の団体申請がある場合は更新
    if (groups) {
      try {
        await update({ query: formData });
        mutateGroups();
        toast.success(t('form.messages.updateSuccess'));
      } catch {
        toast.error(t('form.messages.updateFailed'));
      }
      // 団体申請がない場合は新規作成
    } else {
      try {
        await create({ query: formData });
        mutateGroups();
        mutateCheckAllRegisteredGroups();
        mutateGroupByUserId();
        toast.success(t('form.messages.registerSuccess'));
      } catch {
        toast.error(t('form.messages.registerFailed'));
      }
      reset();
    }
  };

  const validateEdit = () => {
    if (groups && values) {
      if (
        groups.name === values.name &&
        groups.projectName === values.projectName &&
        groups.isInternational === values.isInternational &&
        groups.isExternal === values.isExternal &&
        groups.groupCategoryId === values.groupCategoryId &&
        groups.activity === values.activity
      ) {
        return true;
      }
    }
    return false;
  };

  return {
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    createError,
    createIsMutating,
    updateError,
    updateIsMutating,
    formatRadioValue,
    validateEdit,
    values,
  };
};
