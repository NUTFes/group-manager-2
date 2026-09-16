import { forwardToApi } from "@/lib/bff";

// GET /api/rental/rental-items … 物品のマスタ（例外対応で予定に無い物品も選べるようにするため全件）
export async function GET(request: Request) {
  return forwardToApi(request, {
    path: "api/v1/get_rental_items_for_rental_view",
  });
}
