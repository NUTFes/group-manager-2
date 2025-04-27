import { useState } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LoginModalSchema, loginModalSchema } from './schema';

export const useLoginModalHooks = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  // react-hook-formを初期化
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

  // フォームの送信処理
  const onSubmit = handleSubmit((data) => {
    // ログイン中・・・
    setIsLoggingIn(true);

    // APIにリクエストを送信してログイン処理を行う
    signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    })
      .then((res) => {
        if (res?.error) {
          setError('email', { type: 'login' });
          setError('password', {
            type: 'login',
            message: 'emailかpassworが違います',
          });
          toast.error('ログインに失敗しました');
          setIsLoggingIn(false);
          return;
        }
        // ログイン成功
        toast.success('ログインに成功しました');
        router.push('/home');
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return {
    onSubmit,
    setValue,
    errors,
    email,
    password,
    isLoggingIn,
  };
};
