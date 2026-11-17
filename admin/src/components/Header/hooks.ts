import { useState } from 'react';

export const useHeaderHooks = () => {
  const [isOpenNotificationModal, setIsOpenNotificationModal] = useState(false);
  const [isOpenMemoModal, setIsOpenMemoModal] = useState(false);
  const [isOpenAccountModal, setIsOpenAccountModal] = useState(false);

  const openNotificationModal = () => {
    setIsOpenNotificationModal(true);
  };

  const closeNotificationModal = () => {
    setIsOpenNotificationModal(false);
  };

  const openMemoModal = () => {
    setIsOpenMemoModal(true);
  };

  const closeMemoModal = () => {
    setIsOpenMemoModal(false);
  };

  const openAccountModal = () => {
    setIsOpenAccountModal(true);
  };

  const closeAccountModal = () => {
    setIsOpenAccountModal(false);
  };

  return {
    isOpenNotificationModal,
    isOpenMemoModal,
    isOpenAccountModal,
    openNotificationModal,
    closeNotificationModal,
    openMemoModal,
    closeMemoModal,
    openAccountModal,
    closeAccountModal,
  };
};
