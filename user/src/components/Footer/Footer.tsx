import { FC } from 'react';
import { useTranslation } from 'next-i18next';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation('common');

  return (
    <footer className="flex h-20 w-full items-center justify-center bg-green-600 px-8 text-xs font-light text-white">
      {t('footer.copyright', { year: currentYear })}
    </footer>
  );
};

export default Footer;
