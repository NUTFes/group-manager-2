import { forwardToApi, jsonError } from "@/lib/bff";

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
