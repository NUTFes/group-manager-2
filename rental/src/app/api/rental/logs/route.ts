import { forwardToApi, jsonError } from "@/lib/bff";

type LogRequestBody = {
  uid?: string;
  assignRentalItemId?: number;
  category?: string;
  quantity?: number;
  memo?: string | null;
};

// 記録できるカテゴリ。割当変更(addition / reduction)はv1のUIから送らない。
const ALLOWED_CATEGORIES = [
  "rental",
  "return",
  "rental_absolute",
  "return_absolute",
];

// POST /api/rental/logs … 貸出・返却・訂正の記録
export async function POST(request: Request) {
  let body: LogRequestBody;
  try {
    body = (await request.json()) as LogRequestBody;
  } catch {
    return jsonError(400, "リクエストのJSONを読めませんでした");
  }

  const { uid, assignRentalItemId, category, quantity, memo } = body;

  if (!uid || !assignRentalItemId || !category || quantity === undefined) {
    return jsonError(
      400,
      "uid / assignRentalItemId / category / quantity は必須です"
    );
  }
  if (!ALLOWED_CATEGORIES.includes(category)) {
    return jsonError(400, `このアプリからは ${category} を記録できません`);
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    return jsonError(400, "quantity は0以上の整数で指定してください");
  }

  return forwardToApi(request, {
    path: "item_rental_logs",
    method: "POST",
    // recorder_email はAPI側がヘッダーから取るため、ボディには含めない
    body: {
      uid,
      assign_rental_item_id: assignRentalItemId,
      category,
      quantity,
      memo: memo ?? null,
    },
    withRecorderEmail: true,
  });
}
