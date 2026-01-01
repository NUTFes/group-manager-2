import { FC } from 'react';
import { useTranslation } from 'next-i18next';

type Option = {
  id: number;
  name: string;
  disabled?: boolean;
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
}) => {
  const { t } = useTranslation('common');
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label>
        <div className="mb-[4px] flex items-center gap-6">
          <p className="text-base text-font">{label}</p>
          {required && (
            <p className="text-xs text-alert">※{t('form.required')}</p>
          )}
        </div>
        <select
          value={value}
          onChange={handleChange}
          className={`h-12 w-[400px] rounded-[10px] border-2 text-font ${error ? 'border-alert' : 'border-main'} mb-[4px]`}
        >
          {options.map((option) => (
            <option
              key={option.id}
              value={option.id}
              // disabled={disableOptions.includes(option.id)}
              disabled={option.disabled}
              hidden={option.disabled}
            >
              {option.name}
            </option>
          ))}
        </select>
        <p className="max-w-[400px] break-words text-xs text-sub">{note}</p>
        <p className="text-xs text-alert">
          {error ? t(error, { defaultValue: error }) : ''}
        </p>
      </label>
    </>
  );
};

export default Selector;
