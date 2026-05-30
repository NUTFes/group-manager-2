import { FC, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useFormFieldCommonTexts } from '@/components/Form/hooks';

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
  const { required: requiredLabel, translateError } = useFormFieldCommonTexts();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <label>
        <div className="mb-[4px] flex items-center gap-6">
          <p className="text-base text-font">{label}</p>
          {required && <p className="text-xs text-alert">※{requiredLabel}</p>}
        </div>
        <div className="relative">
          <input
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            className={`h-12 w-[400px] rounded-[10px] border-2 p-4 text-font ${error ? 'border-alert' : 'border-main'}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          )}
        </div>
        <p className="mt-[4px] max-w-[400px] break-words text-xs text-sub">
          {note}
        </p>
        <p className="text-xs text-alert">{translateError(error)}</p>
      </label>
    </>
  );
};

export default TextBox;
