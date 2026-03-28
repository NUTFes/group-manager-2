import { FC, ReactElement } from 'react';
import { FiPlus } from 'react-icons/fi';
import { LiaLessThanSolid } from 'react-icons/lia';
import { RxCross2 } from 'react-icons/rx';
import { SlPencil } from 'react-icons/sl';

export const Loading: FC<{ colorClass: string }> = ({ colorClass }) => (
  <div className="flex justify-center" aria-label="読み込み中">
    <div className={`size-2 animate-ping ${colorClass} rounded-full`}></div>
    <div
      className={`size-2 animate-ping ${colorClass} mx-4 rounded-full`}
    ></div>
    <div className={`size-2 animate-ping ${colorClass} rounded-full`}></div>
  </div>
);

const Icons: { [key: string]: ReactElement } = {
  pencil: <SlPencil />,
  cross: <RxCross2 />,
  plus: <FiPlus />,
  lessThan: <LiaLessThanSolid />,
};

export default Icons;
