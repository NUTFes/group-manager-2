import { FC } from 'react';
import Link from 'next/link';
import { useHeaderHooks } from './hooks';

const Header: FC = () => {
  const {
    isOpenNotificationModal,
    isOpenMemoModal,
    isOpenAccountModal,
    openNotificationModal,
    openMemoModal,
    openAccountModal,
    closeNotificationModal,
    closeMemoModal,
    closeAccountModal,
  } = useHeaderHooks();

  return (
    <div className="fixed top-0 z-10 w-full bg-gradient-to-br from-gray-800/90 to-gray-800/80 px-8 text-white">
      <header className="flex h-[60px] w-full items-center">
        <div className="flex h-full items-center justify-center">
          <img src="/symbol-mark.svg" alt="Logo" className="my-1.5 h-[45px]" />
          <Link href="/dashboard" className="ml-2 text-white no-underline">
            参加団体管理アプリ-管理者ページ
          </Link>
        </div>
        <div className="flex grow items-center justify-end gap-4">
          <button
            onClick={openNotificationModal}
            className="material-icons cursor-pointer text-white"
          >
            notifications
          </button>
          <button
            onClick={openMemoModal}
            className="material-icons cursor-pointer text-white"
          >
            forum
          </button>
          <button
            onClick={openAccountModal}
            className="material-icons cursor-pointer text-white"
          >
            account_circle
          </button>
        </div>
      </header>

      {/* Modals - シンプルなプレースホルダー */}
      {isOpenNotificationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeNotificationModal}
        >
          <div
            className="rounded-lg bg-white p-8 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>通知</h2>
            <button onClick={closeNotificationModal}>閉じる</button>
          </div>
        </div>
      )}

      {isOpenMemoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeMemoModal}
        >
          <div
            className="rounded-lg bg-white p-8 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>メモ</h2>
            <button onClick={closeMemoModal}>閉じる</button>
          </div>
        </div>
      )}

      {isOpenAccountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeAccountModal}
        >
          <div
            className="rounded-lg bg-white p-8 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>アカウント</h2>
            <button onClick={closeAccountModal}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
