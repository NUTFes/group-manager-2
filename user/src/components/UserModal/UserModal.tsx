import { FC } from 'react';
import CancelButton from '../CancelButton';
import EditButton from '../EditButton';
import LogoutButton from '../LogoutButton';
import Modal from '../Modal';

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfo;
};

export type UserInfo = {
  id: string;
  role: string;
  name: string;
  email: string;
};

const UserModal: FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-12 rounded-[20px] bg-white p-6 shadow-2xl">
        <div className="absolute left-6 top-6">
          <CancelButton onClick={onClose} />
        </div>
        <div className="flex w-[420px] flex-col items-center justify-center gap-6 py-4">
          <p className="text-sm font-bold text-font">{user.role}</p>
          <p className="text-3xl font-bold text-font">{user.name}</p>
          <p className="text-base font-medium text-font">{user.email}</p>
          <EditButton OnClick={onClose} />
          <LogoutButton onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default UserModal;
