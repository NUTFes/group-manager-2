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

/** その作業場所に割当がある今年度の団体 */
export const useRentalGroups = (rentalPlaceId: number | null) =>
  useSWR<RentalGroup[]>(
    rentalPlaceId ? `/api/rental/groups?rentalPlaceId=${rentalPlaceId}` : null,
    bffFetcher,
    SWR_OPTIONS
  );

/** 割当（名前付き）と記録。団体未指定なら作業場所全体を取る */
export const useAssignments = (
  rentalPlaceId: number | null,
  groupId: number | null
) => {
  const params = new URLSearchParams();
  if (rentalPlaceId) params.set("rentalPlaceId", String(rentalPlaceId));
  if (groupId) params.set("groupId", String(groupId));

  return useSWR<AssignmentsResponse>(
    rentalPlaceId || groupId
      ? `/api/rental/assignments?${params.toString()}`
      : null,
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
};

/** 超過貸出。渡す団体に addition、元の団体に reduction を対で記録する */
export const createExcessLending = (params: ExcessLendingParams) =>
  postToBff<{ id: number; uid: string }>("/api/rental/excess-lending", params);
