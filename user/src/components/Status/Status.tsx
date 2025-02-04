import { FC } from 'react';

type ValidStatus =
  | { type: "A"; status: "reception" | "approaching" | "closed" }
  | { type: "B"; status: "registered" | "unregistered" }
  | { type: "C"; status: "unnecessary" | "done" | "not_yet" };

type StatusProps = {
    statusType: ValidStatus['type'];
    status: Extract<ValidStatus, { type: ValidStatus['type'] }>['status'];
  };

type StyleDefinition = {
    statusText: string;
    backgroundColor: string;
    textColor: string;
    type: ValidStatus['type']; // typeを追加
  };

const STATUS_MAP: Record<string, StyleDefinition> = {
    reception: {
        type: "A",
        statusText: "受付中",
        backgroundColor: "bg-[--main-color] border-[--main-color]",
        textColor: "text-[--base-color]",
    },
    approaching: {
        type: "A",
        statusText: "締切間近",
        backgroundColor: "bg-[--alert-color] border-[--alert-color]",
        textColor: "text-[--base-color]",
    },
    closed: {
        type: "A",
        statusText: "受付終了",
        backgroundColor: "bg-[--base-color] border-[--sub-color]",
        textColor: "text-[--sub-color]",
    },
    registered: {
        type: "B",
        statusText: "登録済",
        backgroundColor: "bg-[--base-color] border-[--sub-color]",
        textColor: "text-[--sub-color]",
    },
    unregistered: {
        type: "B",
        statusText: "未登録",
        backgroundColor: "bg-[--alert-color] border-[--alert-color]",
        textColor: "text-[--base-color]",
    },
    unnecessary: {
        type: "C",
        statusText: "不要",
        backgroundColor: "bg-[--base-color] border-[--sub-color]",
        textColor: "text-[--sub-color]",
    },
    done: {
        type: "C",
        statusText: "済",
        backgroundColor: "bg-[--main-color] border-[--main-color]",
        textColor: "text-[--base-color]",
    },
    not_yet: {
        type: "C",
        statusText: "末",
        backgroundColor: "bg-[--alert-color] border-[--alert-color]",
        textColor: "text-[--base-color]",
    },
    } as const;


    const Status = ({ statusType, status }: StatusProps) => {
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