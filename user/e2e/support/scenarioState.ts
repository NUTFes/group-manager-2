// Applications 配下のE2Eで共有するシナリオ状態。
// モックサーバ(mockServer.ts)が可変の疑似バックエンドとしてこのオブジェクトを読み書きする。

export const mockUser = {
  id: 1001,
  name: 'e2e user',
  email: 'e2e-ui@example.com',
};

export const mockGroupId = 2001;

/**
 * GET /groups/:id が返す団体申請本体のレコード(snake_case)。
 * Group は他の申請と違いページ全体の登録判定(check_all_registered.group)を握るため、
 * scenarioState() の既定値では「登録済み」にしておく(既定を未登録にすると、
 * Group を意識していない他の spec が軒並み isGroupRegistered=false で落ちてしまう)。
 * 未登録シナリオを作りたいテストだけ state.group = null を上書きする。
 */
export type GroupRecord = {
  id: number;
  name: string;
  project_name: string;
  activity: string;
  user_id: number;
  group_category_id: number;
  fes_year_id: number;
  is_international: boolean;
  committee: boolean;
  is_external: boolean;
  created_at: string;
  updated_at: string;
};

/** GET /group_categories が返す参加形式一覧。 */
export type GroupCategoryRecord = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

const groupCategoryTimestamps = {
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

/** src/utils/constants.ts の GROUP_CATEGORY と対応する。 */
export const defaultGroupCategories: GroupCategoryRecord[] = [
  { id: 1, name: '食品販売', ...groupCategoryTimestamps },
  { id: 2, name: '物品販売', ...groupCategoryTimestamps },
  { id: 3, name: 'ステージ', ...groupCategoryTimestamps },
  { id: 4, name: '展示・体験', ...groupCategoryTimestamps },
  { id: 5, name: '研究室公開', ...groupCategoryTimestamps },
  { id: 6, name: '実行委員会', ...groupCategoryTimestamps },
  { id: 7, name: 'その他', ...groupCategoryTimestamps },
];

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

/** src/api/unRegisteredGroupApi.ts の ORDER_TYPES と対応する。 */
export const ORDER_TYPES = {
  rentalItem: 0,
  power: 1,
  subRep: 2,
  employee: 3,
  fireEquipment: 4,
} as const;

/** GET /sub_reps/group/:id が返す副代表。 */
export type ViceRepresentativeRecord = {
  id: number;
  group_id: number;
  name: string;
  student_id: number;
  grade_id: number;
  department_id: number;
  email: string;
  tel: string;
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
  /** null は未登録。既定は登録済み(理由は GroupRecord のコメントを参照)。 */
  group: GroupRecord | null;
  groupCategories: GroupCategoryRecord[];
  /**
   * requestedUrls は書き込み系リクエストしか記録しないため、
   * mutateGroups 等(props由来の本物のmutate)が実際にGETを再発火させたかを
   * 数えるための専用カウンタ。他のspecはこのフィールドを参照しないため、
   * ここへの加算が既存specの assert に影響することはない。
   */
  groupFetchCounts: {
    groups: number;
    groupByUserId: number;
    checkAllRegistered: number;
  };
  /** true の間だけ POST/PATCH /groups をHTTP 500で失敗させる(失敗トースト検証用)。 */
  forceGroupSubmitError: boolean;
  /**
   * GET /groups/:id の応答を意図的に遅らせるミリ秒。
   * GroupForm が団体データ到着前にマウントされる経路を決定的に再現するために使う
   * (既定の 0 だと到着が速すぎて、どちらの経路を通るかが実行ごとに変わる)。
   */
  groupFetchDelayMs: number;
  fireEquipmentPermissions: {
    canAdd: boolean;
    canEdit: boolean;
  };
  /** 「申請しない」を登録済みの申請種別(ORDER_TYPES の値)。 */
  unregisteredOrderTypes: number[];
  statuses: Record<SubmissionApplicationType, SubmissionStatusValue>;
  powerOrders: PowerOrder[];
  fireEquipmentOrders: FireEquipmentOrder[];
  /** null は未登録。GET は status.code 404 を返し、アプリ側は undefined として扱う。 */
  stageOption: StageOptionRecord | null;
  places: PlaceRecord[];
  placeOrder: PlaceOrderRecord | null;
  viceRepresentative: ViceRepresentativeRecord | null;
  /** モックサーバが受け取った書き込み系リクエストのパス。送信後の再検証をassertするために使う。 */
  requestedUrls: string[];
};

export const scenarioState = (pageMode: PageMode): ScenarioState => ({
  pageMode,
  groupCategoryId: 1,
  group: {
    id: mockGroupId,
    name: 'E2Eテスト団体',
    project_name: 'E2Eテスト企画',
    activity: 'E2Eテスト企画内容',
    user_id: mockUser.id,
    group_category_id: 1,
    fes_year_id: 1,
    is_international: false,
    committee: false,
    is_external: false,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  groupCategories: defaultGroupCategories,
  groupFetchCounts: {
    groups: 0,
    groupByUserId: 0,
    checkAllRegistered: 0,
  },
  forceGroupSubmitError: false,
  groupFetchDelayMs: 0,
  fireEquipmentPermissions: {
    canAdd: pageMode === 'registration',
    canEdit: pageMode === 'registration',
  },
  unregisteredOrderTypes: [],
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
  viceRepresentative: null,
  requestedUrls: [],
});
