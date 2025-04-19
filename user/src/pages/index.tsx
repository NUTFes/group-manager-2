import { useState } from 'react';
import LoginModal from '@/components/LoginModal';
import NewsList from '@/components/NewsList';
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
      <div className="m-4 flex flex-col gap-10 lg:m-10 lg:flex-row">
        <NewsList isLoginPage={true} />
        <WelcomeBox
          handleLoginClick={() => {
            handleLoginClick();
          }}
          handleRegisterClick={() => {
            handleRegisterClick();
          }}
        />
      </div>
    </>
  );
}
