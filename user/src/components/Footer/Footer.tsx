import { FC } from "react";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full h-20 bg-green-600 flex justify-center items-center px-8 text-xs font-light text-white">
      Copyright © {currentYear} NUTMEG. All Rights Reserved.
    </footer>
  );
};

export default Footer;
