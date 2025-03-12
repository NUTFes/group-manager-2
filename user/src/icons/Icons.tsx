import { FC } from 'react';
import { FiPlus } from 'react-icons/fi';
import { LiaLessThanSolid } from 'react-icons/lia';
import { RxCross2 } from 'react-icons/rx';
import { SlPencil } from 'react-icons/sl';

export const Loading: FC<{ colorClass: string }> = ({ colorClass }) => (
  <div className="flex justify-center" aria-label="読み込み中">
    <div className={`animate-ping h-2 w-2 ${colorClass} rounded-full`}></div>
    <div
      className={`animate-ping h-2 w-2 ${colorClass} rounded-full mx-4`}
    ></div>
    <div className={`animate-ping h-2 w-2 ${colorClass} rounded-full`}></div>
  </div>
);

const Icons: { [key: string]: JSX.Element } = {
  pencil: <SlPencil />,
  cross: <RxCross2 />,
  plus: <FiPlus />,
  lessThan: <LiaLessThanSolid />,
};

export default Icons;
