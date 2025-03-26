import { FC } from 'react';

type Option = {
  id: number;
  name: string;
};

type SelectorProps = {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  required?: boolean;
  note?: string;
  error?: string;
  options: Option[];
  disableOptions?: number[];
};

const Selector: FC<SelectorProps> = ({
  label,
  value,
  onChange,
  required,
  note,
  error,
  options = [],
  disableOptions = [],
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label>
        <div className="flex gap-6 items-center mb-[4px]">
          <p className="text-base text-font">{label}</p>
          {required && <p className="text-xs text-alert">※必須</p>}
        </div>
        <select
          value={value}
          onChange={handleChange}
          className={`w-[400px] h-12 text-font border-2 rounded-[10px] ${error ? 'border-alert' : 'border-main'} mb-[4px]`}
        >
          {options.map((option) => (
            <option
              key={option.id}
              value={option.id}
              disabled={disableOptions.includes(option.id)}
            >
              {option.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-sub max-w-[400px] break-words">{note}</p>
        <p className="text-xs text-alert">{error}</p>
      </label>
    </>
  );
};

export default Selector;
