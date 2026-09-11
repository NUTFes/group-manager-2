import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  // 認証状態を取得
  const { status } = useSession();
  const router = useRouter();

  // トップページのURLを取得
  const isAuthPage = router.pathname === '/';

  // 読み込み中は何も表示しない
  if (status === 'loading') {
    return null;
  }

  // 未認証かつ、トップページ以外にいる場合はリダイレクト
  if (status === 'unauthenticated' && !isAuthPage) {
    router.replace('/');
    return null;
  }

  // 認証済みの場合、子コンポーネントを表示
  return <>{children}</>;
}

export default AuthGuard;
