import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/authStore';

const Dashboard = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-baseColor">
      <div className="space-y-8 rounded-2xl bg-white px-[clamp(10px,10vw,240px)] py-[clamp(5px,5vw,80px)] shadow-md">
        <h1 className="text-2xl font-bold text-font">ダッシュボード</h1>
        <p className="text-font">ようこそ！</p>
      </div>
    </div>
  );
};

export default Dashboard;
