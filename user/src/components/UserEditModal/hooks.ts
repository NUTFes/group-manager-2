import { useEffect } from 'react';
import { UserInformation, useMutateUserDetails } from '@/api/useUserDetailApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { EditUserDetailsFormSchema, EditUserDetailsSchema } from './schema';

export const useUserEditModalHooks = (
  userInformation?: UserInformation,
  mutate?: () => void
) => {
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
      !window.confirm(
        'メールアドレスを変更する場合は、変更後のメールアドレスで再度ログインする必要があります。パスワードは以前のものと同じです。'
      )
    ) {
      toast.success('変更はキャンセルされました。');
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
      toast.success('ユーザー情報を登録しました。');
      // メールアドレスを変更した場合はサインアウト
      if (isChangeEmail) {
        toast.success(
          'メールアドレスを変更しました。再度ログインしてください。'
        );
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
        toast.error('このメールアドレスはすでに使われています');
      }
      toast.error('更新に失敗しました。');
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
