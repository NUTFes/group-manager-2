"use client";

import type { FC } from "react";

type QuantityControlProps = {
  // 今回入力する数量（分子）
  value: number;
  // 貸出残 / 返却残（分母。入力の上限でもある）
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

// Figma: quantity control (node-id=5124-6792)。isZero=true は分子が0の状態
const QuantityControl: FC<QuantityControlProps> = ({
  value,
  max,
  onChange,
  disabled = false,
}) => {
  const isZero = value === 0;

  return (
    <div className="flex items-center gap-1">
      <span
        className={`tabular text-body font-bold ${isZero ? "text-sub" : "text-font"}`}
      >
        {value}/{max}
      </span>
      <div className="flex flex-col">
        <button
          type="button"
          aria-label="数量を1増やす"
          disabled={disabled || value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="px-1 text-[10px] leading-none text-main disabled:text-sub"
        >
          ▲
        </button>
        <button
          type="button"
          aria-label="数量を1減らす"
          disabled={disabled || isZero}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="px-1 text-[10px] leading-none text-main disabled:text-sub"
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default QuantityControl;
