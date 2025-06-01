import { FC } from 'react';

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  requireMessage?: string;
  note?: string;
  error?: string;
};

const TextArea: FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  required,
  requireMessage,
  note,
  error,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };
  const requiredMessage = requireMessage ? `※${requireMessage}` : '※必須';
  return (
    <>
      <label>
        <div className="mb-[4px] flex items-center gap-6">
          <p className="text-base text-font">{label}</p>
          {required && <p className="text-xs text-alert">{requiredMessage}</p>}
        </div>
        <textarea
          value={value}
          onChange={handleChange}
          className={`mb-[4px] block h-32 w-[400px] rounded-[10px] border-2 text-font ${error ? 'border-alert' : 'border-main'}`}
        />
        <p className="max-w-[400px] break-words text-xs text-sub">{note}</p>
        <p className="text-xs text-alert">{error}</p>
      </label>
    </>
  );
};

export default TextArea;
