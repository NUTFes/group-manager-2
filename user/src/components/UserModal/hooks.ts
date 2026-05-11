import { useState } from 'react';
import { useGetCurrentUserInformation } from '@/api/useUserDetailApi';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

export const useUserModalHooks = (onClose: () => void) => {
  const { t } = useTranslation('common');
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
      toast.success(t('userModal.toasts.logoutSuccess'));
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(t('userModal.toasts.logoutFailed'));
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
