import { FC } from 'react';
import { MdUploadFile } from 'react-icons/md';

// NOTE: 箇条書きで列挙できるようにnoteを配列で定義
type UploadProps = {
  title: string;
  note: string[];
  onClick: () => void;
  idDisable: boolean;
  error?: string;
};

const Upload: FC<UploadProps> = ({
  title,
  note = [],
  onClick,
  idDisable,
  error = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={idDisable}
      className="w-[402px] flex-col justify-start items-start gap-1 inline-flex"
    >
      <div className="self-stretch justify-start items-baseline gap-6 inline-flex">
        <div className="text-font text-base font-medium">{title}</div>
        <div className="text-center text-alert text-xs font-light">※必須</div>
      </div>
      <div
        className={`h-[72px] px-12 py-4 bg-baseColor rounded-[10px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] border border-main
        justify-center items-center gap-4 inline-flex overflow-hidden transition-transform duration-150 ease-in-out
        ${idDisable ? 'bg-gray-300 cursor-not-allowed' : 'bg-base hover:bg-gray-200'}
        active:scale-95`}
      >
        <div className="flex items-center justify-center">
          <MdUploadFile className="text-main w-[40px] h-[40px]" />
        </div>
        <div className="text-center text-main text-[26px] font-bold">
          アップロード
        </div>
      </div>
      <ul className="text-left text-font text-xs font-light list-disc list-inside">
        {note.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
      <div className="text-xs text-alert max-w-[402px] break-words">
        {error}
      </div>
    </button>
  );
};

export default Upload;
