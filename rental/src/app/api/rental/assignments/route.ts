import { forwardToApi } from "@/lib/bff";

// GET /api/rental/assignments?rentalPlaceId=&groupId=
// … 割当（名前付き）と各割当の記録、および団体の割当変更ログ
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return forwardToApi(request, {
    path: "api/v1/get_assign_rental_items_for_rental_view",
    query: {
      rental_place_id: searchParams.get("rentalPlaceId"),
      group_id: searchParams.get("groupId"),
    },
  });
}
