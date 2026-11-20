import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isPublicPath } from '@/utils/constants';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import CorporateIcon from '../../../public/corporate_logo.svg';
import ProfileIcon from '../../../public/profile_icon.svg';
import UserModal from '../UserModal';

type HeaderProps = {
  onClick: () => void;
};

const Header: FC<HeaderProps> = () => {
  // 認証なしで閲覧できるページ（トップページ・確定画面）ではUserModalを表示しない
  const router = useRouter();
  const showUserModal = !isPublicPath(router.pathname);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-20 w-full items-center justify-between bg-main px-8">
      <Link href="/home">
        <CorporateIcon height="60" />
      </Link>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        {showUserModal && (
          <>
            <button onClick={() => setIsOpen(true)}>
              <ProfileIcon height="56" />
            </button>
            <UserModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
