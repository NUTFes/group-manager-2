import { FC } from 'react';
import TextBox from '@/components/Form/TextBox';
import Button from '../Button';
import Modal from '../Modal';
import { useLoginModalHooks } from './hooks';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { handleLogin, setValue, handleSubmit, errors, email, password } =
    useLoginModalHooks();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col items-center gap-12 rounded-[30px] bg-white px-60 py-20 shadow-2xl"
      >
        <div className="flex w-96 flex-col items-center justify-center gap-12">
          <TextBox
            label="メールアドレス"
            value={email}
            onChange={(value) => setValue('email', value)}
            error={errors.email?.message}
            required
            note="例：s123456@stn.nagaokaut.ac.jp"
          />
          <TextBox
            label="パスワード"
            value={password}
            onChange={(value) => setValue('password', value)}
            error={errors.password?.message}
            required
          />
          <Button size="pc" color="main" variant type="submit">
            ログイン
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
