import React, { FC, useState } from 'react';
import { HealthCenterSubmissionStatus } from '@/api/healthCenterSubmissionStatusApi';
import { RiArrowDownWideLine } from 'react-icons/ri';
import { Textfit } from 'react-textfitfix';
import Status from '@/components/Status';
import { useAccordionMenuTexts } from './hooks';

type AccordionMenuProps = {
  title: string;
  children: React.ReactNode;
  isEdit: boolean | undefined;
  isExist: boolean | undefined;
  isRegistered?: boolean;
  required: boolean;
  note?: string;
  status?: HealthCenterSubmissionStatus;
};

const AccordionMenu: FC<AccordionMenuProps> = ({
  title,
  children,
  isEdit,
  isExist,
  isRegistered,
  required,
  note,
  status,
}) => {
  const { labels } = useAccordionMenuTexts();
  const receptionStatus =
    isEdit || status === 'waiting_resubmission' ? 'open' : 'closed';

  const registerStatus =
    status === 'waiting_resubmission'
      ? 'resubmission'
      : isRegistered === undefined
        ? isExist
          ? 'registered'
          : 'unregistered'
        : isRegistered
          ? 'registered'
          : 'unregistered';

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full max-w-[720px] border-t border-[#b2b2b2]">
      <button
        onClick={toggleAccordion}
        className="mb-10 grid min-h-20 w-full max-w-[720px] grid-cols-[auto,minmax(0,1fr),auto,auto,auto] items-center gap-x-6 gap-y-1 py-4"
      >
        <div className="flex items-center justify-center self-stretch">
          <div
            className={`whitespace-nowrap text-center text-xs font-light ${required ? 'text-[#ff6752]' : 'text-[#474747]'}`}
          >
            {required ? labels.required : labels.optional}
          </div>
        </div>
        <div className="min-w-0 py-2.5">
          <div
            className={`w-full min-w-0 font-bold ${isEdit === false ? 'text-sub' : 'text-black'}`}
          >
            <Textfit
              mode="single"
              max={40}
              className="min-w-0 [&>div]:max-h-[2.75em] [&>div]:overflow-hidden [&>div]:!whitespace-normal [&>div]:break-words [&>div]:leading-snug"
            >
              {title}
            </Textfit>
          </div>
        </div>
        <Status statusType="reception" status={receptionStatus} />
        <div className="shrink-0 [&>div>div]:!w-auto [&>div>div]:whitespace-nowrap [&>div]:!w-auto [&>div]:min-w-[86px] [&>div]:!px-3">
          <Status statusType="registration" status={registerStatus} />
        </div>
        <div
          className={`text-main transition-transform duration-300 ${isOpen ? `rotate-180` : ``}`}
        >
          <RiArrowDownWideLine size={24} className="stroke-[1]" />
        </div>
      </button>
      {isOpen && (
        <div className="mb-10 flex-col justify-center">
          {note && <p className="mb-10 font-bold text-red-500">{note}</p>}
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionMenu;
