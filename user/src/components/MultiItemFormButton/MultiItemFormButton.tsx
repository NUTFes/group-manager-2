import React, { FC } from 'react';
import { Loading } from '@/icons/Icons';

type ButtonProps = {
  children: React.ReactNode;
  size: 'pc' | 'mobile';
  color: 'add' | 'delete'; // 必要な色のみに簡略化
  type: 'button';
  onClick?: () => void;
  isDisable?: boolean;
};

const colorBorderClass = {
  add: 'border-sub text-main',
  delete: 'border-alert text-alert',
} as const;

const colorBgClass = {
  add: 'bg-main',
  delete: 'bg-alert',
} as const;

function getColorClass(color: ButtonProps['color']) {
  const borderClass = colorBorderClass[color];
  // 常に白背景に色付きの枠線を使用
  return `bg-baseColor border ${borderClass}`;
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

const MultiItemFormButton: FC<ButtonProps> = (props) => {
  const { children, size, color, onClick, isDisable, type } = props;
  const iconElement = isDisable ? (
    <Loading colorClass={colorBgClass[color]} />
  ) : null;

  const baseClass = `h-[63px] rounded-[10px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.15)] justify-center items-center inline-flex overflow-hidden
  transition-transform duration-150 ease-in-out ${isDisable ? 'cursor-not-allowed' : 'active:scale-95'}`;

  return (
    <button
      className={`${baseClass} ${getSizeClass(size)} ${getColorClass(color)} flex`}
      onClick={isDisable ? () => {} : onClick}
      disabled={isDisable}
      type={type}
    >
      {iconElement && <span className="flex items-center">{iconElement}</span>}
      {isDisable ? (
        <></>
      ) : (
        <span className="font-bold text-center">{children}</span>
      )}
    </button>
  );
};

export default MultiItemFormButton;
