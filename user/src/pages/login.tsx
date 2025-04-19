import { useRouter } from 'next/router';
import LoginForm from '@/components/LoginForm/LoginForm';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // すでにログインしている場合はダッシュボードにリダイレクト
  if (isAuthenticated) {
    router.replace('/dashboard');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md">
        <LoginForm
          onSuccess={() => {
            router.replace('/dashboard');
          }}
        />
      </div>
    </div>
  );
}
