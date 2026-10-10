"use client";

import { useMemo, useState } from "react";
import type { FC } from "react";
import BottomSheetModal from "@/components/BottomSheetModal";
import Button from "@/components/Button";
import Selector from "@/components/Selector";
import type { WorkMode } from "@/types/rental";

export type CorrectionTarget = {
  assignRentalItemId: number;
  itemName: string;
  /** 訂正前の累計（貸出済 または 返却済） */
  currentTotal: number;
  /** 入力できる上限。貸出は実効割当数、返却は貸出済 */
  maxTotal: number;
};

type CorrectionModalProps = {
  open: boolean;
  mode: WorkMode;
  targets: CorrectionTarget[];
  onClose: () => void;
  onSubmit: (target: CorrectionTarget, correctedTotal: number) => Promise<void>;
};

// Figma: 訂正モーダル (node-id=5328-2561)
//
// 差分ではなく「訂正後の累計」を直接入力する（設計書5章の合算上書き方式）。
// 送信すると rental_absolute / return_absolute を1件記録する。
const CorrectionModal: FC<CorrectionModalProps> = ({
  open,
  mode,
  targets,
  onClose,
  onSubmit,
}) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const target = useMemo(
    () =>
      targets.find(
        (candidate) => String(candidate.assignRentalItemId) === selectedId
      ),
    [targets, selectedId]
  );

  const totalLabel =
    mode === "rental" ? "訂正後の貸出済数" : "訂正後の返却済数";
  const maxLabel = mode === "rental" ? "貸出予定数" : "貸出済数";

  const parsed = input === "" ? null : Number(input);
  const isOutOfRange =
    parsed !== null &&
    (!Number.isInteger(parsed) ||
      parsed < 0 ||
      (target ? parsed > target.maxTotal : false));
  const canSubmit = Boolean(target) && parsed !== null && !isOutOfRange;

  const handleSubmit = async () => {
    if (!target || parsed === null) return;

    setIsSending(true);
    setErrorMessage(null);
    try {
      await onSubmit(target, parsed);
      setSelectedId("");
      setInput("");
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "訂正の送信に失敗しました"
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <BottomSheetModal
      open={open}
      title="処理対象アイテムの訂正"
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <Selector
          label="訂正する物品"
          value={selectedId}
          onChange={(value) => {
            setSelectedId(value);
            setInput("");
            setErrorMessage(null);
          }}
          placeholder="選択してください"
          options={targets.map((candidate) => ({
            value: String(candidate.assignRentalItemId),
            label: candidate.itemName,
          }))}
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-body font-bold text-font">{totalLabel}</span>
            {target && (
              <span className="tabular text-caption text-sub">
                {maxLabel}: {target.maxTotal}
              </span>
            )}
          </div>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={target?.maxTotal}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={!target}
            placeholder={
              target
                ? `現在の${mode === "rental" ? "貸出済" : "返却済"}数: ${target.currentTotal}`
                : "先に物品を選んでください"
            }
            aria-label={totalLabel}
            className={`h-10 w-full rounded-lg border bg-white px-3 text-body text-font placeholder:text-sub ${
              isOutOfRange ? "border-alert" : "border-main"
            } disabled:border-sub`}
          />
          <p
            className={`text-caption ${isOutOfRange ? "text-alert" : "text-sub"}`}
          >
            ※ 0〜{maxLabel}の間で入力してください。
          </p>
        </div>

        {errorMessage && (
          <p className="text-caption text-alert">{errorMessage}</p>
        )}

        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={!canSubmit || isSending}
        >
          {isSending ? "送信中..." : "訂正内容を送信"}
        </Button>
      </div>
    </BottomSheetModal>
  );
};

export default CorrectionModal;
