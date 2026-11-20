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
import type { AssignmentSummary } from "@/lib/aggregate";
import type { ApiError } from "@/lib/apiClient";
import { buildItemLabels } from "@/lib/itemLabel";

type DraftState = Record<number, { quantity: number; memo: string }>;

/**
 * 実際に送った内容と、そのときの冪等キー。
 * 中身を変えずに送り直すときは同じ uid を使い、編集されたら取り直す。
 */
type SentPayloads = Record<
  number,
  { uid: string; quantity: number; memo: string | null }
>;

type SubmitState =
  | { phase: "idle" }
  | { phase: "sending" }
  | { phase: "error"; failedIds: number[]; message: string };

/**
 * 入力済みの数量を最新の残数に丸める。変化が無ければ元のオブジェクトを返す。
 *
 * 割当は画面復帰時に取り直す（useRentalApi の revalidateOnFocus）ため、別の端末の
 * 記録で残数が減っていることがある。古い（今より大きい）数量のまま送らないよう、
 * 表示にも送信にも丸めた後の値を使う。
 */
function clampDrafts(
  drafts: DraftState,
  summaries: Map<number, AssignmentSummary>
): DraftState {
  let changed = false;
  const clamped: DraftState = {};

  for (const [key, draft] of Object.entries(drafts)) {
    const assignmentId = Number(key);
    const quantity = Math.min(
      draft.quantity,
      summaries.get(assignmentId)?.remaining ?? 0
    );
    if (quantity !== draft.quantity) changed = true;
    clamped[assignmentId] =
      quantity === draft.quantity ? draft : { ...draft, quantity };
  }

  return changed ? clamped : drafts;
}

