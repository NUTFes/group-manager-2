import { FC } from 'react';
import { useFormFieldCommonTexts } from '@/components/Form/hooks';

export type Option = {
  id: number;
  name: string;
};

type RadioProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  note?: string;
  error?: string;
  options: Option[];
  name?: string;
};

const Radio: FC<RadioProps> = ({
  label,
  value,
  onChange,
  required,
  note,
  error,
  options,
  name,
}) => {
  const { required: requiredLabel, translateError } = useFormFieldCommonTexts();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label>
        <div className="mb-[5px] flex items-center gap-6">
          <p className="text-base text-font">{label}</p>
          {required && <p className="text-xs text-alert">※{requiredLabel}</p>}
        </div>
        <div className="my-6 flex w-[400px] flex-col gap-4">
          {options.map((option) => (
            <label key={option.id} className="flex items-center gap-2">
              <input
                type="radio"
                name={name || label}
                value={option.id}
                checked={value === option.id.toString()}
                onChange={handleChange}
                className={`form-radio size-4 ${error ? 'accent-alert' : 'accent-main'}`}
              />
              <span className={`${error ? 'text-alert' : 'text-font'}`}>
                {option.name}
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-sub">{note}</p>
        <p className="text-xs text-alert">{translateError(error)}</p>
      </label>
    </>
  );
};

export default Radio;
