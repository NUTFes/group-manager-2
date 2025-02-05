type ValidStatus =
  | { statusType: "A"; status: "reception" | "approaching" | "closed" }
  | { statusType: "B"; status: "registered" | "unregistered" }
  | { statusType: "C"; status: "unnecessary" | "done" | "not_yet" };

  type StatusProps<T extends ValidStatus["statusType"]> = Extract<ValidStatus, { statusType: T }>;

type StyleDefinition = {
    statusText: string;
    backgroundColor: string;
    textColor: string;
    statusType: ValidStatus['statusType']; // typeを追加
  };

const STATUS_MAP: Record<ValidStatus["status"], StyleDefinition> = {
    reception: {
        statusType: "A",
        statusText: "受付中",
        backgroundColor: "bg-[--main-color] border-[--main-color]",
        textColor: "text-[--base-color]",
    },
    approaching: {
        statusType: "A",
        statusText: "締切間近",
        backgroundColor: "bg-[--alert-color] border-[--alert-color]",
        textColor: "text-[--base-color]",
    },
    closed: {
        statusType: "A",
        statusText: "受付終了",
        backgroundColor: "bg-[--base-color] border-[--sub-color]",
        textColor: "text-[--sub-color]",
    },
    registered: {
        statusType: "B",
        statusText: "登録済",
        backgroundColor: "bg-[--base-color] border-[--sub-color]",
        textColor: "text-[--sub-color]",
    },
    unregistered: {
        statusType: "B",
        statusText: "未登録",
        backgroundColor: "bg-[--alert-color] border-[--alert-color]",
        textColor: "text-[--base-color]",
    },
    unnecessary: {
        statusType: "C",
        statusText: "不要",
        backgroundColor: "bg-[--base-color] border-[--sub-color]",
        textColor: "text-[--sub-color]",
    },
    done: {
        statusType: "C",
        statusText: "済",
        backgroundColor: "bg-[--main-color] border-[--main-color]",
        textColor: "text-[--base-color]",
    },
    not_yet: {
        statusType: "C",
        statusText: "末",
        backgroundColor: "bg-[--alert-color] border-[--alert-color]",
        textColor: "text-[--base-color]",
    },
    } as const;

    const Status = <T extends ValidStatus["statusType"]>({statusType, status }: StatusProps<T>) => {
        const statusInfo = STATUS_MAP[status];
      
        const commonBgStyle =
          "flex items-center justify-center rounded-[15px] border-2 border-solid";
        const commonTextStyle =
          "flex items-center justify-center shrink-0 text-[16px]";
      
        const sizeStyles = {
          A: { bg: "w-[100px] h-[30px]", text: "w-[92px] h-[23px]" },
          B: { bg: "w-[86px] h-[30px]", text: "w-[78px] h-[22px]" },
          C: { bg: "w-[56px] h-[30px]", text: "w-[48px] h-[19px]" },
        } as const;

          // 🚨 実行時にエラーをスローする
          
        if (statusInfo.statusType !== statusType) {
            throw new Error(
                `statusType="${statusType}" と status="${status}"の組み合わせは不適切です!!`
            );
        }
      
        return (
          <div className={`${commonBgStyle} ${sizeStyles[statusType].bg} ${statusInfo.backgroundColor}`} >
            <div
              className={`${commonTextStyle} ${sizeStyles[statusType].text} ${statusInfo.textColor}`}
            >
              {statusInfo.statusText}
            </div>
          </div>
        );
      };
export default Status;