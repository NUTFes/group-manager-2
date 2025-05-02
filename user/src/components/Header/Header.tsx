import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/stores/authStore';
import CorporateIcon from '../../../public/corporate_logo.svg';
import ProfileIcon from '../../../public/profile_icon.svg';
import UserModal from '../UserModal';

type HeaderProps = {
  onClick: () => void;
};

const Header: FC<HeaderProps> = () => {
  // ルートパス（"/"）の場合はUserModalを表示しない
  const router = useRouter();
  const showUserModal = router.pathname !== '/';
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-20 w-full items-center justify-between bg-main px-8">
      <Link href="/home">
        <CorporateIcon height="60" />
      </Link>
      {showUserModal && (
        <button onClick={() => setIsOpen(true)}>
          <ProfileIcon height="56" />
        </button>
      )}
      {showUserModal && (
        <UserModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          user={user}
        />
      )}
    </div>
  );
};

export default Header;
