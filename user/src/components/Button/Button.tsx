import React, { FC } from 'react';
import Icons, { Loading } from '@/icons/Icons';

type ButtonProps = {
  children: React.ReactNode;
  size: 'pc' | 'mobile';
  color: 'main' | 'secondary' | 'alert';
  type: 'button' | 'submit' | 'reset';
  variant?: boolean;
  icon?: string;
  onClick?: () => void;
  isDisable?: boolean;
};

const colorBorderClass = {
  main: 'border-main text-main',
  secondary: 'border-secondary text-secondary',
  alert: 'border-alert text-alert',
} as const;

const colorBgClass = {
  main: 'bg-main',
  secondary: 'bg-secondary',
  alert: 'bg-alert',
} as const;

function getColorClass(color: ButtonProps['color'], variant?: boolean) {
  const borderClass = colorBorderClass[color];
  const bgClass = colorBgClass[color];

  if (!borderClass || !bgClass) return '';

  return variant
    ? `bg-base border border-2 ${borderClass}`
    : `${bgClass} text-baseColor`;
}

function getSizeClass(size: ButtonProps['size']) {
  switch (size) {
    case 'pc':
      return 'text-2xl py-4 px-12';
    case 'mobile':
    default:
      return 'text-lg py-2 px-8';
  }
}

function getIconSpacingClass(size: ButtonProps['size']) {
  return size === 'pc' ? 'gap-4' : 'gap-2';
}

const Button: FC<ButtonProps> = (props) => {
  const { children, size, color, variant, icon, onClick, isDisable, type } =
    props;
  const variantColorClass = variant ? colorBgClass[color] : 'bg-baseColor';
  const iconElement = isDisable ? (
    <Loading colorClass={variantColorClass} />
  ) : icon ? (
    Icons[icon]
  ) : null;

  const baseClass = `h-[63px] rounded-[10px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] justify-center items-center inline-flex overflow-hidden
  transition-transform duration-150 ease-in-out ${isDisable ? 'cursor-not-allowed' : 'active:scale-95'}`;

  return (
    <button
      className={`${baseClass} ${getSizeClass(size)} ${getColorClass(color, variant)} ${iconElement ? getIconSpacingClass(size) : ''} flex`}
      onClick={isDisable ? () => {} : onClick}
      disabled={isDisable}
      type={type}
    >
      {iconElement && (
        <span
          className={`flex items-center ${icon === 'lessThan' ? 'text-sm' : ''} `}
        >
          {iconElement}
        </span>
      )}
      {isDisable ? (
        <></>
      ) : (
        <span className="text-center font-bold">{children}</span>
      )}
    </button>
  );
};

export default Button;
