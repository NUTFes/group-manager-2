import { FC, useState } from 'react';
import Link from 'next/link';
import CorporateIcon from '../../../public/corporate_logo.svg';
import ProfileIcon from '../../../public/profile_icon.svg';
import UserModal from '../UserModal';
import { UserInfo } from '../UserModal/UserModal';

type HeaderProps = {
  onClick: () => void;
};

const Header: FC<HeaderProps> = () => {
  const user: UserInfo = {
    id: '1',
    role: 'admin',
    name: 'John Doe',
    email: '',
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-20 w-full items-center justify-between bg-main px-8">
      <Link href="/home">
        <CorporateIcon height="60" />
      </Link>
      <button onClick={() => setIsOpen(true)}>
        <ProfileIcon height="56" />
      </button>
      <UserModal isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />
    </div>
  );
};

export default Header;
