import { FC } from 'react';
import Button from '../Button';

type WelcomeBoxProps = {
  handleRegisterClick?: () => void;
  handleLoginClick?: () => void;
};

const WelcomeBox: FC<WelcomeBoxProps> = ({
  handleLoginClick,
  handleRegisterClick,
}) => {
  return (
    <div className="flex size-[400px] flex-col items-center justify-center gap-12  rounded-[30px] bg-secondary p-8 shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col items-center gap-2">
        <Button
          type="button"
          size="pc"
          color="main"
          onClick={handleRegisterClick}
        >
          新規登録
        </Button>
        <p className="text-center text-base font-medium text-font">
          初めての方はこちら
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button type="button" size="pc" color="main" onClick={handleLoginClick}>
          ログイン
        </Button>
        <p className="text-center text-base font-medium text-font">
          すでにアカウントをお持ちの方はこちら
        </p>
      </div>
    </div>
  );
};

export default WelcomeBox;
