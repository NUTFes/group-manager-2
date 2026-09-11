import { FC } from 'react';
import { MdUploadFile } from 'react-icons/md';
import { useUploadTexts } from './hooks';

// NOTE: 箇条書きで列挙できるようにnoteを配列で定義
type UploadProps = {
  title: string;
  note: string[];
  onClick: () => void;
  idDisable: boolean;
  error?: string;
  required?: boolean;
};

const Upload: FC<UploadProps> = ({
  title,
  note = [],
  onClick,
  idDisable,
  error = '',
  required = false,
}) => {
  const uploadTexts = useUploadTexts();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={idDisable}
      className="inline-flex w-[402px] flex-col items-start justify-start gap-1"
    >
      <div className="inline-flex items-baseline justify-start gap-6 self-stretch">
        <div className="text-base font-medium text-font">{title}</div>
        {required && (
          <div className="text-center text-xs text-alert">
            ※{uploadTexts.labels.required}
          </div>
        )}
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
          {uploadTexts.labels.upload}
        </div>
      </div>
      <ul className="list-inside list-disc text-left text-xs text-sub">
        {note.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
      <div className="max-w-[402px] break-words text-xs text-alert">
        {uploadTexts.translateError(error)}
      </div>
    </button>
  );
};

export default Upload;
