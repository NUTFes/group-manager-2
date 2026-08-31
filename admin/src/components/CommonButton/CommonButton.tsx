import { FC, ReactNode } from 'react';

export type CommonButtonProps = {
  children: ReactNode;
  iconName?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const CommonButton: FC<CommonButtonProps> = ({
  children,
  iconName,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative z-0 flex items-center justify-center gap-2.5 rounded-lg px-8 py-2.5 text-sm tracking-wider text-white shadow-md transition-all duration-200 hover:shadow-lg active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #34a854 0%, #98bf00 100%)',
      }}
    >
      {iconName && <span className="material-icons text-base">{iconName}</span>}
      {children}
    </button>
  );
};

export default CommonButton;
