"use client";

import useSWR from "swr";
import { bffFetcher, postToBff } from "@/lib/apiClient";
import type {
  AssignmentsResponse,
  ConfirmedInfo,
  LogCategory,
  RentalGroup,
  RentalPlace,
} from "@/types/rental";

// 当日の記録は他の端末の操作で変わるため、画面復帰時に取り直す。
// 逆に頻繁な自動更新は入力中の値を消しかねないので間隔は空ける。
const SWR_OPTIONS = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
} as const;

/** 作業場所（貸出場所）の候補 */
export const useRentalPlaces = () =>
  useSWR<RentalPlace[]>("/api/rental/places", bffFetcher, SWR_OPTIONS);

/** 今年度の団体。作業場所を渡すとその場所に割当がある団体だけに絞る（null なら全団体） */
export const useRentalGroups = (rentalPlaceId: number | null) =>
  useSWR<RentalGroup[]>(
    rentalPlaceId
      ? `/api/rental/groups?rentalPlaceId=${rentalPlaceId}`
      : "/api/rental/groups",
    bffFetcher,
    SWR_OPTIONS
  );

/**
 * 割当（名前付き）と記録。
 *
 * rentalPlaceId / groupId は null で「絞らない」を表す。両方 null なら全件になるため、
 * 取得の要否は enabled で明示する（遷移中に全件を引かないようにするため）。
 */
export const useAssignments = (
  rentalPlaceId: number | null,
  groupId: number | null,
  enabled = true
) => {
  const params = new URLSearchParams();
  if (rentalPlaceId) params.set("rentalPlaceId", String(rentalPlaceId));
  if (groupId) params.set("groupId", String(groupId));
  const query = params.toString();

  return useSWR<AssignmentsResponse>(
    enabled ? `/api/rental/assignments${query ? `?${query}` : ""}` : null,
    bffFetcher,
    SWR_OPTIONS
  );
};

/** QRの group_id と secret から団体を特定する */
export const fetchGroupBySecret = (groupId: string, secret: string) =>
  bffFetcher<ConfirmedInfo>(
    `/api/rental/group-by-secret?groupId=${encodeURIComponent(groupId)}&secret=${encodeURIComponent(secret)}`
  );

export type CreateLogParams = {
  uid: string;
  assignRentalItemId: number;
  category: LogCategory;
  quantity: number;
  memo?: string | null;
};

/** 記録を1件作成する。同じ uid の再送は API 側が冪等に扱う */
export const createItemRentalLog = (params: CreateLogParams) =>
  postToBff<{ id: number; uid: string }>("/api/rental/logs", params);

export type ExcessLendingParams = {
  uid: string;
  rentalItemId: number;
  stockerPlaceId: number;
  toGroupId: number;
  fromGroupId: number;
  quantity: number;
  // 渡す作業を行っている場所。渡す先に割当が無いときの貸出場所になる
  rentalPlaceId: number | null;
};

/**
 * 超過貸出。渡す団体に addition、元の団体に reduction を対で記録する。
 * API 側が1トランザクションで2件書くため、片方だけ残ることはない。
 * 同じ uid の再送は既存の対をそのまま返す。
 */
export const createExcessLending = (params: ExcessLendingParams) =>
  postToBff<{
    reduction: { id: number; uid: string };
    addition: { id: number; uid: string };
  }>("/api/rental/excess-lending", params);
