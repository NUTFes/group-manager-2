import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  // 認証状態を取得
  const { status } = useSession();
  const router = useRouter();

  // トップページのURLを取得
  const isAuthPage = router.pathname === '/';

  // 認証されていない場合、トップページ以外にいる場合はリダイレクト
  if (status === 'loading') {
    console.log('Loading...'); // 認証状態が読み込み中
    return null; // 読み込み中は何も表示しない
  }

  // 認証されていない場合、トップページ以外にいる場合はリダイレクト
  if (status === 'unauthenticated' && !isAuthPage) {
    console.log('Redirecting to login page...'); // 認証されていない場合
    // 未認証かつ、トップページ以外にいる場合はリダイレクト
    router.replace('/');
    return null;
  }

  // 認証されている場合、子コンポーネントを表示
  return <>{children}</>;
}

export default AuthGuard;
