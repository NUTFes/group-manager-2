import { FC } from 'react';
import { useFooterTexts } from './hooks';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const { copyright } = useFooterTexts();

  return (
    <footer className="flex h-20 w-full items-center justify-center bg-green-600 px-8 text-xs font-light text-white">
      {copyright(currentYear)}
    </footer>
  );
};

export default Footer;
