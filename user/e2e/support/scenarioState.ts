// Applications 配下のE2Eで共有するシナリオ状態。
// モックサーバ(mockServer.ts)が可変の疑似バックエンドとしてこのオブジェクトを読み書きする。

export const mockUser = {
  id: 1001,
  name: 'e2e user',
  email: 'e2e-ui@example.com',
};

export const mockGroupId = 2001;

export type SubmissionStatusValue =
  | 'unapproved'
  | 'waiting_resubmission'
  | 'approved'
  | 'unsubmitted';

export const submissionApplicationTypes = [
  'equipment',
  'employee',
  'food_product',
  'purchase_list',
  'venue_map',
  'cooking_process_order',
  'power_order',
  'fire_equipment_order',
] as const;

export type SubmissionApplicationType =
  (typeof submissionApplicationTypes)[number];

export type PowerOrder = {
  id: number;
  group_id: number;
  item: string;
  power: number;
  manufacturer: string;
  model: string;
  item_url: string;
};

export type FireEquipmentOrder = {
  id: number;
  group_id: number;
  name: string;
  quantity: number;
  fuel: 'gas_bottle' | 'lp_gas' | 'charcoal';
  usage: string;
  is_takeaway: boolean;
  remark: string;
};

export type FireEquipmentBody = {
  id?: number;
  group_id?: number;
  name?: string;
  quantity?: number;
  fuel?: number | FireEquipmentOrder['fuel'];
  usage?: string;
  is_takeaway?: boolean;
  remark?: string;
};

/** GET /stage_common_options/group/:id が返すレコード(snake_case)。 */
export type StageOptionRecord = {
  id: number;
  group_id: number;
  own_equipment: boolean;
  bgm: boolean;
  camera_permission: boolean;
  loud_sound: boolean;
};

/** GET /places?group_id=:id が返す会場候補。 */
export type PlaceRecord = {
  id: number;
  name: string;
};

/** GET /place_orders/group/:id が返す会場申請。 */
export type PlaceOrderRecord = {
  id: number;
  group_id: number;
  first: number;
  second: number;
  third: number;
  remark: string;
};

/** schema.ts の DEFAULT_ID(未選択) と OTHER_OPTION_ID(その他=備考必須) に対応する。 */
export const PLACE_IDS = {
  unselected: 1,
  gym1: 2,
  gym2: 3,
  courtyard: 4,
  other: 11,
} as const;

export const defaultPlaces: PlaceRecord[] = [
  { id: PLACE_IDS.unselected, name: '未選択' },
  { id: PLACE_IDS.gym1, name: '第1体育館' },
  { id: PLACE_IDS.gym2, name: '第2体育館' },
  { id: PLACE_IDS.courtyard, name: '中庭' },
  { id: PLACE_IDS.other, name: 'その他' },
];

export type PageMode = 'registration' | 'resubmission' | 'closed';

export type ScenarioState = {
  pageMode: PageMode;
  groupCategoryId: number;
  fireEquipmentPermissions: {
    canAdd: boolean;
    canEdit: boolean;
  };
  hasUnregisteredFireEquipment: boolean;
  statuses: Record<SubmissionApplicationType, SubmissionStatusValue>;
  powerOrders: PowerOrder[];
  fireEquipmentOrders: FireEquipmentOrder[];
  /** null は未登録。GET は status.code 404 を返し、アプリ側は undefined として扱う。 */
  stageOption: StageOptionRecord | null;
  places: PlaceRecord[];
  placeOrder: PlaceOrderRecord | null;
  /** モックサーバが受け取った書き込み系リクエストのパス。送信後の再検証をassertするために使う。 */
  requestedUrls: string[];
};

export const scenarioState = (pageMode: PageMode): ScenarioState => ({
  pageMode,
  groupCategoryId: 1,
  fireEquipmentPermissions: {
    canAdd: pageMode === 'registration',
    canEdit: pageMode === 'registration',
  },
  hasUnregisteredFireEquipment: false,
  statuses: {
    equipment: 'unsubmitted',
    employee: 'unsubmitted',
    food_product: 'unsubmitted',
    purchase_list: 'unsubmitted',
    venue_map: 'unsubmitted',
    cooking_process_order: 'unsubmitted',
    power_order:
      pageMode === 'resubmission'
        ? 'waiting_resubmission'
        : pageMode === 'closed'
          ? 'unapproved'
          : 'unsubmitted',
    fire_equipment_order:
      pageMode === 'resubmission'
        ? 'waiting_resubmission'
        : pageMode === 'closed'
          ? 'unapproved'
          : 'unsubmitted',
  },
  powerOrders:
    pageMode !== 'registration'
      ? [
          {
            id: 4001,
            group_id: mockGroupId,
            item: 'E2E ホットプレート',
            power: 800,
            manufacturer: 'E2E Maker',
            model: 'E2E-800',
            item_url: 'https://example.com/power',
          },
        ]
      : [],
  fireEquipmentOrders:
    pageMode !== 'registration'
      ? [
          {
            id: 5001,
            group_id: mockGroupId,
            name: 'E2E バーナー',
            quantity: 1,
            fuel: 'gas_bottle',
            usage: 'E2E 調理',
            is_takeaway: true,
            remark: 'E2E 備考',
          },
        ]
      : [],
  stageOption: null,
  places: defaultPlaces,
  placeOrder: null,
  requestedUrls: [],
});
