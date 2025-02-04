import { FC } from "react";
import { MdUploadFile } from "react-icons/md";

// NOTE: 箇条書きで列挙できるようにnoteを配列で定義
type UploadProps = {
  title: string;
  note: string[];
  onClick: () => void;
};

const Upload: FC<UploadProps> = ({ title, note = [], onClick }) => {
  return (
    <div className="w-[402px] flex-col justify-start items-start gap-1 inline-flex">
      <div className="self-stretch justify-start items-baseline gap-6 inline-flex">
        <div className="text-font text-base font-medium">{title}</div>
        <div className="text-center text-alert text-xs font-light">※必須</div>
      </div>
      <div className="h-[72px] px-12 py-4 bg-baseColor rounded-[10px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] border border-main justify-center items-center gap-4 inline-flex overflow-hidden">
        <div className="flex items-center justify-center">
          <MdUploadFile className="text-main w-[40px] h-[40px]" />
        </div>
        <button
          className="text-center text-main text-[26px] font-bold"
          onClick={onClick}
        >
          アップロード
        </button>
      </div>
      <ul className="self-stretch text-font text-xs font-light list-disc list-inside">
        {note.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    </div>
  );
};

export default Upload;
