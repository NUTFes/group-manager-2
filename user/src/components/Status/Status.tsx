import { StatusTranslationKey, useStatusTexts } from './hooks';

type ValidStatus =
  | { statusType: 'reception'; status: 'open' | 'deadline' | 'closed' }
  | { statusType: 'registration'; status: 'registered' | 'unregistered' }
  | {
      statusType: 'progress';
      status: 'not_required' | 'completed' | 'pending';
    };

type StatusProps<T extends ValidStatus['statusType']> = Extract<
  ValidStatus,
  { statusType: T }
>;

type StyleDefinition = {
  backgroundColor: string;
  textColor: string;
  statusType: ValidStatus['statusType'];
};

const STATUS_STYLE_MAP: Record<ValidStatus['status'], StyleDefinition> = {
  open: {
    statusType: 'reception',
    backgroundColor: 'bg-main border-main',
    textColor: 'text-baseColor',
  },
  deadline: {
    statusType: 'reception',
    backgroundColor: 'bg-alert border-alert',
    textColor: 'text-baseColor',
  },
  closed: {
    statusType: 'reception',
    backgroundColor: 'bg-baseColor border-sub',
    textColor: 'text-sub',
  },
  registered: {
    statusType: 'registration',
    backgroundColor: 'bg-baseColor border-sub',
    textColor: 'text-sub',
  },
  unregistered: {
    statusType: 'registration',
    backgroundColor: 'bg-alert border-alert',
    textColor: 'text-baseColor',
  },
  not_required: {
    statusType: 'progress',
    backgroundColor: 'bg-baseColor border-sub',
    textColor: 'text-sub',
  },
  completed: {
    statusType: 'progress',
    backgroundColor: 'bg-main border-main',
    textColor: 'text-baseColor',
  },
  pending: {
    statusType: 'progress',
    backgroundColor: 'bg-alert border-alert',
    textColor: 'text-baseColor',
  },
} as const;

const Status = <T extends ValidStatus['statusType']>({
  statusType,
  status,
}: StatusProps<T>) => {
  const { getStatusLabel } = useStatusTexts();
  const statusInfo = STATUS_STYLE_MAP[status];

  const commonBgStyle =
    'flex items-center justify-center rounded-[15px] border-2 border-solid';
  const commonTextStyle =
    'flex items-center justify-center shrink-0 text-[16px]';

  const sizeStyles = {
    reception: { size: 'w-[100px] h-[30px]', text: 'w-[92px] h-[23px]' },
    registration: { size: 'w-[86px] h-[30px]', text: 'w-[78px] h-[22px]' },
    progress: { size: 'w-[56px] h-[30px]', text: 'w-[48px] h-[19px]' },
  } as const;

  if (statusInfo.statusType !== statusType) {
    console.warn(
      `statusType="${statusType}" と status="${status}"の組み合わせは不適切です!!`
    );
  }

  return (
    <div
      className={`${commonBgStyle} ${sizeStyles[statusType].size} ${statusInfo.backgroundColor}`}
    >
      <div
        className={`${commonTextStyle} ${sizeStyles[statusType].text} ${statusInfo.textColor}`}
      >
        {getStatusLabel(status as StatusTranslationKey)}
      </div>
    </div>
  );
};
export default Status;
