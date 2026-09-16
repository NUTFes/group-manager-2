// APIレスポンスの型。API は snake_case を返すが、クライアント側では
// camelcase-keys で変換した camelCase の形で扱う。

/** Rails API 共通のレスポンス封筒（ApplicationController#fmt） */
export type ApiResponse<T> = {
  status: {
    code: number;
    message: string;
    option?: string;
  };
  data: T;
};

export type WorkMode = "rental" | "return";

/** item_rental_logs.category。addition / reduction は割当変更の記録 */
export type LogCategory =
  | "rental"
  | "return"
  | "rental_absolute"
  | "return_absolute"
  | "addition"
  | "reduction";

export type RentalPlace = {
  id: number;
  name: string;
};

export type RentalGroup = {
  id: number;
  name: string;
};

export type ItemRentalLog = {
  id: number;
  uid: string;
  assignRentalItemId: number | null;
  groupId: number;
  rentalItemId: number;
  stockerPlaceId: number;
  category: LogCategory;
  quantity: number;
  memo: string | null;
  recorderEmail: string;
  createdAt: string;
};

export type AssignRentalItem = {
  id: number;
  groupId: number;
  groupName: string;
  rentalItemId: number;
  rentalItemName: string;
  stockerPlaceId: number | null;
  stockPlaceName: string;
  rentalPlaceId: number | null;
  rentalPlaceName: string;
  num: number;
  remark: string | null;
  itemRentalLogs: ItemRentalLog[];
};

export type AssignmentsResponse = {
  assignRentalItems: AssignRentalItem[];
  // addition / reduction は割当に紐づかないため別枠で返る（設計書5章）
  assignmentChangeLogs: ItemRentalLog[];
};

/**
 * QRから団体を特定したときにAPIが返す確定情報
 * （Group#to_confirmed_info_h。rental では団体の特定にしか使っていない）
 */
export type ConfirmedInfo = {
  group: {
    id: number;
    name: string;
    projectName: string | null;
    places: string[];
  };
  rentalItems: {
    rentalItemName: string;
    rentalPlaceName: string;
    stocks: { stockPlaceName: string; num: number }[];
  }[];
};
