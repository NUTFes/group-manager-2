import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { LoginModalSchema, loginModalSchema } from './schema';

export const useLoginModalHooks = (onClose: () => void) => {
  const { login, isUserLoading } = useAuth();

  const handleLogin = async (data: LoginModalSchema) => {
    try {
      await login(data.email, data.password);
      toast.success('ログインしました。');
      onClose();
    } catch (error: unknown) {
      console.error('Login failed:', error);
      let errorMessage = 'ログインに失敗しました。';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
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
  };
};
