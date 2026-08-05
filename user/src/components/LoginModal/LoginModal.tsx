import { FC } from 'react';
import TextBox from '@/components/Form/TextBox';
import Button from '../Button';
import Modal from '../Modal';
import { useLoginModalHooks, useLoginModalTexts } from './hooks';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { handleSignInSubmit, setValue, errors, email, password, isLoggingIn } =
    useLoginModalHooks();
  const loginModalTexts = useLoginModalTexts();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSignInSubmit}
        className="flex flex-col items-center gap-12 rounded-[30px] bg-white px-8 py-10 shadow-2xl md:px-60 md:py-20"
      >
        <div className="flex w-full max-w-96 flex-col items-center justify-center gap-12">
          <TextBox
            label={loginModalTexts.labels.email}
            type="email"
            value={email}
            onChange={(value) => setValue('email', value)}
            error={errors.email?.message}
            required
            note={loginModalTexts.notes.email}
          />
          <TextBox
            label={loginModalTexts.labels.password}
            type="password"
            value={password}
            onChange={(value) => setValue('password', value)}
            error={errors.password?.message}
            required
          />
          <Button
            size="pc"
            color="main"
            variant
            type="submit"
            isDisable={isLoggingIn}
          >
            {isLoggingIn
              ? loginModalTexts.buttons.submitting
              : loginModalTexts.buttons.submit}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
