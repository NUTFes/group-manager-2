import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LoginModalSchema, loginModalSchema } from './schema';

export const useLoginModalHooks = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const {
    setValue,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginModalSchema>({
    resolver: zodResolver(loginModalSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');
  const password = watch('password');

  const onSubmit = handleSubmit((data) => {
    // ログイン中・・・
    setIsLoggingIn(true);

    // APIにリクエストを送信してログイン処理を行う
    signIn('credentials', {
      redirect: true,
      callbackUrl: '/home',
      ...data,
    })
      .then((res) => {
        if (res?.error) {
          setError('email', { type: 'login' });
          setError('password', {
            type: 'login',
            message: 'emailかpassworが違います',
          });
          return;
        }
        // ログイン成功
        toast.success('ログインに成功しました');
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return {
    setValue,
    watch,
    handleSubmit,
    setError,
    isLoggingIn,
    errors,
    email,
    password,
    onSubmit,
  };
};
