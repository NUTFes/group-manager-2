import { forwardToApi } from "@/lib/bff";

// GET /api/rental/groups?rentalPlaceId= … その作業場所に割当がある今年度の団体
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return forwardToApi(request, {
    path: "api/v1/get_groups_for_rental_view",
    query: { rental_place_id: searchParams.get("rentalPlaceId") },
  });
}
