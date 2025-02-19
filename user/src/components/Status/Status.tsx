type ValidStatus =
  | { statusType: "reception"; status: "open" | "deadline" | "closed" }
  | { statusType: "registration"; status: "registered" | "unregistered" }
  | { statusType: "progress"; status: "not_required" | "completed" | "pending" };

  type StatusProps<T extends ValidStatus["statusType"]> = Extract<ValidStatus, { statusType: T }>;

type StyleDefinition = {
    statusText: string;
    backgroundColor: string;
    textColor: string;
    statusType: ValidStatus['statusType']; 
  };

const STATUS_MAP: Record<ValidStatus["status"], StyleDefinition> = {
    open: {
        statusType: "reception",
        statusText: "受付中",
        backgroundColor: "bg-main border-main",
        textColor: "text-baseColor",
    },
    deadline: {
        statusType: "reception",
        statusText: "締切間近",
        backgroundColor: "bg-alert border-alert",
        textColor: "text-baseColor",
    },
    closed: {
        statusType: "reception",
        statusText: "受付終了",
        backgroundColor: "bg-baseColor border-sub",
        textColor: "text-sub",
    },
    registered: {
        statusType: "registration",
        statusText: "登録済",
        backgroundColor: "bg-baseColor border-sub",
        textColor: "text-sub",
    },
    unregistered: {
        statusType: "registration",
        statusText: "未登録",
        backgroundColor: "bg-alert border-alert",
        textColor: "text-baseColor",
    },
    not_required: {
        statusType: "progress",
        statusText: "不要",
        backgroundColor: "bg-baseColor border-sub",
        textColor: "text-sub",
    },
    completed: {
        statusType: "progress",
        statusText: "済",
        backgroundColor: "bg-main border-main",
        textColor: "text-baseColor",
    },
    pending: {
        statusType: "progress",
        statusText: "末",
        backgroundColor: "bg-alert border-alert",
        textColor: "text-baseColor",
    },
    } as const;

    const Status = <T extends ValidStatus["statusType"]>({statusType, status }: StatusProps<T>) => {
        const statusInfo = STATUS_MAP[status];
      
        const commonBgStyle =
          "flex items-center justify-center rounded-[15px] border-2 border-solid";
        const commonTextStyle =
          "flex items-center justify-center shrink-0 text-[16px]";
      
        const sizeStyles = {
          reception: { size: "w-[100px] h-[30px]", text: "w-[92px] h-[23px]" },
          registration: { size: "w-[86px] h-[30px]", text: "w-[78px] h-[22px]" },
          progress: { size: "w-[56px] h-[30px]", text: "w-[48px] h-[19px]" },
        } as const;

        //   // 不適切な実行時にエラーをスローする
          
        // if (statusInfo.statusType !== statusType) {
        //     throw new Error(
        //         `statusType="${statusType}" と status="${status}"の組み合わせは不適切です!!`
        //     );
        // }
      
        return (
          <div className={`${commonBgStyle} ${sizeStyles[statusType].size} ${statusInfo.backgroundColor}`} >
            <div
              className={`${commonTextStyle} ${sizeStyles[statusType].text} ${statusInfo.textColor}`}
            >
              {statusInfo.statusText}
            </div>
          </div>
        );
      };
export default Status;
