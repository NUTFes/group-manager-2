import { FC, useState } from 'react';
import CommonButton from '@/components/CommonButton';

const Dashboard: FC = () => {
  const [dashboardData] = useState({
    groupsCount: 0,
    usersCount: 0,
    stockCount: 0,
    assignedCount: 0,
  });

  return (
    <div className="flex min-h-screen flex-col gap-8">
      <h1 className="text-4xl font-bold">ダッシュボード</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 参加団体数カード */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-start">
            <h4 className="text-xl font-semibold">参加団体数</h4>
          </div>
          <hr className="mb-4" />
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">総数</p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.groupsCount}
              </p>
            </div>
          </div>
        </div>

        {/* ユーザー数カード */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-start">
            <h4 className="text-xl font-semibold">ユーザー数</h4>
          </div>
          <hr className="mb-4" />
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600">総数</p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.usersCount}
              </p>
            </div>
          </div>
        </div>

        {/* 物品割り当てカード */}
        <div className="rounded-lg bg-white p-6 shadow-md md:col-span-2">
          <div className="mb-4 flex items-center justify-start">
            <h4 className="text-xl font-semibold">物品割り当て</h4>
          </div>
          <hr className="mb-4" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-2 text-sm text-gray-600">在庫</p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.stockCount}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-2 text-sm text-gray-600">割り当て済み</p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.assignedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <CommonButton iconName="refresh">データ更新</CommonButton>
      </div>
    </div>
  );
};

export default Dashboard;
