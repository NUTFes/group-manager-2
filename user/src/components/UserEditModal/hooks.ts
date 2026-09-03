import { useEffect, useMemo } from 'react';
import { UserInformation, useMutateUserDetails } from '@/api/useUserDetailApi';
import { getDepartmentOptions, getGradeOptions } from '@/utils/list';
import { zodResolver } from '@hookform/resolvers/zod';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { EditUserDetailsFormSchema, EditUserDetailsSchema } from './schema';

export const useUserEditModalHooks = (
  userInformation?: UserInformation,
  mutate?: () => void
) => {
  const { t } = useTranslation('common');
  // フォームの初期化
  const formMethods = useForm<EditUserDetailsFormSchema>({
    resolver: zodResolver(EditUserDetailsSchema),
    mode: 'all',
  });

  const { formState, watch, reset, handleSubmit } = formMethods;
  const user = userInformation?.user;
  const userDetails = userInformation?.userDetail;

  // ユーザー情報が変更されたときにフォームの初期値を更新
  useEffect(() => {
    if (userDetails && user) {
      reset({
        name: user?.name ?? '',
        studentId: userDetails?.studentId ? String(userDetails.studentId) : '',
        mail: user?.email ?? '',
        gradeId: userDetails?.gradeId ?? 0,
        departmentId: userDetails?.departmentId ?? 0,
        tel: userDetails?.tel ?? '',
      });
    }
  }, [user, userDetails, reset]);

  // 明示的に errors を使用していることを示す
  const { errors } = formState;
  const values = watch();

  const { trigger, isMutating, error } = useMutateUserDetails();

  const onSubmit = async (formData: EditUserDetailsFormSchema) => {
    const isChangeEmail = user?.email !== formData.mail;
    // emailの変更を行う場合はリダイレクトされることをメッセージに出す
    if (
      isChangeEmail &&
      !window.confirm(t('userEditModal.messages.emailChangeConfirm'))
    ) {
      toast.success(t('userEditModal.toasts.cancelled'));
      return;
    }

    // ユーザー情報の更新
    const submitData = {
      name: formData.name,
      studentId: Number(formData.studentId),
      email: formData.mail,
      tel: formData.tel,
      departmentId: Number(formData.departmentId),
      gradeId: Number(formData.gradeId),
    };
    try {
      await trigger({
        query: submitData,
      });
      toast.success(t('userEditModal.toasts.updateSuccess'));
      // メールアドレスを変更した場合はサインアウト
      if (isChangeEmail) {
        toast.success(t('userEditModal.toasts.emailChanged'));
        // 1秒待ってからサインアウト
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await signOut({ redirect: false });
        return;
      }
      // ユーザー情報を更新
      mutate?.();
    } catch {
      const info = error?.info;
      const exception = info?.exception;
      console.error('Error:', exception);
      if (
        exception?.includes('RecordNotUnique') ||
        exception?.includes('Duplicate entry')
      ) {
        toast.error(t('userEditModal.errors.duplicateEmail'));
      }
      toast.error(t('userEditModal.errors.updateFailed'));
    }
  };

  const handleSubmitForm = handleSubmit(onSubmit);

  const validateEdit = () => {
    return (
      user?.name === values.name &&
      userDetails?.studentId === Number(values.studentId) &&
      user?.email === values.mail &&
      userDetails?.tel === values.tel &&
      userDetails?.departmentId === Number(values.departmentId) &&
      userDetails?.gradeId === Number(values.gradeId)
    );
  };

  return {
    ...formMethods, // register, handleSubmit, errors, watch, setValue などを含む
    values, // watchの結果も返す
    errors, // 明示的に errors を返す
    isMutating, // フォームの送信中かどうか
    error, // エラーメッセージ
    handleSubmitForm, // フォームの送信処理
    validateEdit, // フォームのバリデーション処理
  };
};

export const useUserEditModalTexts = () => {
  const { t } = useTranslation('common');
  const gradeOptions = useMemo(() => getGradeOptions(t), [t]);
  const departmentOptions = useMemo(() => getDepartmentOptions(t), [t]);
  return {
    labels: {
      name: t('userEditModal.labels.name'),
      email: t('userEditModal.labels.email'),
      tel: t('userEditModal.labels.tel'),
      studentId: t('userEditModal.labels.studentId'),
      grade: t('userEditModal.labels.grade'),
      department: t('userEditModal.labels.department'),
    },
    notes: {
      name: t('userEditModal.notes.name'),
      email: t('userEditModal.notes.email'),
      tel: t('userEditModal.notes.tel'),
      studentId: t('userEditModal.notes.studentId'),
    },
    actions: {
      edit: t('form.actions.edit'),
    },
    gradeOptions,
    departmentOptions,
  };
};
