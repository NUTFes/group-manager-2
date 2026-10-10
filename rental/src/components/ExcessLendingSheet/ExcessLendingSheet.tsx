"use client";

import { useMemo, useState } from "react";
import type { FC } from "react";
import BottomSheetModal from "@/components/BottomSheetModal";
import Button from "@/components/Button";
import Selector from "@/components/Selector";
import {
  useAssignments,
  useRentalItems,
  useStockerPlaces,
} from "@/hooks/useRentalApi";
import { summarize } from "@/lib/aggregate";
import type { RentalGroup } from "@/types/rental";

export type ExcessLendingInput = {
  // 再送でも同じ値を使う冪等キー。入力を変えたら別の操作なので取り直す
  uid: string;
  rentalItemId: number;
  stockerPlaceId: number;
  fromGroupId: number;
  quantity: number;
};

type ExcessLendingSheetProps = {
  open: boolean;
  // 元の貸出先団体の候補（今この団体以外）。貸出場所では絞らない
  groups: RentalGroup[];
  currentGroupId: number;
  onClose: () => void;
  onSubmit: (input: ExcessLendingInput) => Promise<void>;
};

// Figma: 超過貸出モーダル (node-id=5350-2584)
//
// 在庫予定を超えて渡すとき、どの団体の割当から回すかを指定する。
// 送信すると渡す団体に addition、元の団体に reduction を対で記録する。
//
// 当日は「この倉庫の分だけ」「予定していた物品だけ」では回らないため、
// **物品・在庫場所・団体のいずれもマスタの全件から選べる**（貸出場所では絞らない）。
// 選んだ組み合わせを元の団体が持っていなければ未貸出数が0になり、その旨を出す。
//
// 数量の上限は元の団体の**未貸出数**（実効割当数 − 貸出済数）。既に渡した分は
// 手元に無いので動かせない。12個予定で3個渡した団体からは9個までしか回せない。
const ExcessLendingSheet: FC<ExcessLendingSheetProps> = ({
  open,
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
  // 送信失敗後にそのまま押し直したときは同じ uid を使い、API 側の冪等判定を効かせる。
  // 入力を変えたら中身の違う別の操作になるため、uid も取り直す（同じ uid で
  // 違う内容を送ると 409 になる）
  const [uid, setUid] = useState(() => crypto.randomUUID());
  const renewUid = () => setUid(crypto.randomUUID());

  const { data: rentalItems } = useRentalItems();
  const { data: stockerPlaces } = useStockerPlaces();

  const itemOptions = (rentalItems ?? []).map((item) => ({
    value: String(item.id),
    label: item.name,
  }));
  const placeOptions = (stockerPlaces ?? []).map((place) => ({
    value: String(place.id),
    label: place.name,
  }));
  const groupOptions = groups
    .filter((group) => group.id !== currentGroupId)
    .map((group) => ({ value: String(group.id), label: group.name }));

  // 元の団体の未貸出数を出すため、その団体の割当と記録を取る。
  // 貸出場所では絞らない（同じ物品が別の場所に割り当てられていることがある）
  const { data: fromGroupData, isLoading: isFromGroupLoading } = useAssignments(
    null,
    fromGroupId === "" ? null : Number(fromGroupId),
    fromGroupId !== ""
  );

  // 未貸出数 = Σ（実効割当数 − 貸出済数）。物品と在庫場所が一致する割当だけを見る。
  // 元の団体がその組み合わせを持っていなければ0になる
  const available = useMemo(() => {
    if (!fromGroupData || itemId === "" || placeId === "") return null;

    const matched = fromGroupData.assignRentalItems.filter(
      (assignment) =>
        assignment.rentalItemId === Number(itemId) &&
        assignment.stockerPlaceId === Number(placeId)
    );

    return matched.reduce(
      (sum, assignment) =>
        sum +
        summarize(assignment, fromGroupData.assignmentChangeLogs, "rental")
          .lentRemaining,
      0
    );
  }, [fromGroupData, itemId, placeId]);

  const parsedQuantity = quantity === "" ? null : Number(quantity);
  const isQuantityInvalid =
    parsedQuantity !== null &&
    (!Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0 ||
      (available !== null && parsedQuantity > available));
  const canSubmit =
    itemId !== "" &&
    placeId !== "" &&
    fromGroupId !== "" &&
    available !== null &&
    available > 0 &&
    parsedQuantity !== null &&
    !isQuantityInvalid;

  // 上限の根拠が分かるようにメッセージを出し分ける
  const quantityHint = (() => {
    if (itemId === "" || placeId === "")
      return "※ 先に物品と在庫場所を選んでください";
    if (fromGroupId === "") return "※ 先に元の貸出先団体を選んでください";
    if (isFromGroupLoading) return "元の団体の未貸出数を確認しています...";
    if (available === null) return "※ 元の団体の未貸出数を取得できませんでした";
    if (available === 0)
      return "※ この団体はこの物品(この在庫場所)の未貸出分を持っていません。別の団体を選んでください";
    return `※ 1〜${available}（元の団体の未貸出数）の範囲で入力してください`;
  })();

  const handleSubmit = async () => {
    if (!canSubmit || parsedQuantity === null) return;

    setIsSending(true);
    setErrorMessage(null);
    try {
      await onSubmit({
        uid,
        rentalItemId: Number(itemId),
        stockerPlaceId: Number(placeId),
        fromGroupId: Number(fromGroupId),
        quantity: parsedQuantity,
      });
      setItemId("");
      setPlaceId("");
      setFromGroupId("");
      setQuantity("");
      renewUid();
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
            setQuantity("");
            renewUid();
          }}
          placeholder="選択してください"
          options={itemOptions}
        />

        <Selector
          label="在庫場所(もともとの保管場所)"
          value={placeId}
          onChange={(value) => {
            setPlaceId(value);
            setQuantity("");
            renewUid();
          }}
          placeholder="選択してください"
          options={placeOptions}
        />

        <Selector
          label="元の貸出先団体"
          value={fromGroupId}
          onChange={(value) => {
            setFromGroupId(value);
            // 団体が変われば上限も変わるため入れ直してもらう
            setQuantity("");
            renewUid();
          }}
          placeholder="選択してください"
          options={groupOptions}
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-end justify-between gap-2">
            <span className="text-body font-bold text-font">その数量</span>
            {available !== null && (
              <span className="tabular text-caption text-sub">
                元の団体の未貸出数: {available}
              </span>
            )}
          </div>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={available ?? undefined}
            value={quantity}
            onChange={(event) => {
              setQuantity(event.target.value);
              renewUid();
            }}
            disabled={available === null || available === 0}
            aria-label="その数量"
            className={`h-11 w-full rounded-lg border bg-white px-3 text-body text-font disabled:border-sub disabled:bg-transparent ${
              isQuantityInvalid ? "border-alert" : "border-main"
            }`}
          />
          <p
            className={`text-caption ${isQuantityInvalid ? "text-alert" : "text-sub"}`}
          >
            {quantityHint}
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
