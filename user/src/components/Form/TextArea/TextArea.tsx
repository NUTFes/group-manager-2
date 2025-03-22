import { FC } from 'react';

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  note?: string;
  error?: string;
};

const TextArea: FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  required,
  note,
  error,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label>
        <div className="flex gap-6 items-center mb-[4px]">
          <p className="text-base text-font">{label}</p>
          {required && <p className="text-xs text-alert">※必須</p>}
        </div>
        <textarea
          value={value}
          onChange={handleChange}
          className={`w-[400px] h-32 text-font border-2 rounded-[10px] block mb-[4px] ${error ? 'border-alert' : 'border-main'}`}
        />
        <p className="text-xs text-sub max-w-[400px] break-words">{note}</p>
        <p className="text-xs text-alert">{error}</p>
      </label>
    </>
  );
};

export default TextArea;
