import { FC } from 'react';
import React from 'react';
import { RiArrowDownWideLine } from 'react-icons/ri';
import { Textfit } from 'react-textfitfix';
import Status from '@/components/Status';

type AccordionMenuProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isEdit: boolean;
  isExist: boolean;
  required: boolean;
  note?: string;
  onSubmit: () => void;
};

const AccordionMenu: FC<AccordionMenuProps> = ({
  title,
  children,
  isOpen,
  onToggle,
  isEdit,
  isExist,
  required,
  note,
  onSubmit,
}) => {
  // TODO：api/app/controllers/user_page_settings_controller.rbでの登録するかどうかのbooleanを受け取る想定。
  // 要件要確認
  const receptionStatus = isEdit ? 'open' : 'closed';

  // TODO：取得のAPI叩いてdataがあるかどうかをbooleanで判断してそれを渡す想定。
  // できるならAPI側でisExist()みたいな関数を作りたい。工数多い。。。
  const registerStatus = isExist ? 'registered' : 'unregistered';

  return (
    <div className="border-t border-[#b2b2b2] w-full md:w-[560px]">
      <button
        onClick={onToggle}
        className="w-full md:w-[560px] h-20 flex items-center gap-6 overflow-hidden cursor-pointer mb-10"
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
            className={`md:w-52 w-full font-bold ${isEdit && isExist ? 'text-sub' : 'text-black'}`}
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
          {note && <p className="text-red-500 font-bold mb-10">{note}</p>}
          {React.isValidElement(children)
            ? React.cloneElement(children, { onSubmit } as any)
            : children}
        </div>
      )}
    </div>
  );
};

export default AccordionMenu;
