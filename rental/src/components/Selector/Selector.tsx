"use client";

import type { ChangeEvent, FC } from "react";

export type SelectorOption = {
  value: string;
  label: string;
};

type SelectorProps = {
  label?: string;
  required?: boolean;
  value: string;
  options: SelectorOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  // 進捗確認の絞り込みで使う小さい見た目（Figma: セレクター(Mobile)・コンパクト）
  compact?: boolean;
  disabled?: boolean;
};

// Figma: セレクター(Mobile) (node-id=5159-2668) / コンパクト (node-id=5159-2687)
const Selector: FC<SelectorProps> = ({
  label,
  required = false,
  value,
  options,
  onChange,
  placeholder,
  compact = false,
  disabled = false,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) =>
    onChange(event.target.value);

  return (
    <label className="flex flex-col gap-1">
      {label && (
        <span className="flex items-baseline gap-2">
          <span className="text-body font-bold text-font">{label}</span>
          {required && <span className="text-caption text-alert">※必須</span>}
        </span>
      )}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full rounded-lg border border-main bg-white text-font disabled:border-sub disabled:text-sub ${
          compact ? "h-8 px-2 text-caption" : "h-10 px-3 text-body"
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Selector;
