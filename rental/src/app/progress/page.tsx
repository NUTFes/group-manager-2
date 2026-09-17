"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import Selector from "@/components/Selector";
import { useAssignments, useRentalPlaces } from "@/hooks/useRentalApi";
import { ALL_PLACES_NAME, useWorkSession } from "@/hooks/useWorkSession";
import { groupStatus, hasAnyAllocation, summarize } from "@/lib/aggregate";
import { buildItemLabels } from "@/lib/itemLabel";
import type { AssignRentalItem, WorkMode } from "@/types/rental";

// 貸出場所で絞らずに全体を見るときの選択値
const ALL_PLACES_VALUE = "all";

// 戻り先として受け付けるアプリ内のパス。文字列の先頭だけを見る判定では
// `/\evil.com` のような値が同一オリジンの判定をすり抜けるため、行き先を列挙する
const BACK_PATHS = ["/select-group", "/register"];

function resolveBackTo(fromParam: string): string {
  const [path] = fromParam.split("?");
  return BACK_PATHS.includes(path) ? fromParam : "/select-group";
}

type GroupRow = {
  groupId: number;
  groupName: string;
  status: ReturnType<typeof groupStatus>;
  handed: string[];
  notHanded: string[];
};

// 画面④（Figma: 進捗確認ページ node-id=5046-640）
function ProgressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useWorkSession();
  const { data: places } = useRentalPlaces();

  // 絞り込みは作業セッションの値を初期値にする
  const [modeInput, setModeInput] = useState<string | null>(null);
  const [placeInput, setPlaceInput] = useState<string | null>(null);
  const mode = (modeInput ?? session?.mode ?? "rental") as WorkMode;
  // 作業セッションが「すべての場所」なら既定も全体表示にする
  const placeValue =
    placeInput ?? session?.placeId?.toString() ?? ALL_PLACES_VALUE;
  const placeId = placeValue === ALL_PLACES_VALUE ? null : Number(placeValue);

  const { data, error, isLoading } = useAssignments(placeId, null);

  const rows = useMemo<GroupRow[]>(() => {
    const assignments = data?.assignRentalItems ?? [];
    const changeLogs = data?.assignmentChangeLogs ?? [];

    // 団体ごとにまとめる
    const byGroup = new Map<number, AssignRentalItem[]>();
    for (const assignment of assignments) {
      const list = byGroup.get(assignment.groupId) ?? [];
      list.push(assignment);
      byGroup.set(assignment.groupId, list);
    }

    return (
      [...byGroup.entries()]
        // 実効割当数が0の団体（在庫を全部他団体へ回した等）は渡す物が無いので数えない
        .filter(([, groupAssignments]) =>
          hasAnyAllocation(groupAssignments, changeLogs)
        )
        .map(([groupId, groupAssignments]) => {
          const handed: string[] = [];
          const notHanded: string[] = [];
          // 同じ物品が在庫場所ちがいで複数ある団体（「余り」など）は場所を添える
          const itemLabels = buildItemLabels(groupAssignments);

          for (const assignment of groupAssignments) {
            const summary = summarize(assignment, changeLogs, mode);
            const done = mode === "rental" ? summary.lent : summary.returned;
            const label =
              itemLabels.get(assignment.id) ?? assignment.rentalItemName;
            if (done > 0) {
              handed.push(`${label} x${done}`);
            }
            if (summary.remaining > 0) {
              notHanded.push(`${label} x${summary.remaining}`);
            }
          }

          return {
            groupId,
            groupName: groupAssignments[0]?.groupName ?? "",
            status: groupStatus(groupAssignments, changeLogs, mode),
            handed,
            notHanded,
          };
        })
        .sort((a, b) => a.groupId - b.groupId)
    );
  }, [data?.assignRentalItems, data?.assignmentChangeLogs, mode]);

  // 全体進捗は団体ベース（完了=1、進行中・未着手=0 の二値カウント）。設計書5章
  const doneCount = rows.filter((row) => row.status === "done").length;
  const percentage = rows.length ? (doneCount / rows.length) * 100 : 0;
  // 遷移元。外部URLへ飛ばされないよう、行き先を列挙して照合する
  const backTo = resolveBackTo(searchParams.get("from") ?? "");
  const placeName =
    placeId === null
      ? ALL_PLACES_NAME
      : (places?.find((place) => place.id === placeId)?.name ??
        session?.placeName ??
        "");

  return (
    <>
      <Header
        mode={session?.mode ?? null}
        placeName={session?.placeName ?? null}
      />

      <main className="flex flex-1 flex-col gap-4 px-4 pb-24 pt-4">
        <h1 className="text-center text-body font-bold text-font">進捗確認</h1>

        <div className="flex gap-3">
          <div className="w-28">
            <Selector
              compact
              value={mode}
              onChange={setModeInput}
              options={[
                { value: "rental", label: "貸出" },
                { value: "return", label: "返却" },
              ]}
            />
          </div>
          <div className="flex-1">
            <Selector
              compact
              value={placeValue}
              onChange={setPlaceInput}
              placeholder="拠点を選択"
              options={[
                { value: ALL_PLACES_VALUE, label: ALL_PLACES_NAME },
                ...(places ?? []).map((place) => ({
                  value: String(place.id),
                  label: place.name,
                })),
              ]}
            />
          </div>
        </div>

        <section className="rounded-lg border border-main bg-card">
          <h2 className="rounded-t-lg bg-card-head px-3 py-3 text-center text-body font-bold text-main">
            {mode === "rental" ? "全体の貸出進捗" : "全体の返却進捗"}
          </h2>
          <div className="flex flex-col gap-2 px-3 py-3">
            <ProgressBar percentage={percentage} />
            <div className="flex items-center justify-between">
              <span className="tabular text-caption text-font">
                完了: {doneCount} / 全体: {rows.length}
              </span>
              <span className="tabular text-caption text-font">
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-2">
          <h2 className="text-body font-bold text-font">
            団体別ステータス一覧
          </h2>
        </div>
        {placeName && <p className="text-caption text-font">📍 {placeName}</p>}

        {isLoading && <p className="text-body text-sub">読み込み中...</p>}
        {error && (
          <p className="text-body text-alert">
            進捗を取得できませんでした。通信状況を確認してください。
          </p>
        )}
        {!isLoading && !error && rows.length === 0 && (
          <p className="text-body text-sub">
            {placeId === null
              ? "割当がある団体がありません。"
              : "この拠点に割当がある団体がありません。"}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <section
              key={row.groupId}
              className="overflow-hidden rounded-lg border border-main bg-white"
            >
              <div className="flex items-center justify-between gap-2 bg-card-head px-4 py-3">
                <h3 className="min-w-0 truncate text-body font-bold text-font">
                  {row.groupName}
                </h3>
                <Badge state={row.status} />
              </div>
              <div className="flex flex-col gap-3 px-4 py-3">
                <div>
                  <p className="text-caption font-bold text-main">
                    ✓ {mode === "rental" ? "取りに来たもの" : "返したもの"}
                  </p>
                  <p className="text-caption text-font">
                    {row.handed.length ? row.handed.join("、") : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-caption font-bold text-alert">
                    ⚠{" "}
                    {mode === "rental"
                      ? "取りに来ていないもの"
                      : "返していないもの"}
                  </p>
                  <p className="text-caption text-font">
                    {row.notHanded.length ? row.notHanded.join("、") : "—"}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3">
        {/* router.back() は直接この画面を開いた場合に戻れないため、
            遷移元をクエリで受け取って明示的に戻る */}
        <Button variant="main" onClick={() => router.push(backTo)}>
          ← 戻る
        </Button>
      </div>
    </>
  );
}

export default function ProgressPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center">
          <p className="text-body text-sub">読み込み中...</p>
        </main>
      }
    >
      <ProgressContent />
    </Suspense>
  );
}
