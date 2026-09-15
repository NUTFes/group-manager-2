"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AccordionCard from "@/components/AccordionCard";
import Button from "@/components/Button";
import CorrectionModal from "@/components/CorrectionModal";
import type { CorrectionTarget } from "@/components/CorrectionModal";
import ExceptionSheet from "@/components/ExceptionSheet";
import ExcessLendingSheet from "@/components/ExcessLendingSheet";
import type { ExcessLendingInput } from "@/components/ExcessLendingSheet";
import GroupSelectSheet from "@/components/GroupSelectSheet";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import {
  createExcessLending,
  createItemRentalLog,
  useAssignments,
  useRentalGroups,
} from "@/hooks/useRentalApi";
import { useWorkSession } from "@/hooks/useWorkSession";
import { summarize } from "@/lib/aggregate";

type DraftState = Record<number, { quantity: number; memo: string }>;

type SubmitState =
  | { phase: "idle" }
  | { phase: "sending" }
  | { phase: "error"; failedIds: number[]; message: string };

// 画面③（Figma: 貸出-登録ページ node-id=5032-6817）。送信処理は F7(#2210)。
//
// useSearchParams を使う部分は Suspense で包む必要がある
// （Next のドキュメント: missing-suspense-with-csr-bailout）。
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = Number(searchParams.get("groupId"));
  const { session, isLoading: isSessionLoading } = useWorkSession();

  const { data, error, isLoading, mutate } = useAssignments(
    session?.placeId ?? null,
    Number.isFinite(groupId) && groupId > 0 ? groupId : null
  );

  const [drafts, setDrafts] = useState<DraftState>({});
  const [submitState, setSubmitState] = useState<SubmitState>({
    phase: "idle",
  });
  // 送信のたびに作り直す冪等キー。再送では同じキーを使う
  const [uidSeed, setUidSeed] = useState(() => crypto.randomUUID());
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [isExceptionOpen, setIsExceptionOpen] = useState(false);
  const [isExcessOpen, setIsExcessOpen] = useState(false);
  const [isGroupSheetOpen, setIsGroupSheetOpen] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && !session) router.replace("/select-place");
  }, [isSessionLoading, session, router]);

  useEffect(() => {
    if (!Number.isFinite(groupId) || groupId <= 0)
      router.replace("/select-group");
  }, [groupId, router]);

  const mode = session?.mode ?? "rental";
  const { data: groups, isLoading: isGroupsLoading } = useRentalGroups(
    session?.placeId ?? null
  );
  const changeLogs = useMemo(
    () => data?.assignmentChangeLogs ?? [],
    [data?.assignmentChangeLogs]
  );

  // この作業場所で扱う割当（処理対象アイテム）
  const targets = useMemo(
    () =>
      (data?.assignRentalItems ?? []).filter(
        (assignment) => assignment.rentalPlaceId === session?.placeId
      ),
    [data?.assignRentalItems, session?.placeId]
  );

  // 団体全体の貸出予定一覧は全作業場所分を見せる（設計書3章③）
  const allAssignments = data?.assignRentalItems ?? [];
  const groupName = allAssignments[0]?.groupName ?? "";

  const summaries = useMemo(
    () =>
      new Map(
        targets.map((assignment) => [
          assignment.id,
          summarize(assignment, changeLogs, mode),
        ])
      ),
    [targets, changeLogs, mode]
  );

  // 数量が入っているカードに加え、メモだけ書かれたカードも送信対象にする。
  // 「来たが受け取らなかった」等をメモだけで残せるようにするため（quantity 0 で記録）。
  const submittableIds = Object.entries(drafts)
    .filter(([, draft]) => draft.quantity > 0 || draft.memo.trim() !== "")
    .map(([id]) => Number(id));

  const handleSelect = (assignmentId: number) => {
    const remaining = summaries.get(assignmentId)?.remaining ?? 0;
    if (remaining === 0) return;

    setDrafts((prev) => {
      const current = prev[assignmentId] ?? { quantity: 0, memo: "" };
      // 選択済みなら数量を0に戻し、未選択なら残数を流し込む（設計書3章③）。
      // メモは選択状態に関係なく保持する
      return {
        ...prev,
        [assignmentId]: {
          ...current,
          quantity: current.quantity > 0 ? 0 : remaining,
        },
      };
    });
  };

  const updateDraft = (
    assignmentId: number,
    patch: Partial<{ quantity: number; memo: string }>
  ) =>
    setDrafts((prev) => {
      const current = prev[assignmentId] ?? { quantity: 0, memo: "" };
      return { ...prev, [assignmentId]: { ...current, ...patch } };
    });

  const handleSubmit = async () => {
    const category = mode === "rental" ? "rental" : "return";
    const ids =
      submitState.phase === "error" ? submitState.failedIds : submittableIds;
    if (ids.length === 0) return;

    setSubmitState({ phase: "sending" });

    const results = await Promise.allSettled(
      ids.map((assignmentId) =>
        createItemRentalLog({
          // 同じ送信では同じ uid を使い、再送でも重複記録にならないようにする
          uid: `${uidSeed}-${assignmentId}`,
          assignRentalItemId: assignmentId,
          category,
          quantity: drafts[assignmentId]?.quantity ?? 0,
          memo: drafts[assignmentId]?.memo?.trim() || null,
        }).then(() => assignmentId)
      )
    );

    const failedIds = ids.filter(
      (_, index) => results[index].status === "rejected"
    );

    await mutate();

    if (failedIds.length > 0) {
      const firstError = results.find((result) => result.status === "rejected");
      setSubmitState({
        phase: "error",
        failedIds,
        message:
          firstError && firstError.status === "rejected"
            ? String((firstError.reason as Error).message)
            : "送信に失敗しました",
      });
      return;
    }

    setDrafts({});
    setUidSeed(crypto.randomUUID());
    setSubmitState({ phase: "idle" });
    router.push("/select-group");
  };

  // 訂正は「訂正後の累計」を直接記録する（設計書5章の合算上書き方式）
  const correctionTargets: CorrectionTarget[] = targets.map((assignment) => {
    const summary = summarize(assignment, changeLogs, mode);
    return {
      assignRentalItemId: assignment.id,
      itemName: assignment.rentalItemName,
      currentTotal: mode === "rental" ? summary.lent : summary.returned,
      // 貸出の上限は実効割当数、返却の上限は貸出済数
      maxTotal: mode === "rental" ? summary.num : summary.lent,
    };
  });

  const handleCorrection = async (
    target: CorrectionTarget,
    correctedTotal: number
  ) => {
    await createItemRentalLog({
      uid: crypto.randomUUID(),
      assignRentalItemId: target.assignRentalItemId,
      category: mode === "rental" ? "rental_absolute" : "return_absolute",
      quantity: correctedTotal,
    });
    await mutate();
  };

  const handleExcessLending = async (input: ExcessLendingInput) => {
    await createExcessLending({
      uid: crypto.randomUUID(),
      toGroupId: groupId,
      ...input,
    });
    await mutate();
  };

  if (!session) return null;

  const quantityLabel = mode === "rental" ? "数量/貸出残" : "数量/返却残";

  return (
    <>
      <Header
        mode={session.mode}
        placeName={session.placeName}
        onProgressClick={() =>
          router.push(
            `/progress?from=${encodeURIComponent(`/register?groupId=${groupId}`)}`
          )
        }
      />

      <main className="flex flex-1 flex-col gap-4 px-4 pb-28 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="min-w-0 truncate text-h3 text-font">
            {groupName || "参加団体"}
          </h1>
          <Button variant="sub" onClick={() => setIsGroupSheetOpen(true)}>
            団体変更
          </Button>
        </div>

        {isLoading && <p className="text-body text-sub">読み込み中...</p>}
        {error && (
          <p className="text-body text-alert">
            割当を取得できませんでした。通信状況を確認してください。
          </p>
        )}

        {allAssignments.length > 0 && (
          <AccordionCard
            title="団体全体の貸出予定一覧"
            icon={<span aria-hidden>👤</span>}
            defaultOpen={false}
          >
            <table className="w-full text-caption text-font">
              <thead>
                <tr className="text-left text-sub">
                  <th className="pb-1 font-normal">貸出場所</th>
                  <th className="pb-1 font-normal">物品名</th>
                  <th className="pb-1 text-right font-normal">数量</th>
                </tr>
              </thead>
              <tbody>
                {allAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-t border-line">
                    <td className="max-w-24 truncate py-1">
                      {assignment.rentalPlaceName || "未設定"}
                    </td>
                    <td className="py-1">{assignment.rentalItemName}</td>
                    <td className="tabular py-1 text-right">
                      {assignment.num}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionCard>
        )}

        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-body font-bold text-font">
            <span aria-hidden>📦</span>処理対象アイテム
          </h2>
          {targets.length > 0 && (
            <Button variant="sub" onClick={() => setIsExceptionOpen(true)}>
              例外対応
            </Button>
          )}
        </div>

        {!isLoading && targets.length === 0 && (
          <p className="text-body text-sub">
            この作業場所に渡す物品の割当がありません。
          </p>
        )}

        <div className="flex flex-col gap-4">
          {targets.map((assignment) => {
            const summary = summaries.get(assignment.id);
            const draft = drafts[assignment.id];

            return (
              <ItemCard
                key={assignment.id}
                itemName={assignment.rentalItemName}
                stockPlaceName={assignment.stockPlaceName}
                quantity={draft?.quantity ?? 0}
                remaining={summary?.remaining ?? 0}
                remark={assignment.remark}
                latestMemo={summary?.latestMemo}
                memo={draft?.memo ?? ""}
                selected={(draft?.quantity ?? 0) > 0}
                disabled={(summary?.remaining ?? 0) === 0}
                quantityLabel={quantityLabel}
                onSelect={() => handleSelect(assignment.id)}
                onQuantityChange={(quantity) =>
                  updateDraft(assignment.id, { quantity })
                }
                onMemoChange={(memo) => updateDraft(assignment.id, { memo })}
              />
            );
          })}
        </div>

        {submitState.phase === "error" && (
          <p className="text-body text-alert">
            {submitState.message}（{submitState.failedIds.length}
            件が未送信です。 もう一度「送信」を押すと失敗分だけ再送します）
          </p>
        )}
      </main>

      <ExceptionSheet
        open={isExceptionOpen}
        onClose={() => setIsExceptionOpen(false)}
        onSelectCorrection={() => {
          setIsExceptionOpen(false);
          setIsCorrectionOpen(true);
        }}
        onSelectExcessLending={() => {
          setIsExceptionOpen(false);
          setIsExcessOpen(true);
        }}
      />

      <CorrectionModal
        open={isCorrectionOpen}
        mode={mode}
        targets={correctionTargets}
        onClose={() => setIsCorrectionOpen(false)}
        onSubmit={handleCorrection}
      />

      <ExcessLendingSheet
        open={isExcessOpen}
        assignments={targets}
        groups={groups ?? []}
        currentGroupId={groupId}
        onClose={() => setIsExcessOpen(false)}
        onSubmit={handleExcessLending}
      />

      <GroupSelectSheet
        open={isGroupSheetOpen}
        groups={groups ?? []}
        isLoading={isGroupsLoading}
        currentGroupId={groupId}
        onClose={() => setIsGroupSheetOpen(false)}
        onSelect={(group) => {
          setIsGroupSheetOpen(false);
          // 画面遷移せず、同じページのまま対象団体を切り替える
          setDrafts({});
          setSubmitState({ phase: "idle" });
          setUidSeed(crypto.randomUUID());
          router.replace(`/register?groupId=${group.id}`);
        }}
      />

      <div className="fixed inset-x-0 bottom-0 flex justify-center border-t border-line bg-white/95 px-4 py-3">
        <Button
          onClick={handleSubmit}
          disabled={
            submittableIds.length === 0 || submitState.phase === "sending"
          }
          icon={<span aria-hidden>➤</span>}
        >
          {submitState.phase === "sending" ? "送信中..." : "送信"}
        </Button>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center">
          <p className="text-body text-sub">読み込み中...</p>
        </main>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
