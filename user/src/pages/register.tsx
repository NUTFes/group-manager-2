import { useEffect } from 'react';
import { useRouter } from 'next/router';
import RegisterCarousel from '@/components/RegisterCarousel';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // すでにログインしている場合はダッシュボードにリダイレクト
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = () => {
    // TODO: フォームの送信処理を実装
    console.log('Form submitted');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <RegisterCarousel isOpen={true} onSubmit={handleSubmit} />
    </div>
  );
}
