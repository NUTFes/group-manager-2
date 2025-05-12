import { useState } from 'react';
import { useGetCurrentUserInformation } from '@/api/useUserDetailApi';
import { signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

export const useUserModalHooks = (onClose: () => void) => {
  const { userInformation, mutate } = useGetCurrentUserInformation();

  const [isEdit, setIsEdit] = useState(false);
  const handleEdit = () => {
    setIsEdit(true);
  };
  const handleCloseEdit = () => {
    setIsEdit(false);
  };

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

  return {
    userInformation,
    mutate,
    handleLogout,
    isEdit,
    handleEdit,
    handleCloseEdit,
  };
};
