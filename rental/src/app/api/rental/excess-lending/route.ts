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
  // 渡す作業を行っている場所。渡す先に割当が無いときの貸出場所になる
  rentalPlaceId?: number | null;
  memo?: string | null;
};

// POST /api/rental/excess-lending
//
// 在庫予定を超えて貸し出す操作。渡す団体に addition、元の貸出先団体に reduction を
// 対で記録する（#2198 のカテゴリ）。2件を別々に POST すると片方だけ成功したときに
// 元の団体の在庫が消えたまま残るため、API 側の transfer で1トランザクションにまとめて
// 記録する。uid で冪等なので、同じ uid の再送は既存の対をそのまま返す。
//
// 上限（提供元の未貸出数）と uid・数量・団体の検証は API 側の transfer が行い、
// 超過は 422 で返る。ここで先回りして確かめると、同じ規則の写しが増えるうえに
// 往復が1回増えるだけで保証は変わらないため、そのまま転送する。
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
    rentalPlaceId,
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

  return forwardToApi(request, {
    path: "item_rental_logs/transfer",
    method: "POST",
    body: {
      uid,
      rental_item_id: rentalItemId,
      stocker_place_id: stockerPlaceId,
      from_group_id: fromGroupId,
      to_group_id: toGroupId,
      quantity,
      rental_place_id: rentalPlaceId ?? null,
      memo: body.memo ?? null,
    },
    withRecorderEmail: true,
  });
}
