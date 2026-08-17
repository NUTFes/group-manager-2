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

/**
 * GET /api/v1/get_all_rentable_items 等が返す貸出物品マスタ(snake_case)。
 * useAllRentableItems/useRentableItemsByType はこのレスポンスを camelcaseKeys で
 * 変換するため、is_inside_shop_rentable 等は実際には isInsideShopRentable として
 * 届く。にもかかわらず useRentItemsFormHooks 側は item.is_stage_rentable(snake_case)
 * のままアクセスしており、常に undefined になる
 * (BUG: 実行委員会/ステージ団体の is_stage_rentable フィルタは機能しない)。
 */
export type RentableItemRecord = {
  id: number;
  name: string;
  name_en?: string;
  is_inside_shop_rentable: boolean;
  is_outside_shop_rentable: boolean;
  is_stage_rentable: boolean;
  created_at: string;
  updated_at: string;
};

const rentableItemTimestamps = {
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

/** RentItemsForm/schema.ts の ITEM_IDS と対応する。 */
export const RENTABLE_ITEM_IDS = {
  table: 1,
  longTable: 2,
  chair: 3,
  partition: 4,
  partitionLeg: 5,
  displayBoard: 6,
  tent: 7,
} as const;

export const defaultRentableItems: RentableItemRecord[] = [
  {
    id: RENTABLE_ITEM_IDS.table,
    name: 'E2E テーブル',
    is_inside_shop_rentable: true,
    is_outside_shop_rentable: true,
    is_stage_rentable: false,
    ...rentableItemTimestamps,
  },
  {
    id: RENTABLE_ITEM_IDS.chair,
    name: 'E2E 椅子',
    is_inside_shop_rentable: true,
    is_outside_shop_rentable: true,
    is_stage_rentable: false,
    ...rentableItemTimestamps,
  },
];

/**
 * GET /rental_orders/group/:id が返す物品申請レコード(snake_case)。
 * 作成/更新は legacyPost/PatchFetcher 経由だが、rentItemsApi.ts の呼び出し側は
 * query ではなく body だけを渡すため(他の legacy 群と異なり)、
 * JSONボディ(既に snake_case)がそのまま届く。
 */
export type RentalOrderRecord = {
  id: number;
  group_id: number;
  rental_item_id: number;
  num: number;
  created_at: string;
  updated_at: string;
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

/**
 * GET /stage_orders?group_id=:id が返すステージ申請レコード(snake_case)。
 * 晴天/雨天で1件ずつ(is_sunny で区別)存在しうる。
 * 作成/更新は useApiMutations(独自実装の postData/putData)経由のJSONボディで、
 * legacy 系と違い camelCase ではなく素の snake_case のまま送られる
 * (snakecaseKeysを通すが、送信側の baseOrderData が元々snake_caseキーのため実質no-op)。
 */
export type StageOrderRecord = {
  id: number;
  group_id: number;
  fes_date_id: number;
  is_sunny: boolean;
  stage_first: number;
  stage_second: number;
  use_time_interval: string;
  prepare_time_interval: string;
  cleanup_time_interval: string;
};

/** GET /api/v1/get_current_fes_dates が返す開催日(snake_case)。 */
export type FesDateRecord = {
  id: number;
  days_num: number;
  date: string;
  day: string;
};

/** GET /sunny/stages, GET /rainy/stages が返すステージ候補。 */
export type StageRecord = {
  id: number;
  name: string;
};

export const defaultFesDates: FesDateRecord[] = [
  { id: 1, days_num: 1, date: '2026-09-19', day: '土' },
  { id: 2, days_num: 2, date: '2026-09-20', day: '日' },
];

export const defaultSunnyStages: StageRecord[] = [
  { id: 101, name: '晴れ A ステージ' },
  { id: 102, name: '晴れ B ステージ' },
];

export const defaultRainyStages: StageRecord[] = [
  { id: 201, name: '雨天 A ステージ' },
  { id: 202, name: '雨天 B ステージ' },
];

/** src/api/unRegisteredGroupApi.ts の ORDER_TYPES と対応する。 */
export const ORDER_TYPES = {
  rentalItem: 0,
  power: 1,
  subRep: 2,
  employee: 3,
  fireEquipment: 4,
} as const;

/**
 * GET /employees/group/:id が返す従業員(snake_case)。
 * 作成/更新/削除は @/hooks/useApi.ts の useAuthenticated* 系(JSONボディ)経由。
 * student_id はフォーム上は文字列(8桁)だが、DBは数値で返す
 * (EmployeesFrom/hooks.ts の convertEmployeesToFormData が String() で変換する前提のため)。
 */
export type EmployeeRecord = {
  id: number;
  group_id: number;
  name: string;
  student_id: number;
  stool_test_id: number;
  created_at: string;
  updated_at: string;
};

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

/** GET /public_relations/group/:id が返すPR文申請レコード(snake_case)。 */
export type PublicRelationRecord = {
  id: number;
  group_id: number;
  blurb: string;
  picture_name: string;
  picture_path: string;
  is_announcement_requested: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * GET /venue_maps/group/:id が返す模擬店平面図申請レコード(snake_case)。
 * VenueMapResponse には checklist は含まれない(バックエンドに保存されない)ため、
 * 編集時も毎回チェックリストの再チェックが必要になる。
 */
export type VenueMapRecord = {
  id: number;
  group_id: number;
  picture_name: string;
  picture_path: string;
  created_at: string;
  updated_at: string;
};

/**
 * GET /food_products/group/:id が返す販売品(snake_case)。
 * 調理工程申請は isCooking な販売品ごとに1件対応するため、
 * 空配列だと調理工程申請の入力欄自体が出ず警告文だけになる。
 */
export type FoodProductRecord = {
  id: number;
  group_id: number;
  name: string;
  is_cooking: boolean;
  first_day_num: number;
  second_day_num: number;
  is_alcohol: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * GET /shops が返す購入品申請の店舗マスタ(snake_case)。
 * src/components/Applications/PurchaseLists/constants.ts の
 * NET_ORDER_SHOP_ID(998)/OTHER_SHOP_ID(999) と対応する特殊な店舗IDを含む
 * (これらのIDを選ぶと購入品フォームのURL/備考の必須条件が変わる)。
 */
export type ShopRecord = {
  id: number;
  name: string;
  tel: string;
  opening_hours: string;
  address: string;
  created_at: string;
  updated_at: string;
};

/** src/components/Applications/PurchaseLists/constants.ts の特殊な店舗IDと対応する。 */
export const SHOP_IDS = {
  regular: 1,
  netOrder: 998,
  other: 999,
} as const;

const shopTimestamps = {
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

export const defaultShops: ShopRecord[] = [
  {
    id: SHOP_IDS.regular,
    name: 'E2E 商店',
    tel: '0258-00-0000',
    opening_hours: '9:00-18:00',
    address: 'E2E市1-1-1',
    ...shopTimestamps,
  },
  {
    id: SHOP_IDS.netOrder,
    name: 'ネット注文',
    tel: '',
    opening_hours: '',
    address: '',
    ...shopTimestamps,
  },
  {
    id: SHOP_IDS.other,
    name: 'その他',
    tel: '',
    opening_hours: '',
    address: '',
    ...shopTimestamps,
  },
];

/**
 * GET /purchase_lists/food_product が返す購入品申請レコード(snake_case)。
 * 販売品(FoodProduct)に紐づく。作成/更新/削除は @/hooks/useApi.ts の
 * useAuthenticated* 系(JSONボディ、snakecase-keysで変換)経由。
 * usePurchaseListsForm は送信件数で作成/更新APIを切り替える
 * (1件: POST /purchase_lists または PATCH /purchase_lists/:id、
 *  2件以上: 常に POST /purchase_lists/upsert)。
 */
export type PurchaseListRecord = {
  id: number;
  group_id?: number;
  food_product_id: number;
  shop_id: number;
  fes_date_id: number;
  items: string;
  is_fresh: boolean;
  purchase_date: string;
  url?: string | null;
  remark?: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * GET /cooking_process_orders/group/:id が返す調理工程申請レコード(snake_case)。
 * useGetCookingProcessOrder は status.code を見ず data.data の中身だけで判定するため、
 * 他群のような apiNotFound() 表現は使わない(stageOrders と同じパターン)。
 */
export type CookingProcessOrderRecord = {
  id: number;
  group_id: number;
  food_product_id: number;
  pre_open_kitchen: boolean;
  during_open_kitchen: boolean;
  tent: string;
  tent_ja: string | null;
  created_at: string;
  updated_at: string;
};

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
  /**
   * true の間だけ PUT /fire_equipment_orders/submit をHTTP 500で失敗させる。
   * この群は submitFireEquipmentOrders() が throw せず {success:false} を返す契約のため、
   * 失敗時にトーストが何回出るかを実際に確かめるためのフラグ。
   */
  forceFireEquipmentSubmitError: boolean;
  /** null は未登録。GET は status.code 404 を返し、アプリ側は undefined として扱う。 */
  stageOption: StageOptionRecord | null;
  /** ステージ申請のマスターデータ。既定値は defaultFesDates/defaultSunnyStages/defaultRainyStages。 */
  fesDates: FesDateRecord[];
  sunnyStages: StageRecord[];
  rainyStages: StageRecord[];
  /**
   * ステージ申請。晴天/雨天それぞれ0〜1件。空配列は未登録。
   * useGetStageOrders は status.code を見ず data.data の中身だけで判定するため、
   * 他群のような apiNotFound() 表現は使わない。
   */
  stageOrders: StageOrderRecord[];
  places: PlaceRecord[];
  placeOrder: PlaceOrderRecord | null;
  viceRepresentative: ViceRepresentativeRecord | null;
  /** GET /employees/group/:id が返す従業員。空配列は未登録。 */
  employees: EmployeeRecord[];
  /** true の間だけ POST/PATCH /employees, /employees/upsert をHTTP 500で失敗させる。 */
  forceEmployeeSubmitError: boolean;
  /** null は未登録。GET は status.code 404 を返し、アプリ側は undefined として扱う。 */
  publicRelation: PublicRelationRecord | null;
  /** true の間だけ POST/PATCH /public_relations をHTTP 500で失敗させる(二重トースト検証用)。 */
  forcePublicRelationSubmitError: boolean;
  /** null は未登録。GET は status.code 404 を返し、アプリ側は undefined として扱う。 */
  venueMap: VenueMapRecord | null;
  /** true の間だけ POST/PATCH /venue_maps をHTTP 500で失敗させる(二重トースト検証用)。 */
  forceVenueMapSubmitError: boolean;
  /** GET /food_products/group/:id が返す販売品。既定は空(調理工程申請は警告文になる)。 */
  foodProducts: FoodProductRecord[];
  /** GET /cooking_process_orders/group/:id が返す調理工程申請。空配列は未登録。 */
  cookingProcessOrders: CookingProcessOrderRecord[];
  /** GET /shops が返す購入品申請の店舗マスタ。既定は defaultShops。 */
  shops: ShopRecord[];
  /** GET /purchase_lists/food_product が返す購入品リスト。空配列は未登録。 */
  purchaseLists: PurchaseListRecord[];
  /** GET /api/v1/get_all_rentable_items 等が返す貸出物品マスタ。既定は defaultRentableItems。 */
  rentableItems: RentableItemRecord[];
  /** GET /rental_orders/group/:id が返す物品申請。空配列は未登録。 */
  rentalOrders: RentalOrderRecord[];
  /** true の間だけ Imgur アップロードをHTTP 500で失敗させる。 */
  forceImgurUploadError: boolean;
  /** Imgur へのアップロードリクエスト回数。 */
  imgurUploadCount: number;
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
  forceFireEquipmentSubmitError: false,
  stageOption: null,
  fesDates: defaultFesDates,
  sunnyStages: defaultSunnyStages,
  rainyStages: defaultRainyStages,
  stageOrders: [],
  places: defaultPlaces,
  placeOrder: null,
  viceRepresentative: null,
  employees: [],
  forceEmployeeSubmitError: false,
  publicRelation: null,
  forcePublicRelationSubmitError: false,
  venueMap: null,
  forceVenueMapSubmitError: false,
  foodProducts: [],
  cookingProcessOrders: [],
  shops: defaultShops,
  purchaseLists: [],
  rentableItems: defaultRentableItems,
  rentalOrders: [],
  forceImgurUploadError: false,
  imgurUploadCount: 0,
  requestedUrls: [],
});
