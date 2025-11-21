import { FC } from 'react';
import Link from 'next/link';
import Modal from '@/components/Modal';
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

      {/* Modals */}
      <Modal
        isOpen={isOpenNotificationModal}
        onClose={closeNotificationModal}
        title="通知"
      >
        <p>通知はありません</p>
      </Modal>

      <Modal isOpen={isOpenMemoModal} onClose={closeMemoModal} title="メモ">
        <p>メモはありません</p>
      </Modal>

      <Modal
        isOpen={isOpenAccountModal}
        onClose={closeAccountModal}
        title="アカウント"
      >
        <p>アカウント情報</p>
      </Modal>
    </div>
  );
};

export default Header;
