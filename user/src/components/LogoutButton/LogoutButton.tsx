import { FC } from 'react';
import { MdOutlineLogout } from 'react-icons/md';
import { useLogoutButtonTexts } from './hooks';

type LogoutButtonProps = {
  onClick: () => void;
};

const LogoutButton: FC<LogoutButtonProps> = ({ onClick }) => {
  const { label } = useLogoutButtonTexts();

  return (
    <button className="flex w-32 gap-3" onClick={onClick}>
      <MdOutlineLogout color="#000000" size="24" />
      <p className="text-base font-medium text-font">{label}</p>
    </button>
  );
};

export default LogoutButton;
