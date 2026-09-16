"use client";

import { useMemo, useState } from "react";
import type { FC } from "react";
import BottomSheetModal from "@/components/BottomSheetModal";
import Button from "@/components/Button";
import Selector from "@/components/Selector";
import { useAssignments } from "@/hooks/useRentalApi";
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
// 当日は「この倉庫の分だけ」では回らないため、**貸出場所では絞らない**。
// 元の団体を先に選び、その団体が持つ割当（全場所）から物品と在庫場所を出す。
// こうすると提供元に実在する組み合わせだけが候補になり、上限も必ず出せる。
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
  const [fromGroupId, setFromGroupId] = useState("");
  const [itemId, setItemId] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // 送信失敗後にそのまま押し直したときは同じ uid を使い、API 側の冪等判定を効かせる。
  // 入力を変えたら中身の違う別の操作になるため、uid も取り直す（同じ uid で
  // 違う内容を送ると 409 になる）
  const [uid, setUid] = useState(() => crypto.randomUUID());
  const renewUid = () => setUid(crypto.randomUUID());

  const groupOptions = groups
    .filter((group) => group.id !== currentGroupId)
    .map((group) => ({ value: String(group.id), label: group.name }));

  // 元の団体の割当と記録。貸出場所では絞らない（同じ物品が別の場所にあることがある）
  const { data: fromGroupData, isLoading: isFromGroupLoading } = useAssignments(
    null,
    fromGroupId === "" ? null : Number(fromGroupId),
    fromGroupId !== ""
  );

  const sourceAssignments = useMemo(
    () =>
      (fromGroupData?.assignRentalItems ?? []).filter(
        (assignment) => assignment.stockerPlaceId !== null
      ),
    [fromGroupData?.assignRentalItems]
  );

  // 物品は提供元が持っているものだけ、重複を除いて出す
  const itemOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const assignment of sourceAssignments) {
      map.set(assignment.rentalItemId, assignment.rentalItemName);
    }
    return [...map.entries()].map(([id, name]) => ({
      value: String(id),
      label: name,
    }));
  }, [sourceAssignments]);

  // 在庫場所は選んだ物品に紐づくものだけに絞る
  const placeOptions = useMemo(() => {
    const map = new Map<number, string>();
    for (const assignment of sourceAssignments) {
      if (itemId && String(assignment.rentalItemId) !== itemId) continue;
      map.set(assignment.stockerPlaceId as number, assignment.stockPlaceName);
    }
    return [...map.entries()].map(([id, name]) => ({
      value: String(id),
      label: name || "未設定",
    }));
  }, [sourceAssignments, itemId]);

  // 未貸出数 = Σ（実効割当数 − 貸出済数）。物品と在庫場所が一致する割当だけを見る
  const available = useMemo(() => {
    if (!fromGroupData || itemId === "" || placeId === "") return null;

    const matched = sourceAssignments.filter(
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
  }, [fromGroupData, sourceAssignments, itemId, placeId]);

  const parsedQuantity = quantity === "" ? null : Number(quantity);
  const isQuantityInvalid =
    parsedQuantity !== null &&
    (!Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0 ||
      (available !== null && parsedQuantity > available));
  const canSubmit =
    fromGroupId !== "" &&
    itemId !== "" &&
    placeId !== "" &&
    available !== null &&
    available > 0 &&
    parsedQuantity !== null &&
    !isQuantityInvalid;

  // 上限の根拠が分かるようにメッセージを出し分ける
  const quantityHint = (() => {
    if (fromGroupId === "") return "※ 先に元の貸出先団体を選んでください";
    if (isFromGroupLoading) return "元の団体の割当を確認しています...";
    if (itemId === "" || placeId === "")
      return "※ 先に物品と在庫場所を選んでください";
    if (available === null) return "※ 元の団体の未貸出数を取得できませんでした";
    if (available === 0)
      return "※ この団体にはこの物品の未貸出分が残っていません。別の団体を選んでください";
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
      setFromGroupId("");
      setItemId("");
      setPlaceId("");
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
          label="元の貸出先団体"
          value={fromGroupId}
          onChange={(value) => {
            setFromGroupId(value);
            // 団体が変われば持っている物品も上限も変わるため選び直してもらう
            setItemId("");
            setPlaceId("");
            setQuantity("");
            renewUid();
          }}
          placeholder="選択してください"
          options={groupOptions}
        />

        <Selector
          label="貸出を行う物品"
          value={itemId}
          onChange={(value) => {
            setItemId(value);
            setPlaceId("");
            setQuantity("");
            renewUid();
          }}
          placeholder={
            fromGroupId ? "選択してください" : "先に団体を選んでください"
          }
          disabled={!fromGroupId || isFromGroupLoading}
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
          placeholder={itemId ? "選択してください" : "先に物品を選んでください"}
          disabled={!itemId}
          options={placeOptions}
        />

        {fromGroupId !== "" &&
          !isFromGroupLoading &&
          itemOptions.length === 0 && (
            <p className="text-caption text-alert">
              この団体には在庫場所が設定された割当がありません。別の団体を選んでください。
            </p>
          )}

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
