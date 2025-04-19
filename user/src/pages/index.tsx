import Link from 'next/link';
import NewsList from '@/components/NewsList';

export default function Home() {
  return (
    <div className="container mx-auto flex justify-between space-x-8 px-4 py-8">
      {/* お知らせセクション */}
      <NewsList isLoginPage={false} />

      {/* 認証ボタンセクション */}
      <div className="w-80">
        <div className="flex flex-col items-center space-y-8 rounded-3xl bg-[#B7E576] p-8">
          <Link
            href="/register"
            className="w-full rounded-full bg-[#76B474] px-8 py-3 text-center text-white transition-all hover:bg-opacity-90"
          >
            新規登録
          </Link>
          <div className="text-center text-sm">初めての方はこちら</div>
          <Link
            href="/login"
            className="w-full rounded-full bg-[#76B474] px-8 py-3 text-center text-white transition-all hover:bg-opacity-90"
          >
            ログイン
          </Link>
          <div className="text-center text-sm">
            すでにアカウントをお持ちの方はこちら
          </div>
        </div>
      </div>
    </div>
  );
}
