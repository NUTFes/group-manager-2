import { forwardToApi } from "@/lib/bff";

// GET /api/rental/places … 作業場所（貸出場所）の候補
export async function GET(request: Request) {
  return forwardToApi(request, {
    path: "api/v1/get_rental_places_for_rental_view",
  });
}
