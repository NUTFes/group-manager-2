"use client";

import type { ChangeEvent, FC } from "react";

type QuantityControlProps = {
  // 今回入力する数量（分子）
  value: number;
  // 貸出残 / 返却残（分母。入力の上限）
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

const clamp = (value: number, max: number) =>
  Math.min(max, Math.max(0, Math.trunc(value)));

/**
 * 数量の入力。数値を直接入力でき、＋－で微調整もできる。
 *
 * Figma のカードは `13/13 ⇅` の上下ボタンのみだが、13個渡すのに13回タップする
 * ことになり当日の運用に耐えないため、Figma の「数量入力フィールド」
 * （node-id=5360-2600）と同じ直接入力を取り入れ、＋－はタップ領域44pxにした。
 */
const QuantityControl: FC<QuantityControlProps> = ({
  value,
  max,
  onChange,
  disabled = false,
}) => {
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    onChange(Number.isFinite(next) ? clamp(next, max) : 0);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="数量を1減らす"
        disabled={disabled || value <= 0}
        onClick={() => onChange(clamp(value - 1, max))}
        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-main text-h3 leading-none text-main disabled:border-sub disabled:text-sub"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        onChange={handleInput}
        disabled={disabled}
        aria-label="今回の数量"
        className="tabular h-11 w-14 rounded-lg border border-main bg-white text-center text-body font-bold text-font disabled:border-sub disabled:bg-transparent disabled:text-sub"
      />
      <span className="tabular shrink-0 text-body text-font">/{max}</span>
      <button
        type="button"
        aria-label="数量を1増やす"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1, max))}
        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-main text-h3 leading-none text-main disabled:border-sub disabled:text-sub"
      >
        ＋
      </button>
    </div>
  );
};

export default QuantityControl;