// 画面③（Figma: 貸出-登録ページ node-id=5032-6817）。送信処理は F7(#2210)。
//
// useSearchParams を使う部分は Suspense で包む必要がある
// （Next のドキュメント: missing-suspense-with-csr-bailout）。
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = Number(searchParams.get("groupId"));
  const { session, isLoading: isSessionLoading } = useWorkSession();

  // 「団体全体の貸出予定一覧」は全作業場所分を見せる必要があるため、貸出場所では
  // 絞らずに団体単位で取り、この場所の対象は下の targets でクライアント側に絞る
  const hasValidGroup = Number.isFinite(groupId) && groupId > 0;
  const { data, error, isLoading, mutate } = useAssignments(
    null,
    hasValidGroup ? groupId : null,
    hasValidGroup
  );

  const [drafts, setDrafts] = useState<DraftState>({});
  const [submitState, setSubmitState] = useState<SubmitState>({
    phase: "idle",
  });
  // 送信のたびに作り直す冪等キー。再送では同じキーを使う
  const [uidSeed, setUidSeed] = useState(() => crypto.randomUUID());
  const [sentPayloads, setSentPayloads] = useState<SentPayloads>({});
  // 編集後の送り直しで uid を変えるための連番
  const [nextAttempt, setNextAttempt] = useState(0);
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [isExceptionOpen, setIsExceptionOpen] = useState(false);
  const [isExcessOpen, setIsExcessOpen] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && !session) router.replace("/select-place");
  }, [isSessionLoading, session, router]);

  useEffect(() => {
    if (!hasValidGroup) router.replace("/select-group");
  }, [hasValidGroup, router]);

  const mode = session?.mode ?? "rental";
  // 超過貸出の「元の貸出先団体」の候補。例外対応は貸出場所に関わらず行えるよう、
  // 作業場所では絞らずに今年度の全団体を出す
  const { data: groups } = useRentalGroups(null);
  const changeLogs = useMemo(
    () => data?.assignmentChangeLogs ?? [],
    [data?.assignmentChangeLogs]
  );

  // この作業場所で扱う割当（処理対象アイテム）。
  // 作業場所が「すべての場所」なら絞らない
  const targets = useMemo(() => {
    const assignments = data?.assignRentalItems ?? [];
    const placeId = session?.placeId ?? null;
    if (placeId === null) return assignments;

    return assignments.filter(
      (assignment) => assignment.rentalPlaceId === placeId
    );
  }, [data?.assignRentalItems, session?.placeId]);

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

  // 「余り」団体のように同じ物品が在庫場所ちがいで複数あるとき用の表示名。
  // 処理対象アイテムと団体全体の一覧は範囲が違うので別々に作る
  const itemLabels = useMemo(() => buildItemLabels(targets), [targets]);
  const allItemLabels = useMemo(
    () => buildItemLabels(data?.assignRentalItems ?? []),
    [data?.assignRentalItems]
  );

  // 最新の残数に丸めた入力。表示・送信はこちらを使う
  const effectiveDrafts = useMemo(
    () => clampDrafts(drafts, summaries),
    [drafts, summaries]
  );
  // 丸めが起きている間は、入力した値と違うものを送ることを画面で知らせる
  const isClamped = effectiveDrafts !== drafts;

  // 数量が入っているカードに加え、メモだけ書かれたカードも送信対象にする。
  // 「来たが受け取らなかった」等をメモだけで残せるようにするため（quantity 0 で記録）。
  const submittableIds = Object.entries(effectiveDrafts)
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
  ) => {
    setDrafts((prev) => {
      const current = prev[assignmentId] ?? { quantity: 0, memo: "" };
      return { ...prev, [assignmentId]: { ...current, ...patch } };
    });
  };

  const handleSubmit = async () => {
    const category = mode === "rental" ? "rental" : "return";
    const retrying = submitState.phase === "error";
    const ids = retrying ? submitState.failedIds : submittableIds;
    if (ids.length === 0) return;

    // 送る内容と冪等キーを組み立てる。
    //
    // 中身を変えずに送り直すとき（通信エラーの再送）は1回目と同じ uid を使う。
    // そうしないと、mutate 後に残数が減って数量が丸められた場合に同じ uid で
    // 別の内容になり、API が 409 を返して抜け出せなくなる。
    // 逆にカードを編集したときは「別の操作」なので uid を取り直す。そうしないと
    // 編集が反映されないまま同じ内容を送り続けることになる。
    const payloads: SentPayloads = Object.fromEntries(
      ids.map((assignmentId) => {
        const current = {
          quantity: effectiveDrafts[assignmentId]?.quantity ?? 0,
          memo: effectiveDrafts[assignmentId]?.memo?.trim() || null,
        };
        const sent = retrying ? sentPayloads[assignmentId] : undefined;
        const unchanged =
          sent &&
          sent.quantity === current.quantity &&
          sent.memo === current.memo;

        return [
          assignmentId,
          unchanged
            ? sent
            : { ...current, uid: `${uidSeed}-${assignmentId}-${nextAttempt}` },
        ];
      })
    );

    setSentPayloads(payloads);
    setSubmitState({ phase: "sending" });

    const results = await Promise.allSettled(
      ids.map((assignmentId) =>
        createItemRentalLog({
          uid: payloads[assignmentId].uid,
          assignRentalItemId: assignmentId,
          category,
          quantity: payloads[assignmentId].quantity,
          memo: payloads[assignmentId].memo,
        }).then(() => assignmentId)
      )
    );

    const failedIds = ids.filter(
      (_, index) => results[index].status === "rejected"
    );

    await mutate();

    if (failedIds.length > 0) {
      // 編集すれば uid を取り直して送り直せるよう、次の試行に備えて番号を進める
      setNextAttempt((attempt) => attempt + 1);
      const firstError = results.find(
        (result, index) =>
          result.status === "rejected" && failedIds.includes(ids[index])
      );
      const reason =
        firstError && firstError.status === "rejected"
          ? (firstError.reason as ApiError)
          : null;
      setSubmitState({
        phase: "error",
        failedIds,
        // 409 は「同じ操作が別の内容で記録済み」。同じ内容を送り直しても解けないので、
        // 最新の状況を見て入れ直してもらう
        message:
          reason?.status === 409
            ? "同じ操作が別の内容で記録済みです。最新の残数を確認して数量を入れ直してください"
            : (reason?.message ?? "送信に失敗しました"),
      });
      return;
    }

    setDrafts({});
    setSentPayloads({});
    setNextAttempt(0);
    setUidSeed(crypto.randomUUID());
    setSubmitState({ phase: "idle" });
    // 送信できたことが次の画面でも分かるよう、団体名を添えて戻る。
    // 失敗時はこの画面に留まってエラーを出すので、遷移＝成功と区別できる
    const params = new URLSearchParams({ registered: "1" });
    if (groupName) params.set("group", groupName);
    router.push(`/select-group?${params.toString()}`);
  };

  // 訂正は「訂正後の累計」を直接記録する（設計書5章の合算上書き方式）
  const correctionTargets: CorrectionTarget[] = useMemo(
    () =>
      targets.flatMap((assignment) => {
        const summary = summaries.get(assignment.id);
        if (!summary) return [];

        return [
          {
            assignRentalItemId: assignment.id,
            itemName:
              itemLabels.get(assignment.id) ?? assignment.rentalItemName,
            currentTotal: mode === "rental" ? summary.lent : summary.returned,
            // 貸出の上限は実効割当数＋返却済（返った分はまた貸せる）、
            // 返却の上限は貸出済数
            maxTotal:
              mode === "rental" ? summary.num + summary.returned : summary.lent,
          },
        ];
      }),
    [targets, summaries, mode, itemLabels]
  );

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

  // uid はシート側が持つ。再送では同じ uid を使い、二重に割当を動かさない。
  // 渡す先にこの物品の割当が無い場合、API がこの作業場所で割当を作る
  const handleExcessLending = async (input: ExcessLendingInput) => {
    await createExcessLending({
      toGroupId: groupId,
      rentalPlaceId: session?.placeId ?? null,
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
          {/* 次の団体はQRで読むのが通常の流れなので、カメラのある画面へ戻す */}
          <Button variant="sub" onClick={() => router.push("/select-group")}>
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
                    <td className="py-1">
                      {allItemLabels.get(assignment.id) ??
                        assignment.rentalItemName}
                    </td>
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
            const draft = effectiveDrafts[assignment.id];

            return (
              <ItemCard
                key={assignment.id}
                itemName={
                  itemLabels.get(assignment.id) ?? assignment.rentalItemName
                }
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

        {isClamped && (
          <p className="text-body text-alert">
            他の端末の記録で残数が減ったため、入力済みの数量を最新の残数に合わせました。内容を確認してから送信してください。
          </p>
        )}

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
        groups={groups ?? []}
        currentGroupId={groupId}
        onClose={() => setIsExcessOpen(false)}
        onSubmit={handleExcessLending}
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
