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
import { groupLabels } from '../../label';
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

  // defaultValues は mount 時に一度しか評価されないため、団体データが
  // フォームより後に届いた場合は空欄のままになる。到着時に流し込み直す。
  useEffect(() => {
    if (!groups) return;

    reset({
      name: groups.name ?? '',
      projectName: groups.projectName ?? '',
      isInternational: groups.isInternational ?? false,
      isExternal: groups.isExternal ?? false,
      groupCategoryId: groups.groupCategoryId ?? GROUP_CATEGORY.FOOD_SALES,
      activity: groups.activity ?? '',
      userId: groups.userId ?? userId,
      fesYearId: groups.fesYearId ?? 1,
      committee: groups.committee ? 1 : 0,
    });
  }, [groups, userId, reset]);

  const groupFormTexts = {
    fields: {
      name: t(groupLabels[0]),
      projectName: t(groupLabels[1]),
      isInternational: t(groupLabels[2]),
      isExternal: t(groupLabels[3]),
      groupCategory: t(groupLabels[4]),
      activity: t(groupLabels[5]),
    },
    notes: {
      name: t('applications.group.notes.name'),
      projectName: t('applications.group.notes.projectName'),
      international: t('applications.group.notes.international'),
      external: t('applications.group.notes.external'),
      groupCategory: t('applications.group.notes.groupCategory'),
      activity: t('applications.group.notes.activity'),
    },
    options: {
      international: [
        { id: 0, name: t('applications.group.options.international.no') },
        { id: 1, name: t('applications.group.options.international.yes') },
      ],
      external: [
        { id: 0, name: t('applications.group.options.external.no') },
        { id: 1, name: t('applications.group.options.external.yes') },
      ],
    },
    buttons: {
      cancel: t('form.actions.cancel'),
      edit: t('form.actions.edit'),
      register: t('form.actions.register'),
    },
    messages: {
      registerFailed: t('form.messages.registerFailed'),
      registerSuccess: t('form.messages.registerSuccess'),
      updateSuccess: t('form.messages.updateSuccess'),
      updateFailed: t('form.messages.updateFailed'),
    },
  };

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
  const { trigger: create, isMutating: createIsMutating } = useCreateGroups();

  // 既存の団体申請を更新
  const { trigger: update, isMutating: updateIsMutating } = useUpdateGroups(
    groups?.id ?? 0
  );

  const onSubmit = async (formData: GroupForm) => {
    // 既存の団体申請がある場合は更新
    if (groups) {
      try {
        await update({ query: formData });
        await mutateGroups();
        toast.success(groupFormTexts.messages.updateSuccess);
        return true;
      } catch {
        toast.error(groupFormTexts.messages.updateFailed);
        return false;
      }
      // 団体申請がない場合は新規作成
    } else {
      try {
        await create({ query: formData });
        await mutateGroups();
        await mutateCheckAllRegisteredGroups();
        await mutateGroupByUserId();
        toast.success(groupFormTexts.messages.registerSuccess);
        reset();
        return true;
      } catch {
        toast.error(groupFormTexts.messages.registerFailed);
        return false;
      }
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
    createIsMutating,
    updateIsMutating,
    formatRadioValue,
    validateEdit,
    values,
    groupFormTexts,
  };
};
