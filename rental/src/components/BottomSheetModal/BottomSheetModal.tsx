"use client";

import { useEffect } from "react";
import type { FC, ReactNode } from "react";

type BottomSheetModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

// Figma: 参加団体選択モーダル (node-id=5101-6756) / 訂正モーダル (node-id=5328-2561)
// 下から出るパネル。片手で閉じられるよう閉じるボタンは右上に置く。
const BottomSheetModal: FC<BottomSheetModalProps> = ({
  open,
  title,
  onClose,
  children,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="閉じる"
        onClick={onClose}
        className="flex-1 bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white px-5 pb-8 pt-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-h3 text-font">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="text-h3 leading-none text-font"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BottomSheetModal;
