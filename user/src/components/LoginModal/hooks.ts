import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LoginModalSchema, loginModalSchema } from './schema';

export const useLoginModalHooks = () => {
  const handleLogin = () => {
    // todo: implement login logic
    toast.success('押されたよ');
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
  };
};
