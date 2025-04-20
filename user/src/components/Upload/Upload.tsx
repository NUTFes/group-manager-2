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
      type="button"
      onClick={onClick}
      disabled={idDisable}
      className="inline-flex w-[402px] flex-col items-start justify-start gap-1"
    >
      <div className="self-stretch justify-start items-baseline gap-6 inline-flex">
        <div className="text-font text-base font-medium">{title}</div>
        <div className="text-center text-alert text-xs">※必須</div>
      </div>
      <div
        className={`inline-flex h-[72px] items-center justify-center gap-4 overflow-hidden rounded-[10px] border
        border-main bg-baseColor px-12 py-4 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] transition-transform duration-150 ease-in-out
        ${idDisable ? 'cursor-not-allowed bg-gray-300' : 'bg-baseColor hover:bg-gray-200'}
        active:scale-95`}
      >
        <div className="flex items-center justify-center">
          <MdUploadFile className="size-[40px] text-main" />
        </div>
        <div className="text-center text-[26px] font-bold text-main">
          アップロード
        </div>
      </div>
      <ul className="text-left text-font text-xs list-disc list-inside">
        {note.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
      <div className="max-w-[402px] break-words text-xs text-alert">
        {error}
      </div>
    </button>
  );
};

export default Upload;
