import { FC } from 'react';
import { RiArrowDownWideLine } from 'react-icons/ri';
import Status from '@/components/Status';

type AccordionMenuProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isEdit: boolean;
  isExit: boolean;
  required: boolean;
};

const AccordionMenu: FC<AccordionMenuProps> = ({
  title,
  children,
  isOpen,
  onToggle,
  isEdit,
  isExit,
  required,
}) => {
  // TODO：api/app/controllers/user_page_settings_controller.rbでの登録するかどうかのbooleanを受け取る想定。
  // 要件要確認
  const receptionStatus = isEdit ? 'open' : 'closed';

  // TODO：取得のAPI叩いてdataがあるかどうかをbooleanで判断してそれを渡す想定。
  const registerStatus = isExit ? 'registered' : 'unregistered';

  return (
    <div className="border-t border-[#b2b2b2]">
      <button
        onClick={onToggle}
        className="w-full h-20 flex items-center gap-6 overflow-hidden cursor-pointer"
      >
        <div className="w-[25px] h-[17px] flex items-center justify-center">
          <div
            className={`text-center text-xs font-black ${required ? 'text-[#ff6752]' : 'text-[#474747]'}`}
          >
            {required ? '必須' : '任意'}
          </div>
        </div>
        <div className="flex items-center py-2.5">
          <div className="text-[#b2b2b2] text-[32px] font-bold">{title}</div>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <Status statusType="reception" status={receptionStatus} />
          <Status statusType="registration" status={registerStatus} />
          <div className="text-main">
            <RiArrowDownWideLine size={24} className="stroke-[1]" />
          </div>
        </div>
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

export default AccordionMenu;
