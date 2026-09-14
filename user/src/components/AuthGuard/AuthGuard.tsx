import { useRouter } from 'next/router';
import { isPublicPath } from '@/utils/constants';
import { useSession } from 'next-auth/react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  // 認証状態を取得
  const { status } = useSession();
  const router = useRouter();

  // 認証なしで閲覧できるページは、セッション状態を待たずに表示する
  // （QRコードから開くページなどをセッション問い合わせで白画面にしないため）
  const isPublicPage = isPublicPath(router.pathname);
  if (isPublicPage) {
    return <>{children}</>;
  }

  // 読み込み中は何も表示しない
  if (status === 'loading') {
    return null;
  }

  // 未認証の場合はトップページへリダイレクト
  if (status === 'unauthenticated') {
    router.replace('/');
    return null;
  }

  // 認証済みの場合、子コンポーネントを表示
  return <>{children}</>;
}

export default AuthGuard;
