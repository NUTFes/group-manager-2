"use client";

import { useMemo, useState } from "react";
import type { FC } from "react";
import BottomSheetModal from "@/components/BottomSheetModal";
import Button from "@/components/Button";
import Selector from "@/components/Selector";
import type { AssignRentalItem, RentalGroup } from "@/types/rental";

export type ExcessLendingInput = {
  rentalItemId: number;
  stockerPlaceId: number;
  fromGroupId: number;
  quantity: number;
};

type ExcessLendingSheetProps = {
  open: boolean;
  // 選択肢の元。この作業場所の割当から物品と在庫場所を出す
  assignments: AssignRentalItem[];
  // 元の貸出先団体の候補（今この団体以外）
  groups: RentalGroup[];
  currentGroupId: number;
  onClose: () => void;
  onSubmit: (input: ExcessLendingInput) => Promise<void>;
};

// Figma: 超過貸出モーダル (node-id=5350-2584)
//
// 在庫予定を超えて渡すとき、どの団体の割当から回すかを指定する。
// 送信すると渡す団体に addition、元の団体に reduction を対で記録する。
const ExcessLendingSheet: FC<ExcessLendingSheetProps> = ({
  open,
  assignments,
  groups,
  currentGroupId,
  onClose,
  onSubmit,
}) => {
  const [itemId, setItemId] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [fromGroupId, setFromGroupId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 物品は重複を除いて出す
  const itemOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const assignment of assignments) {
      map.set(assignment.rentalItemId, assignment.rentalItemName);
    }
    return [...map.entries()].map(([id, name]) => ({
      value: String(id),
      label: name,
    }));
  }, [assignments]);

  // 在庫場所は選んだ物品に紐づくものだけに絞る
  const placeOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const assignment of assignments) {
      if (itemId && String(assignment.rentalItemId) !== itemId) continue;
      if (assignment.stockerPlaceId === null) continue;
      map.set(assignment.stockerPlaceId, assignment.stockPlaceName);
    }
    return [...map.entries()].map(([id, name]) => ({
      value: String(id),
      label: name || "未設定",
    }));
  }, [assignments, itemId]);

  const groupOptions = groups
    .filter((group) => group.id !== currentGroupId)
    .map((group) => ({ value: String(group.id), label: group.name }));

  const parsedQuantity = quantity === "" ? null : Number(quantity);
  const isQuantityInvalid =
    parsedQuantity !== null &&
    (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0);
  const canSubmit =
    itemId !== "" &&
    placeId !== "" &&
    fromGroupId !== "" &&
    parsedQuantity !== null &&
    !isQuantityInvalid;

  const handleSubmit = async () => {
    if (!canSubmit || parsedQuantity === null) return;

    setIsSending(true);
    setErrorMessage(null);
    try {
      await onSubmit({
        rentalItemId: Number(itemId),
        stockerPlaceId: Number(placeId),
        fromGroupId: Number(fromGroupId),
        quantity: parsedQuantity,
      });
      setItemId("");
      setPlaceId("");
      setFromGroupId("");
      setQuantity("");
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "超過貸出の送信に失敗しました"
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <BottomSheetModal open={open} title="超過貸出" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Selector
          label="貸出を行う物品"
          value={itemId}
          onChange={(value) => {
            setItemId(value);
            setPlaceId("");
          }}
          placeholder="選択してください"
          options={itemOptions}
        />

        <Selector
          label="在庫場所(もともとの保管場所)"
          value={placeId}
          onChange={setPlaceId}
          placeholder={itemId ? "選択してください" : "先に物品を選んでください"}
          disabled={!itemId}
          options={placeOptions}
        />

        <Selector
          label="元の貸出先団体"
          value={fromGroupId}
          onChange={setFromGroupId}
          placeholder="選択してください"
          options={groupOptions}
        />

        <div className="flex flex-col gap-1">
          <span className="text-body font-bold text-font">その数量</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            aria-label="その数量"
            className={`h-11 w-full rounded-lg border bg-white px-3 text-body text-font ${
              isQuantityInvalid ? "border-alert" : "border-main"
            }`}
          />
          <p
            className={`text-caption ${isQuantityInvalid ? "text-alert" : "text-sub"}`}
          >
            ※ 1以上の数を入力してください
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
          {isSending ? "送信中..." : "超過貸出を送信"}
        </Button>
      </div>
    </BottomSheetModal>
  );
};

export default ExcessLendingSheet;
