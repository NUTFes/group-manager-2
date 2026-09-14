// 設計書5章の集計ルールをここに集める。将来サーバー側集計へ寄せられるよう、
// 画面から切り離しておく。
import type { AssignRentalItem, ItemRentalLog, WorkMode } from "@/types/rental";

/** ログを created_at（同時刻は id）の昇順に並べる */
function sortLogs(logs: ItemRentalLog[]): ItemRentalLog[] {
  return [...logs].sort((a, b) => {
    const diff =
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return diff !== 0 ? diff : a.id - b.id;
  });
}

/**
 * 直近の絶対値ログで累計を上書きし、それより後の通常記録を足す。
 * 貸出済 = 直近 rental_absolute + それ以降の Σrental（無ければ Σrental）
 */
function accumulate(
  logs: ItemRentalLog[],
  normal: "rental" | "return",
  absolute: "rental_absolute" | "return_absolute"
): number {
  const sorted = sortLogs(logs);
  const lastAbsoluteIndex = sorted.reduce(
    (found, log, index) => (log.category === absolute ? index : found),
    -1
  );

  if (lastAbsoluteIndex === -1) {
    return sorted
      .filter((log) => log.category === normal)
      .reduce((sum, log) => sum + log.quantity, 0);
  }

  return sorted
    .slice(lastAbsoluteIndex)
    .reduce(
      (sum, log) => (log.category === normal ? sum + log.quantity : sum),
      sorted[lastAbsoluteIndex].quantity
    );
}

export const lentQuantity = (logs: ItemRentalLog[]) =>
  accumulate(logs, "rental", "rental_absolute");

export const returnedQuantity = (logs: ItemRentalLog[]) =>
  accumulate(logs, "return", "return_absolute");

/**
 * 実効割当数 = num + Σaddition − Σreduction。
 * 割当変更は assign_rental_item に紐づかないため、group_id / rental_item_id /
 * stocker_place_id の3つで割当と突き合わせる（設計書5章・9章）。
 */
export function effectiveNum(
  assignment: AssignRentalItem,
  changeLogs: ItemRentalLog[]
): number {
  const matched = changeLogs.filter(
    (log) =>
      log.groupId === assignment.groupId &&
      log.rentalItemId === assignment.rentalItemId &&
      log.stockerPlaceId === assignment.stockerPlaceId
  );

  return matched.reduce((num, log) => {
    if (log.category === "addition") return num + log.quantity;
    if (log.category === "reduction") return num - log.quantity;
    return num;
  }, assignment.num);
}

export type AssignmentSummary = {
  /** 実効割当数 */
  num: number;
  lent: number;
  returned: number;
  /** 貸出残 = 実効割当数 − 貸出済 */
  lentRemaining: number;
  /** 返却残 = 貸出済 − 返却済 */
  returnRemaining: number;
  /** 作業中のモードで入力できる残数 */
  remaining: number;
  latestMemo: string | null;
};

export function summarize(
  assignment: AssignRentalItem,
  changeLogs: ItemRentalLog[],
  mode: WorkMode
): AssignmentSummary {
  const num = effectiveNum(assignment, changeLogs);
  const lent = lentQuantity(assignment.itemRentalLogs);
  const returned = returnedQuantity(assignment.itemRentalLogs);
  const lentRemaining = Math.max(0, num - lent);
  const returnRemaining = Math.max(0, lent - returned);
  const withMemo = sortLogs(assignment.itemRentalLogs).filter(
    (log) => log.memo
  );

  return {
    num,
    lent,
    returned,
    lentRemaining,
    returnRemaining,
    remaining: mode === "rental" ? lentRemaining : returnRemaining,
    latestMemo: withMemo.length ? withMemo[withMemo.length - 1].memo : null,
  };
}

export type GroupStatus = "notStarted" | "inProgress" | "done";

/**
 * 団体ステータス。ログ0件なら未着手、全アイテムの残が0なら完了、
 * それ以外は進行中（設計書5章）。
 */
export function groupStatus(
  assignments: AssignRentalItem[],
  changeLogs: ItemRentalLog[],
  mode: WorkMode
): GroupStatus {
  if (assignments.length === 0) return "notStarted";

  const summaries = assignments.map((assignment) =>
    summarize(assignment, changeLogs, mode)
  );
  const hasLog = assignments.some((assignment) =>
    assignment.itemRentalLogs.some((log) =>
      mode === "rental"
        ? log.category === "rental" || log.category === "rental_absolute"
        : log.category === "return" || log.category === "return_absolute"
    )
  );

  if (!hasLog) return "notStarted";
  return summaries.every((summary) => summary.remaining === 0)
    ? "done"
    : "inProgress";
}
