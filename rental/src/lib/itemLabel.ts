// 物品名の表示。
//
// 「余り」のように全場所の余り物品をまとめて持つ団体では、同じ団体に同じ物品の
// 割当が在庫場所ちがいで複数ぶら下がる。物品名だけを出すと「机」「机」と並んで
// どれがどれか分からないため、そういうときだけ在庫場所を添える。
import type { AssignRentalItem } from "@/types/rental";

const UNKNOWN_PLACE = "場所未設定";

/**
 * 渡した割当の範囲で、割当ID → 表示名 の対応を作る。
 *
 * 同じ物品が1件しか無ければ物品名のまま。複数あるときだけ在庫場所を括弧で添える。
 * 常に添えると通常の団体の画面が冗長になるため、必要なときだけにしている。
 */
export function buildItemLabels(
  assignments: AssignRentalItem[]
): Map<number, string> {
  const countByItem = new Map<number, number>();
  for (const assignment of assignments) {
    countByItem.set(
      assignment.rentalItemId,
      (countByItem.get(assignment.rentalItemId) ?? 0) + 1
    );
  }

  return new Map(
    assignments.map((assignment) => [
      assignment.id,
      (countByItem.get(assignment.rentalItemId) ?? 0) > 1
        ? `${assignment.rentalItemName}（${assignment.stockPlaceName || UNKNOWN_PLACE}）`
        : assignment.rentalItemName,
    ])
  );
}
