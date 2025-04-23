import { FC } from 'react';

type TextBoxProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  note?: string;
  error?: string;
  type?: string;
};

const TextBox: FC<TextBoxProps> = ({
  label,
  value,
  onChange,
  onBlur,
  required,
  note,
  error,
  type,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label>
        <div className="mb-[4px] flex items-center gap-6">
          <p className="text-base text-font">{label}</p>
          {required && <p className="text-xs text-alert">※必須</p>}
        </div>
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          className={`h-12 w-[400px] rounded-[10px] border-2 p-4 text-font ${error ? 'border-alert' : 'border-main'}`}
        />
        <p className="mt-[4px] max-w-[400px] break-words text-xs text-sub">
          {note}
        </p>
        <p className="text-xs text-alert">{error}</p>
      </label>
    </>
  );
};

export default TextBox;
