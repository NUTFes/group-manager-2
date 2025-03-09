import { FC } from "react";

type TextBoxProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  note?: string;
  error?: string;
};

const TextBox: FC<TextBoxProps> = ({
  label,
  value,
  onChange,
  required,
  note,
  error,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      <label>
        <div className="flex gap-6 items-center mb-[4px]">
          <p className="text-base text-font">{label}</p>
          {required && <p className="text-xs text-alert">※必須</p>}
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={`w-[400px] text-font h-12 border-2 rounded-[10px] ${error ? "border-alert" : "border-main"}`}
        />
        <p className="text-xs text-sub max-w-[400px] break-words mt-[4px]">
          {note}
        </p>
        <p className="text-xs text-alert">{error}</p>
      </label>
    </>
  );
};

export default TextBox;
