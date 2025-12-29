import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import Button from '../Button';

type WelcomeBoxProps = {
  handleRegisterClick?: () => void;
  handleLoginClick?: () => void;
};

const WelcomeBox: FC<WelcomeBoxProps> = ({
  handleLoginClick,
  handleRegisterClick,
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex w-full max-w-[400px] flex-col items-center justify-center gap-12 rounded-[30px] bg-secondary p-4 shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] md:p-8">
      <div className="flex flex-col items-center gap-2">
        <Button
          type="button"
          size="pc"
          color="main"
          onClick={handleRegisterClick}
        >
          {t('welcomeBox.register')}
        </Button>
        <p className="text-center text-base font-medium text-font">
          {t('welcomeBox.registerDescription')}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button type="button" size="pc" color="main" onClick={handleLoginClick}>
          {t('welcomeBox.login')}
        </Button>
        <p className="text-center text-base font-medium text-font">
          {t('welcomeBox.loginDescription')}
        </p>
      </div>
    </div>
  );
};

export default WelcomeBox;
