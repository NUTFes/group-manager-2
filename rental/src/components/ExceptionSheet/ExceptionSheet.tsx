"use client";

import type { FC } from "react";
import BottomSheetModal from "@/components/BottomSheetModal";

type ExceptionSheetProps = {
  open: boolean;
  onClose: () => void;
  onSelectCorrection: () => void;
  onSelectExcessLending: () => void;
};

// Figma: 選択モーダル (node-id=5350-217)「例外対応」
// 訂正（入力済みの修正）と超過貸出（在庫予定を超える貸出）の入口。
const ExceptionSheet: FC<ExceptionSheetProps> = ({
  open,
  onClose,
  onSelectCorrection,
  onSelectExcessLending,
}) => (
  <BottomSheetModal open={open} title="例外対応" onClose={onClose}>
    <p className="mb-3 text-body text-font">対応する内容を選択してください</p>
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onSelectCorrection}
        className="rounded-lg border border-main bg-white px-4 py-3 text-left"
      >
        <span className="block text-body font-bold text-main">訂正</span>
        <span className="block text-caption text-font">
          入力済みの内容を修正します
        </span>
      </button>
      <button
        type="button"
        onClick={onSelectExcessLending}
        className="rounded-lg border border-main bg-white px-4 py-3 text-left"
      >
        <span className="block text-body font-bold text-main">超過貸出</span>
        <span className="block text-caption text-font">
          在庫予定を超えて貸し出します
        </span>
      </button>
    </div>
  </BottomSheetModal>
);

export default ExceptionSheet;
