import { FC } from 'react';
import CommonButton from '@/components/CommonButton';

const Home: FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-start justify-start gap-8">
      <h1 className="text-4xl font-bold">ダッシュボード</h1>
      <p className="text-lg text-gray-600">
        参加団体管理アプリ - 管理者ページへようこそ
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">基本操作</h2>
          <p className="text-gray-600">
            物品割り当て、会場割り当て、お知らせ作成など
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">申請情報</h2>
          <p className="text-gray-600">
            参加団体申請、会場申請、物品申請などの管理
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">一覧情報</h2>
          <p className="text-gray-600">ユーザー一覧、会場一覧、物品一覧など</p>
        </div>
      </div>
      <div className="mt-8">
        <CommonButton iconName="dashboard">ダッシュボードへ</CommonButton>
      </div>
    </div>
  );
};

export default Home;
