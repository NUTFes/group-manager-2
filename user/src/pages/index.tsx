import { useState } from 'react';
import LoginModal from '@/components/LoginModal';
import NewsList from '@/components/NewsList';
import PasswordResetCard from '@/components/PasswordResetCard';
import RegisterCarousel from '@/components/RegisterCarousel';
import WelcomeBox from '@/components/WelcomeBox';

export default function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleRegisterClick = () => {
    return setIsRegisterOpen(true);
  };

  const handleLoginClick = () => {
    return setIsLoginOpen(true);
  };

  const onCloseLogin = () => {
    return setIsLoginOpen(false);
  };

  const onCloseRegister = () => {
    return setIsRegisterOpen(false);
  };

  return (
    <>
      <RegisterCarousel isOpen={isRegisterOpen} onClose={onCloseRegister} />
      <LoginModal isOpen={isLoginOpen} onClose={onCloseLogin} />
      <div className="m-4 flex flex-col items-center justify-center gap-[calc(3rem+10vw)] lg:m-10 lg:flex-row lg:items-start">
        <NewsList isLoginPage={true} />
        <div className="flex w-full max-w-[400px] flex-col items-center gap-8">
          <WelcomeBox
            handleLoginClick={() => {
              handleLoginClick();
            }}
            handleRegisterClick={() => {
              handleRegisterClick();
            }}
          />
          <PasswordResetCard />
        </div>
      </div>
    </>
  );
}
