import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import CancelButton from '../CancelButton';
import EditButton from '../EditButton';
import LogoutButton from '../LogoutButton';
import UserEditModal from '../UserEditModal';
import { useUserModalHooks } from './hooks';

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UserModal: FC<UserModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common');
  const {
    userInformation,
    handleLogout,
    isEdit,
    handleEdit,
    handleCloseEdit,
    mutate,
  } = useUserModalHooks(onClose);

  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center md:items-start md:justify-end">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="z-10  flex h-[270px] md:mx-[30px]  md:my-[100px] md:max-w-[880px]">
          <div className="absolute m-6">
            <CancelButton onClick={onClose} />
          </div>
          <div className="flex flex-col items-center gap-12 rounded-[20px] bg-white p-6 shadow-2xl">
            <div className="flex w-80 flex-col items-center justify-center gap-6 py-4 md:w-[420px]">
              <p className="text-3xl font-bold text-font">
                {userInformation?.user?.name || t('userModal.guest')}
              </p>
              <p className="text-base font-medium text-font">
                {userInformation?.user?.email || t('userModal.noEmail')}
              </p>
              <EditButton OnClick={handleEdit} />
              <LogoutButton onClick={handleLogout} />
            </div>
          </div>
        </div>
      </div>
      <UserEditModal
        isOpen={isEdit}
        onClose={handleCloseEdit}
        userInformation={userInformation}
        mutate={mutate}
      />
    </>
  );
};

export default UserModal;
