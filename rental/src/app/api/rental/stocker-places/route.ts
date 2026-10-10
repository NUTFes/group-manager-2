import { forwardToApi } from "@/lib/bff";

// GET /api/rental/stocker-places … 在庫場所のマスタ（例外対応で全ての場所から選べるようにするため全件）
export async function GET(request: Request) {
  return forwardToApi(request, {
    path: "api/v1/get_stocker_places_for_rental_view",
  });
}
