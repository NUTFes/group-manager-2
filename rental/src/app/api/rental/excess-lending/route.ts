import camelcaseKeys from "camelcase-keys";
import { summarize } from "@/lib/aggregate";
import { forwardToApi, jsonError } from "@/lib/bff";
import type { AssignmentsResponse } from "@/types/rental";

type ExcessLendingBody = {
  uid?: string;
  rentalItemId?: number;
  stockerPlaceId?: number;
  // 超過分を渡す団体（この団体の割当を増やす）
  toGroupId?: number;
  // その在庫がもともと割り当てられていた団体（割当を減らす）
  fromGroupId?: number;
  quantity?: number;
  memo?: string | null;
};

/**
 * 元の団体の未貸出数 = Σ（実効割当数 − 貸出済数）。
 *
 * 既に渡した分は手元に無いので他へ回せない。画面側でも同じ上限を出しているが、
 * 別端末の記録で残数が変わることがあるため送信時にも確かめる。
 * 読み取りに失敗したときは null を返し、判定を諦めて記録を通す（記録できない方が
 * 当日の運用では困るため）。
 */
async function fetchUnlentQuantity(
  request: Request,
  {
    groupId,
    rentalItemId,
    stockerPlaceId,
  }: { groupId: number; rentalItemId: number; stockerPlaceId: number }
): Promise<number | null> {
  const response = await forwardToApi(request, {
    path: "api/v1/get_assign_rental_items_for_rental_view",
    query: { group_id: String(groupId) },
  });
  if (!response.ok) return null;

  try {
    const payload = (await response.json()) as {
      data?: Record<string, unknown>;
    };
    if (!payload.data) return null;

    const data = camelcaseKeys(payload.data, {
      deep: true,
    }) as unknown as AssignmentsResponse;

    return data.assignRentalItems
      .filter(
        (assignment) =>
          assignment.rentalItemId === rentalItemId &&
          assignment.stockerPlaceId === stockerPlaceId
      )
      .reduce(
        (sum, assignment) =>
          sum +
          summarize(assignment, data.assignmentChangeLogs, "rental")
            .lentRemaining,
        0
      );
  } catch {
    return null;
  }
}

// POST /api/rental/excess-lending
//
// 在庫予定を超えて貸し出す操作。渡す団体に addition、元の貸出先団体に reduction を
// 対で記録する（#2198 のカテゴリ）。どちらも uid で冪等なので、片方だけ成功した
// 状態で再送しても二重記録にならない。
export async function POST(request: Request) {
  let body: ExcessLendingBody;
  try {
    body = (await request.json()) as ExcessLendingBody;
  } catch {
    return jsonError(400, "リクエストのJSONを読めませんでした");
  }

  const {
    uid,
    rentalItemId,
    stockerPlaceId,
    toGroupId,
    fromGroupId,
    quantity,
  } = body;

  if (
    !uid ||
    !rentalItemId ||
    !stockerPlaceId ||
    !toGroupId ||
    !fromGroupId ||
    quantity === undefined
  ) {
    return jsonError(
      400,
      "uid / rentalItemId / stockerPlaceId / toGroupId / fromGroupId / quantity は必須です"
    );
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return jsonError(400, "quantity は1以上の整数で指定してください");
  }
  if (toGroupId === fromGroupId) {
    return jsonError(400, "元の貸出先団体には別の団体を指定してください");
  }

  const available = await fetchUnlentQuantity(request, {
    groupId: fromGroupId,
    rentalItemId,
    stockerPlaceId,
  });
  if (available !== null && quantity > available) {
    return jsonError(
      422,
      `元の団体の未貸出数（${available}）を超えています。最新の状況を確認してください`
    );
  }

  const common = {
    rental_item_id: rentalItemId,
    stocker_place_id: stockerPlaceId,
    quantity,
  };

  // 元の団体の割当を減らす。こちらが失敗した場合は渡す側を記録しない
  const reduction = await forwardToApi(request, {
    path: "item_rental_logs",
    method: "POST",
    body: {
      ...common,
      uid: `${uid}-reduction`,
      category: "reduction",
      group_id: fromGroupId,
    },
    withRecorderEmail: true,
  });
  if (!reduction.ok) return reduction;

  return forwardToApi(request, {
    path: "item_rental_logs",
    method: "POST",
    body: {
      ...common,
      uid: `${uid}-addition`,
      category: "addition",
      group_id: toGroupId,
    },
    withRecorderEmail: true,
  });
}
