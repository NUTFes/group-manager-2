import { FC } from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useUser } from '@/hooks/useUser';
import CancelButton from '../CancelButton';
import EditButton from '../EditButton';
import LogoutButton from '../LogoutButton';

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UserModal: FC<UserModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('ログアウトしました');
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('ログアウトに失敗しました');
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="z-10 mx-[30px] my-[100px] flex h-[270px] max-w-[880px]">
        <div className="absolute m-6">
          <CancelButton onClick={onClose} />
        </div>
        <div className="flex flex-col items-center gap-12 rounded-[20px] bg-white p-6 shadow-2xl">
          <div className="flex w-[420px] flex-col items-center justify-center gap-6 py-4">
            <p className="text-3xl font-bold text-font">
              {user.name || 'ゲスト'}
            </p>
            <p className="text-base font-medium text-font">
              {user.email || 'メールアドレスなし'}
            </p>
            <EditButton OnClick={onClose} />
            <LogoutButton onClick={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
