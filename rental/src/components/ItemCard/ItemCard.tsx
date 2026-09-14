"use client";

import type { FC } from "react";
import QuantityControl from "@/components/QuantityControl";

type ItemCardProps = {
  itemName: string;
  stockPlaceName: string;
  // 今回入力する数量（分子）
  quantity: number;
  // 貸出残 / 返却残（分母。入力の上限）
  remaining: number;
  // 実行委員が事前に入れた備考（assign_rental_items.remark、表示専用）
  remark?: string | null;
  // 直近の記録に付いていたメモ（item_rental_logs.memo）
  latestMemo?: string | null;
  // 今回の送信に付けるメモ
  memo: string;
  selected: boolean;
  onSelect: () => void;
  onQuantityChange: (quantity: number) => void;
  onMemoChange: (memo: string) => void;
  // 残数が0のカードは選択できない
  disabled?: boolean;
  quantityLabel?: string;
};

// Figma: item card (node-id=5133-6834)。isEdit=false（未選択）/ true（選択）/ memo
//
// 未選択のカードは分子0で送信対象外。タップすると残数が流し込まれる（onSelect）。
const ItemCard: FC<ItemCardProps> = ({
  itemName,
  stockPlaceName,
  quantity,
  remaining,
  remark,
  latestMemo,
  memo,
  selected,
  onSelect,
  onQuantityChange,
  onMemoChange,
  disabled = false,
  quantityLabel = "数量/貸出残",
}) => (
  <section
    className={`overflow-hidden rounded-lg border bg-card ${
      selected ? "border-2 border-main" : "border-line"
    } ${disabled ? "opacity-60" : ""}`}
  >
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className="w-full bg-card-head px-3 py-3 text-left disabled:cursor-not-allowed"
    >
      <span className="text-h3 text-font">{itemName}</span>
    </button>

    <dl className="divide-y divide-line border-t border-line">
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <dt className="text-caption text-font">在庫場所</dt>
        <dd className="text-caption text-font">{quantityLabel}</dd>
      </div>
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <dt className="min-w-0 truncate text-body text-font">
          {stockPlaceName || "未設定"}
        </dt>
        <dd>
          <QuantityControl
            value={quantity}
            max={remaining}
            onChange={onQuantityChange}
            disabled={disabled || !selected}
          />
        </dd>
      </div>
      {remark && (
        <div className="flex items-start gap-2 px-3 py-2">
          <span aria-hidden>✏️</span>
          <p className="text-body text-font">{remark}</p>
        </div>
      )}
      {latestMemo && (
        <div className="px-3 py-2">
          <p className="text-caption text-sub">直近のメモ</p>
          <p className="text-body text-font">{latestMemo}</p>
        </div>
      )}
    </dl>

    <div className="border-t border-line bg-white px-3 py-2">
      <input
        type="text"
        value={memo}
        onChange={(event) => onMemoChange(event.target.value)}
        disabled={disabled || !selected}
        placeholder="メモを記入"
        aria-label={`${itemName}のメモ`}
        className="w-full bg-transparent text-body text-font placeholder:text-sub disabled:placeholder:text-line"
      />
    </div>
  </section>
);

export default ItemCard;
