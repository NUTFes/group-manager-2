import { useState } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LoginModalSchema, loginModalSchema } from './schema';

export const useLoginModalHooks = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');

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
  const handleSignInSubmit = handleSubmit((data) => {
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
          setError('password', {
            type: 'login',
            message: t('loginModal.errors.invalidCredentials'),
          });
          toast.error(t('loginModal.toasts.loginFailed'));
          setIsLoggingIn(false);
          return;
        }
        // ログイン成功
        toast.success(t('loginModal.toasts.loginSuccess'));
        router.push('/home');
      })
      .catch((err) => {
        console.error(err);
      });
  });
  return {
    handleSignInSubmit,
    setValue,
    errors,
    email,
    password,
    isLoggingIn,
  };
};

export const useLoginModalTexts = () => {
  const { t } = useTranslation('common');
  return {
    labels: {
      email: t('loginModal.emailLabel'),
      password: t('loginModal.passwordLabel'),
    },
    notes: {
      email: t('loginModal.emailNote'),
    },
    buttons: {
      submit: t('loginModal.submit'),
      submitting: t('loginModal.submitting'),
    },
  };
};
