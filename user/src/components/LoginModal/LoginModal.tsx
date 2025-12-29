import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import TextBox from '@/components/Form/TextBox';
import Button from '../Button';
import Modal from '../Modal';
import { useLoginModalHooks } from './hooks';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { handleSignInSubmit, setValue, errors, email, password, isLoggingIn } =
    useLoginModalHooks();
  const { t } = useTranslation('common');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSignInSubmit}
        className="flex flex-col items-center gap-12 rounded-[30px] bg-white px-60 py-20 shadow-2xl"
      >
        <div className="flex w-96 flex-col items-center justify-center gap-12">
          <TextBox
            label={t('loginModal.emailLabel')}
            type="email"
            value={email}
            onChange={(value) => setValue('email', value)}
            error={errors.email?.message}
            required
            note={t('loginModal.emailNote')}
          />
          <TextBox
            label={t('loginModal.passwordLabel')}
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
            {isLoggingIn ? t('loginModal.submitting') : t('loginModal.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
