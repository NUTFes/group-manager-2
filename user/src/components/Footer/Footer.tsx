import { FC } from 'react';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex h-20 w-full items-center justify-center bg-green-600 px-8 text-xs font-light text-white">
      Copyright © {currentYear} NUTMEG. All Rights Reserved.
    </footer>
  );
};

export default Footer;
