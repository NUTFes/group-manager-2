import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { LoginModalSchema, loginModalSchema } from './schema';

export const useLoginModalHooks = (onClose: () => void) => {
  const { login, isUserLoading } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (data: LoginModalSchema) => {
    try {
      setLoginError(null); // エラーをリセット
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success('ログインしました。');
        onClose();
      } else {
        // ログイン失敗時のエラーメッセージを表示
        setLoginError('メールアドレスまたはパスワードに誤りがあります');
      }
    } catch (error: unknown) {
      console.error('Login failed:', error);
      setLoginError('メールアドレスまたはパスワードに誤りがあります');
    }
  };

  const {
    setValue,
    watch,
    handleSubmit,
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

  return {
    handleLogin,
    setValue,
    watch,
    handleSubmit,
    errors,
    email,
    password,
    isLoggingIn: isUserLoading,
    loginError,
  };
};
