import { useEffect } from 'react';
import {
  GroupResponse,
  useCreateGroups,
  useUpdateGroups,
} from '@/api/groupApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { GroupForm, groupSchema } from './schema';

export const useGroupFormHooks = (
  // groupsがすでに申請されている場合，formに表示させるため，引数として渡す
  groups: GroupResponse | undefined
) => {
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
      project_name: groups?.projectName ?? '',
      is_international: groups?.isInternational ? '1' : '0',
      is_external: groups?.isExternal ? '1' : '0',
      group_category_id: groups?.groupCategoryId.toString() ?? '',
      activity: groups?.activity ?? '',
      user_id: groups?.userId ?? 1,
      fes_year_id: groups?.fesYearId ?? 1,
      committee: groups?.committee ? 1 : 0,
    },
  });

  // フォームをリアルタイム監視
  const values = watch();

  // group_category_idの変更を監視し、committeeを自動更新
  useEffect(() => {
    if (values.group_category_id === '6') {
      setValue('committee', 1);
    } else {
      setValue('committee', 0);
    }
  }, [values.group_category_id, setValue]);

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
        mutate(`/groups/${formData.user_id}`);
        toast.success('送信しました');
      } catch {
        toast.error('送信に失敗しました。');
      }
      // 団体申請がない場合は新規作成
    } else {
      try {
        await create({ query: formData });
        toast.success('送信しました');
        mutate(`/groups/${formData.user_id}`);
      } catch {
        toast.error('送信に失敗しました。');
      }
      reset();
    }
  };

  // ラジオボタンの値をbooleanに変換
  const convertToBoolean = (value: string): boolean => {
    return value === '1' ? true : false;
  };

  // ？？？？？？？？？？
  const validateEdit = () => {
    if (groups && values) {
      if (
        groups.name === values.name &&
        groups.projectName === values.project_name &&
        groups.isInternational === convertToBoolean(values.is_international) &&
        groups.isExternal === convertToBoolean(values.is_external) &&
        groups.groupCategoryId === parseInt(values.group_category_id) &&
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
    convertToBoolean,
    validateEdit,
    values,
  };
};
