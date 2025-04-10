import { FC, useState } from 'react';
import React from 'react';
import { RiArrowDownWideLine } from 'react-icons/ri';
import { Textfit } from 'react-textfitfix';
import Status from '@/components/Status';

type AccordionMenuProps = {
  title: string;
  children: React.ReactNode;
  isEdit: boolean;
  isExist: boolean;
  required: boolean;
  note?: string;
};

const AccordionMenu: FC<AccordionMenuProps> = ({
  title,
  children,
  isEdit,
  isExist,
  required,
  note,
}) => {
  // TODO：api/app/controllers/user_page_settings_controller.rbでの登録するかどうかのbooleanを受け取る想定。
  // 要件要確認
  const receptionStatus = isEdit ? 'open' : 'closed';

  // TODO：取得のAPI叩いてdataがあるかどうかをbooleanで判断してそれを渡す想定。
  // できるならAPI側でisExist()みたいな関数を作りたい。工数多い。。。
  const registerStatus = isExist ? 'registered' : 'unregistered';

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full max-w-[560px] border-t border-[#b2b2b2]">
      <button
        onClick={toggleAccordion}
        className="mb-10 flex h-20 w-full max-w-[560px] cursor-pointer items-center gap-6 overflow-hidden"
      >
        <div className="flex items-center justify-center">
          <div
            className={`w-6 text-center text-xs font-light ${required ? 'text-[#ff6752]' : 'text-[#474747]'}`}
          >
            {required ? '必須' : '任意'}
          </div>
        </div>
        <div className="py-2.5">
          <div
            className={`w-full font-bold md:w-52 ${isEdit && isExist ? 'text-sub' : 'text-black'}`}
          >
            <Textfit mode="single" max={40}>
              {title}
            </Textfit>
          </div>
        </div>
        <Status statusType="reception" status={receptionStatus} />
        <Status statusType="registration" status={registerStatus} />
        <div
          className={`text-main transition-transform duration-300 ${isOpen ? `rotate-180` : ``}`}
        >
          <RiArrowDownWideLine size={24} className="stroke-[1]" />
        </div>
      </button>
      {isOpen && (
        <div className="mb-10">
          {note && <p className="mb-10 font-bold text-red-500">{note}</p>}
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionMenu;
