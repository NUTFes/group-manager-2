import { FC } from "react";
import CorporateIcon from "../../../public/corporate_logo.svg";
import ProfileIcon from "../../../public/profile_icon.svg";

type HeaderProps = {
  onClick: () => void;
};

const Header: FC<HeaderProps> = ({ onClick }) => {
  return (
    <div className="w-full h-20 bg-main flex justify-between items-center px-8">
      <CorporateIcon height="60" />
      <button onClick={onClick}>
        <ProfileIcon height="56" />
      </button>
    </div>
  );
};

export default Header;
