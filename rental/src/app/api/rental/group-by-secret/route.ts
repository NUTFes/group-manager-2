import { forwardToApi, jsonError } from "@/lib/bff";

// GET /api/rental/group-by-secret?groupId=&secret=
// QRコードのURLに含まれる group_id と secret で団体を特定する。
// 不一致・不存在はAPI側が一律404を返す（団体の存在有無を漏らさないため）。
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");
  const secret = searchParams.get("secret");

  if (!groupId || !secret) {
    return jsonError(400, "groupId と secret は必須です");
  }

  return forwardToApi(request, {
    path: `api/v1/get_confirmed_info_for_user_view/${encodeURIComponent(groupId)}`,
    query: { secret },
  });
}
