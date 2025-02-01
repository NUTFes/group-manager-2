import { FC } from 'react';

type Option = {
    id: string;
    name: string;
};

type CheckboxProps = {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
    required?: boolean;
    note?: string;
    error?: string;
    options: Option[];
};

const Checkbox: FC<CheckboxProps> = ({ label, value, onChange, required, note, error, options }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value: optionValue } = event.target;
        if (checked) {
            onChange([...value, optionValue]);
        } else {
            onChange(value.filter((v) => v !== optionValue));
        }
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
                                type="checkbox"
                                name={label}
                                value={option.id}
                                checked={value.includes(option.id)}
                                onChange={handleChange}
                                className={`w-4 h-4 form-checkbox ${error ? "accent-alert" : "accent-main"}`}
                            />
                            <span>{option.name}</span>
                        </label>
                    ))}
                </div>
                <p className="text-xs text-sub">{note}</p>
                <p className="text-xs text-alert">{error}</p>
            </label>
        </>
    );
};

export default Checkbox;
