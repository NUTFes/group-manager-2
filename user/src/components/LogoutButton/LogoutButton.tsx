import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { MdOutlineLogout } from 'react-icons/md';

type LogoutButtonProps = {
  onClick: () => void;
};

const LogoutButton: FC<LogoutButtonProps> = ({ onClick }) => {
  const { t } = useTranslation('common');

  return (
    <button className="flex w-32 gap-3" onClick={onClick}>
      <MdOutlineLogout color="#000000" size="24" />
      <p className="text-base font-medium text-font">{t('auth.logout')}</p>
    </button>
  );
};

export default LogoutButton;
