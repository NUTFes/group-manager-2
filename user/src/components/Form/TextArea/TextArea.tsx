import { FC } from 'react';
import { useFormFieldCommonTexts } from '@/components/Form/hooks';

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  requireMessage?: string;
  note?: string;
  error?: string;
};

const TextArea: FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  requireMessage,
  note,
  error,
}) => {
  const { required: requiredLabel, translateError } = useFormFieldCommonTexts();
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };
  const requiredMessage = requireMessage ?? requiredLabel;
  return (
    <>
      <label>
        <div className="mb-[4px] flex items-center gap-6">
          <p className="text-base text-font">{label}</p>
          {required && <p className="text-xs text-alert">※{requiredMessage}</p>}
        </div>
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`mb-[4px] block h-32 w-[400px] rounded-[10px] border-2 text-font scrollbar-hide ${error ? 'border-alert' : 'border-main'}`}
        />
        <p className="max-w-[400px] whitespace-pre-wrap break-words text-xs text-sub">
          {note}
        </p>
        <p className="text-xs text-alert">{translateError(error)}</p>
      </label>
    </>
  );
};

export default TextArea;
