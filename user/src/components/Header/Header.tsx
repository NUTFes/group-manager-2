import { FC } from 'react';
import Link from 'next/link';
import CorporateIcon from '../../../public/corporate_logo.svg';
import ProfileIcon from '../../../public/profile_icon.svg';

type HeaderProps = {
  onClick: () => void;
};

const Header: FC<HeaderProps> = ({ onClick }) => {
  return (
    <div className="flex h-20 w-full items-center justify-between bg-main px-8">
      <Link href="/">
        <CorporateIcon height="60" />
      </Link>
      <button onClick={onClick}>
        <ProfileIcon height="56" />
      </button>
    </div>
  );
};

export default Header;
