import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { FiPlus } from 'react-icons/fi';
import { LiaLessThanSolid } from 'react-icons/lia';
import { RxCross2 } from 'react-icons/rx';
import { SlPencil } from 'react-icons/sl';

export const Loading: FC<{ colorClass: string }> = ({ colorClass }) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex justify-center" aria-label={t('general.loading')}>
      <div className={`size-2 animate-ping ${colorClass} rounded-full`}></div>
      <div
        className={`size-2 animate-ping ${colorClass} mx-4 rounded-full`}
      ></div>
      <div className={`size-2 animate-ping ${colorClass} rounded-full`}></div>
    </div>
  );
};

const Icons: { [key: string]: JSX.Element } = {
  pencil: <SlPencil />,
  cross: <RxCross2 />,
  plus: <FiPlus />,
  lessThan: <LiaLessThanSolid />,
};

export default Icons;
