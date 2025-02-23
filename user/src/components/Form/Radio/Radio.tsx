import { FC } from 'react';

type Option = {
  id: string;
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
};

const Radio: FC<RadioProps> = ({
  label,
  value,
  onChange,
  required,
  note,
  error,
  options,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label>
        <div className="flex gap-6 items-center mb-[5px]">
          <p className="text-base">{label}</p>
          {required && <p className="text-xs text-alert">※必須</p>}
        </div>
        <div className="flex flex-col gap-4 my-6">
          {options.map((option) => (
            <label key={option.id} className="flex items-center gap-2">
              <input
                type="radio"
                name={label}
                value={option.id}
                checked={value === option.id}
                onChange={handleChange}
                className={`w-4 h-4 form-radio ${error ? 'accent-alert' : 'accent-main'}`}
              />
              <span className={`${error ? 'text-alert' : ''}`}>
                {option.name}
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-sub">{note}</p>
        <p className="text-xs text-alert">{error}</p>
      </label>
    </>
  );
};

export default Radio;
