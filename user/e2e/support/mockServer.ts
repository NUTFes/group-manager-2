// ホーム画面(/home)が叩くAPIを丸ごとモックする疑似バックエンド。
//
// page.route('**/*') の単一ハンドラに巨大な if 連鎖を書くのではなく、
// ドメインごとの MockHandler を配列に並べ、最初に true を返したものが応答する。
// 申請機能を増やすときはハンドラを1つ足して handlers に追加する。
import type { Page, Route } from '@playwright/test';
import {
  apiNotFound,
  apiResponse,
  checkAllRegistered,
  employeeFromBody,
  fireEquipmentFromBody,
  foodProductFromBody,
  fulfillJson,
  powerOrderFromBody,
  purchaseListFromBody,
  submission,
  userPageSettings,
} from './fixtures';
import {
  type CookingProcessOrderRecord,
  type FireEquipmentBody,
  type GroupRecord,
  type PlaceOrderRecord,
  type PowerOrder,
  type PublicRelationRecord,
  type RentalOrderRecord,
  type ScenarioState,
  type StageOptionRecord,
  type StageOrderRecord,
  type SubmissionApplicationType,
  type SubmissionStatusValue,
  type VenueMapRecord,
  type ViceRepresentativeRecord,
  mockGroupId,
  mockUser,
  submissionApplicationTypes,
} from './scenarioState';

/** 1x1 の透明PNG。Next Image Optimizer の実ネットワークアクセスを避けるためのダミー画像。 */
const TRANSPARENT_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

export type MockContext = {
  route: Route;
  /** リクエストの絶対URL */
  url: string;
  /** pathname + search */
  path: string;
  /** search を含まない pathname */
  pathname: string;
  /** クエリ文字列。legacy フェッチャは本文ではなくクエリに値を載せる点に注意。 */
  query: URLSearchParams;
  method: string;
  state: ScenarioState;
};

/** 応答したら true、担当外なら false を返す。 */
export type MockHandler = (ctx: MockContext) => Promise<boolean>;

/**
 * Imgur への画像アップロード(PublicRelationsForm/hooks.ts が直接 fetch する外部URL)。
 * page.route('**\/*') はページが発行するリクエストなら外部ドメインも捕まえられるため、
 * ここでモックして実ネットワークへのアップロードを避ける。
 */
const imgurHandler: MockHandler = async ({ route, url, method, state }) => {
  if (method === 'POST' && url.startsWith('https://api.imgur.com/3/image')) {
    state.imgurUploadCount += 1;
    if (state.forceImgurUploadError) {
      await route.fulfill({ status: 500, body: 'e2e forced imgur failure' });
      return true;
    }
    await fulfillJson(route, {
      data: { link: 'https://i.imgur.com/e2e-mock.png' },
      success: true,
      status: 200,
    });
    return true;
  }

  return false;
};

/**
 * next/image の最適化エンドポイント。放置すると元画像(Imgurの実URL)へ
 * サーバサイドで実ネットワークアクセスしてしまうため、ダミー画像で埋めて避ける。
 */
const nextImageOptimizerHandler: MockHandler = async ({
  route,
  pathname,
  method,
}) => {
  if (method === 'GET' && pathname === '/_next/image') {
    await route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: Buffer.from(TRANSPARENT_PNG_BASE64, 'base64'),
    });
    return true;
  }

  return false;
};

const authHandler: MockHandler = async ({ route, url }) => {
  if (url.includes('/api/auth/session')) {
    await fulfillJson(route, {
      user: {
        name: mockUser.name,
        email: mockUser.email,
      },
      expires: '2099-01-01T00:00:00.000Z',
      accessToken: 'e2e-access-token',
      client: 'e2e-client',
      uid: mockUser.email,
    });
    return true;
  }

  if (url.endsWith('/api/getUser')) {
    await fulfillJson(route, {
      id: String(mockUser.id),
      name: mockUser.name,
      email: mockUser.email,
    });
    return true;
  }

  return false;
};

/**
 * 団体申請本体。作成/更新は legacy フェッチャ経由で、値は snake_case のクエリ文字列で届く。
 * Group は check_all_registered.group を握るページ全体のゲートでもあるため、
 * /groups/user/:id と /groups/:id の2つのGETを別々に持つ。
 */
const groupFromQuery = (id: number, query: URLSearchParams): GroupRecord => ({
  id,
  name: query.get('name') ?? '',
  project_name: query.get('project_name') ?? '',
  activity: query.get('activity') ?? '',
  user_id: Number(query.get('user_id') ?? mockUser.id),
  group_category_id: Number(query.get('group_category_id') ?? 1),
  fes_year_id: Number(query.get('fes_year_id') ?? 1),
  is_international: query.get('is_international') === 'true',
  committee: query.get('committee') === '1',
  is_external: query.get('is_external') === 'true',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
});

const groupHandler: MockHandler = async ({
  route,
  path,
  pathname,
  query,
  method,
  state,
}) => {
  if (path === `/groups/user/${mockUser.id}`) {
    state.groupFetchCounts.groupByUserId += 1;
    await fulfillJson(
      route,
      apiResponse({
        id: mockGroupId,
        user_id: mockUser.id,
        group_category_id: state.groupCategoryId,
      })
    );
    return true;
  }

  if (path === '/user_page_settings') {
    await fulfillJson(route, apiResponse(userPageSettings(state)));
    return true;
  }

  if (path === `/check_all_registered/${mockGroupId}`) {
    state.groupFetchCounts.checkAllRegistered += 1;
    await fulfillJson(route, apiResponse(checkAllRegistered(state)));
    return true;
  }

  if (method === 'GET' && pathname === '/group_categories') {
    await fulfillJson(route, apiResponse(state.groupCategories));
    return true;
  }

  if (method === 'GET' && pathname === `/groups/${mockGroupId}`) {
    state.groupFetchCounts.groups += 1;
    if (state.groupFetchDelayMs > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, state.groupFetchDelayMs)
      );
    }
    await fulfillJson(
      route,
      state.group ? apiResponse(state.group) : apiNotFound()
    );
    return true;
  }

  if (method === 'POST' && pathname === '/groups') {
    state.requestedUrls.push(pathname);
    if (state.forceGroupSubmitError) {
      await route.fulfill({ status: 500, body: 'e2e forced failure' });
      return true;
    }
    state.group = groupFromQuery(mockGroupId, query);
    await fulfillJson(route, apiResponse(state.group));
    return true;
  }

  if (method === 'PATCH' && /^\/groups\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    if (state.forceGroupSubmitError) {
      await route.fulfill({ status: 500, body: 'e2e forced failure' });
      return true;
    }
    state.group = groupFromQuery(Number(pathname.split('/').at(-1)), query);
    await fulfillJson(route, apiResponse(state.group));
    return true;
  }

  return false;
};

const submissionStatusHandler: MockHandler = async ({
  route,
  path,
  method,
  state,
}) => {
  if (path === `/health_center_submission_statuses?group_id=${mockGroupId}`) {
    await fulfillJson(
      route,
      apiResponse({
        submissions: submissionApplicationTypes.map((applicationType, index) =>
          submission(
            applicationType,
            3001 + index,
            state.statuses[applicationType]
          )
        ),
      })
    );
    return true;
  }

  if (method === 'POST' && path === '/health_center_submission_statuses') {
    state.requestedUrls.push(path);
    const body = (await route.request().postDataJSON()) as {
      application_type: SubmissionApplicationType;
      status: SubmissionStatusValue;
    };
    state.statuses[body.application_type] = body.status;
    await fulfillJson(
      route,
      apiResponse(submission(body.application_type, 3001, body.status))
    );
    return true;
  }

  if (
    method === 'PATCH' &&
    /^\/health_center_submission_statuses\/\d+$/.test(path)
  ) {
    state.requestedUrls.push(path);
    const id = Number(path.split('/').at(-1));
    const body = (await route.request().postDataJSON()) as {
      status: SubmissionStatusValue;
    };
    const applicationType = submissionApplicationTypes[id - 3001];
    state.statuses[applicationType] = body.status;
    await fulfillJson(
      route,
      apiResponse(submission(applicationType, id, body.status))
    );
    return true;
  }

  return false;
};

const powerHandler: MockHandler = async ({ route, path, method, state }) => {
  if (method === 'GET' && path === `/power_orders/group/${mockGroupId}`) {
    await fulfillJson(route, apiResponse(state.powerOrders));
    return true;
  }

  if (method === 'POST' && path === '/power_orders') {
    state.requestedUrls.push(path);
    const body = (await route.request().postDataJSON()) as Partial<PowerOrder>;
    const powerOrder = powerOrderFromBody(body, 4101);
    state.powerOrders = [powerOrder];
    await fulfillJson(route, apiResponse(powerOrder));
    return true;
  }

  if (method === 'PUT' && /^\/power_orders\/\d+$/.test(path)) {
    state.requestedUrls.push(path);
    const body = (await route.request().postDataJSON()) as Partial<PowerOrder>;
    const id = Number(path.split('/').at(-1));
    const powerOrder = powerOrderFromBody(body, id);
    state.powerOrders = [powerOrder];
    await fulfillJson(route, apiResponse(powerOrder));
    return true;
  }

  if (method === 'PUT' && path === '/power_orders/submit') {
    state.requestedUrls.push(path);
    const body = (await route.request().postDataJSON()) as {
      use_power: boolean;
      power_orders: Partial<PowerOrder>[];
    };
    if (body.use_power) {
      state.powerOrders = body.power_orders.map((powerOrder, index) => ({
        id: powerOrder.id ?? 4101 + index,
        group_id: powerOrder.group_id ?? mockGroupId,
        item: powerOrder.item ?? '',
        power: powerOrder.power ?? 0,
        manufacturer: powerOrder.manufacturer ?? '',
        model: powerOrder.model ?? '',
        item_url: powerOrder.item_url ?? '',
      }));
    } else {
      state.powerOrders = [];
    }
    state.statuses.power_order = 'unapproved';
    await fulfillJson(route, apiResponse(state.powerOrders[0]));
    return true;
  }

  if (method === 'DELETE' && /^\/power_orders\/\d+$/.test(path)) {
    state.requestedUrls.push(path);
    state.powerOrders = state.powerOrders.filter(
      (powerOrder) => powerOrder.id !== Number(path.split('/').at(-1))
    );
    await fulfillJson(route, apiResponse([]));
    return true;
  }

  return false;
};

/** 「この申請はしない」マーカー。申請種別(order_type)ごとに0件か1件を返す。 */
const unregisteredGroupId = (orderType: number) => 6000 + orderType;

const unregisteredGroupHandler: MockHandler = async ({
  route,
  pathname,
  query,
  method,
  state,
}) => {
  if (method === 'GET' && pathname === '/un_registered_groups/group') {
    const orderType = Number(query.get('order_type'));
    const isUnregistered = state.unregisteredOrderTypes.includes(orderType);
    await fulfillJson(
      route,
      apiResponse(
        isUnregistered
          ? [
              {
                id: unregisteredGroupId(orderType),
                group_id: Number(query.get('group_id') ?? mockGroupId),
                order_type: orderType,
                created_at: '2026-01-01T00:00:00.000Z',
                updated_at: '2026-01-01T00:00:00.000Z',
              },
            ]
          : []
      )
    );
    return true;
  }

  if (method === 'POST' && pathname === '/un_registered_groups') {
    state.requestedUrls.push(pathname);
    // RentItems(rentItemsApi.ts)専用の useRegisterUnRegisteredGroup だけは
    // { un_registered_group: { group_id, order_type } } とネストしたボディを送る
    // (他群の useMutateUnregisteredGroup はフラットな { group_id, order_type })。
    const body = (await route.request().postDataJSON()) as {
      order_type?: number;
      un_registered_group?: { order_type?: number };
    };
    const orderType = Number(
      body?.order_type ?? body?.un_registered_group?.order_type ?? -1
    );
    if (orderType >= 0 && !state.unregisteredOrderTypes.includes(orderType)) {
      state.unregisteredOrderTypes.push(orderType);
    }
    await fulfillJson(route, apiResponse([]));
    return true;
  }

  if (method === 'DELETE' && pathname === '/un_registered_groups') {
    state.requestedUrls.push(pathname);
    await fulfillJson(route, apiResponse([]));
    return true;
  }

  if (method === 'DELETE' && /^\/un_registered_groups\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    const id = Number(pathname.split('/').at(-1));
    state.unregisteredOrderTypes = state.unregisteredOrderTypes.filter(
      (orderType) => unregisteredGroupId(orderType) !== id
    );
    await fulfillJson(route, apiResponse([]));
    return true;
  }

  return false;
};

/**
 * 副代表申請。作成/更新は legacy フェッチャ経由で値はクエリに載る。
 * 「一人で参加」を選ぶと副代表を削除するが、未登録時は id が undefined のまま
 * DELETE /sub_reps/undefined が飛ぶため、数値以外の id も受け付ける。
 */
const viceRepresentativeHandler: MockHandler = async ({
  route,
  pathname,
  query,
  method,
  state,
}) => {
  if (method === 'GET' && pathname === `/sub_reps/group/${mockGroupId}`) {
    await fulfillJson(
      route,
      state.viceRepresentative
        ? apiResponse(state.viceRepresentative)
        : apiNotFound()
    );
    return true;
  }

  const viceRepresentativeFromQuery = (
    id: number
  ): ViceRepresentativeRecord => ({
    id,
    group_id: Number(query.get('group_id') ?? mockGroupId),
    name: query.get('name') ?? '',
    student_id: Number(query.get('student_id') ?? 0),
    grade_id: Number(query.get('grade_id') ?? 0),
    department_id: Number(query.get('department_id') ?? 0),
    email: query.get('email') ?? '',
    tel: query.get('tel') ?? '',
  });

  if (method === 'POST' && pathname === '/sub_reps') {
    state.requestedUrls.push(pathname);
    state.viceRepresentative = viceRepresentativeFromQuery(9001);
    await fulfillJson(route, apiResponse(state.viceRepresentative));
    return true;
  }

  if (method === 'PATCH' && /^\/sub_reps\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    state.viceRepresentative = viceRepresentativeFromQuery(
      Number(pathname.split('/').at(-1))
    );
    await fulfillJson(route, apiResponse(state.viceRepresentative));
    return true;
  }

  if (method === 'DELETE' && /^\/sub_reps\/[^/]+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    state.viceRepresentative = null;
    await fulfillJson(route, apiResponse([]));
    return true;
  }

  return false;
};

const fireEquipmentHandler: MockHandler = async ({
  route,
  path,
  method,
  state,
}) => {
  if (
    method === 'GET' &&
    path === `/fire_equipment_orders/group/${mockGroupId}`
  ) {
    await fulfillJson(route, apiResponse(state.fireEquipmentOrders));
    return true;
  }

  if (method === 'POST' && path === '/fire_equipment_orders') {
    state.requestedUrls.push(path);
    const body = (await route.request().postDataJSON()) as FireEquipmentBody;
    state.fireEquipmentOrders = [fireEquipmentFromBody(body, 5101)];
    await fulfillJson(route, apiResponse(state.fireEquipmentOrders[0]));
    return true;
  }

  if (method === 'PATCH' && /^\/fire_equipment_orders\/\d+$/.test(path)) {
    state.requestedUrls.push(path);
    const body = (await route.request().postDataJSON()) as FireEquipmentBody;
    const id = Number(path.split('/').at(-1));
    state.fireEquipmentOrders = [fireEquipmentFromBody(body, id)];
    await fulfillJson(route, apiResponse(state.fireEquipmentOrders[0]));
    return true;
  }

  if (method === 'PUT' && path === '/fire_equipment_orders/submit') {
    state.requestedUrls.push(path);
    if (state.forceFireEquipmentSubmitError) {
      await route.fulfill({ status: 500, body: 'e2e forced failure' });
      return true;
    }
    const body = (await route.request().postDataJSON()) as {
      fire_equipment_orders: FireEquipmentBody[];
    };
    state.fireEquipmentOrders = body.fire_equipment_orders.map((order, index) =>
      fireEquipmentFromBody(order, order.id ?? 5101 + index)
    );
    state.statuses.fire_equipment_order = 'unapproved';
    await fulfillJson(route, apiResponse(state.fireEquipmentOrders));
    return true;
  }

  if (method === 'DELETE' && /^\/fire_equipment_orders\/\d+$/.test(path)) {
    state.requestedUrls.push(path);
    state.fireEquipmentOrders = [];
    await fulfillJson(route, apiResponse([]));
    return true;
  }

  return false;
};

/**
 * 従業員申請。作成/更新/削除は @/hooks/useApi.ts の useAuthenticated* 系
 * (JSONボディ、snakecase-keysで変換)経由。legacy群と違いクエリではなく本文で届く。
 * 従業員数が1人なら POST /employees(新規) か PATCH /employees/:id(更新)、
 * 2人以上なら常に POST /employees/upsert が使われる(hooks.ts の分岐)。
 * GET は他群と違い status.code を見ず data.data の中身だけで判定するため、
 * apiNotFound() は使わない(空配列 = 未登録)。
 */
const employeesHandler: MockHandler = async ({
  route,
  pathname,
  method,
  state,
}) => {
  if (method === 'GET' && pathname === `/employees/group/${mockGroupId}`) {
    await fulfillJson(route, apiResponse(state.employees));
    return true;
  }

  if (method === 'POST' && pathname === '/employees/upsert') {
    state.requestedUrls.push(pathname);
    if (state.forceEmployeeSubmitError) {
      await route.fulfill({ status: 500, body: 'e2e forced failure' });
      return true;
    }
    const body = (await route.request().postDataJSON()) as {
      employees: Array<{
        id?: number;
        group_id?: number;
        name?: string;
        student_id?: number | string;
        stool_test_id?: number;
      }>;
    };
    let nextId = 15101;
    state.employees = body.employees.map((employee) =>
      employeeFromBody(employee, employee.id ?? nextId++)
    );
    await fulfillJson(route, apiResponse(state.employees));
    return true;
  }

  if (method === 'POST' && pathname === '/employees') {
    state.requestedUrls.push(pathname);
    if (state.forceEmployeeSubmitError) {
      await route.fulfill({ status: 500, body: 'e2e forced failure' });
      return true;
    }
    const body = (await route.request().postDataJSON()) as {
      group_id?: number;
      name?: string;
      student_id?: number | string;
      stool_test_id?: number;
    };
    const record = employeeFromBody(body, 15001);
    state.employees = [...state.employees, record];
    await fulfillJson(route, apiResponse(record));
    return true;
  }

  if (method === 'PATCH' && /^\/employees\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    if (state.forceEmployeeSubmitError) {
      await route.fulfill({ status: 500, body: 'e2e forced failure' });
      return true;
    }
    const id = Number(pathname.split('/').at(-1));
    const body = (await route.request().postDataJSON()) as {
      group_id?: number;
      name?: string;
      student_id?: number | string;
      stool_test_id?: number;
    };
    const record = employeeFromBody(body, id);
    state.employees = state.employees.map((employee) =>
      employee.id === id ? record : employee
    );
    await fulfillJson(route, apiResponse(record));
    return true;
  }

  if (method === 'DELETE' && /^\/employees\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    const id = Number(pathname.split('/').at(-1));
    state.employees = state.employees.filter((employee) => employee.id !== id);
    await fulfillJson(route, apiResponse(null));
    return true;
  }

  return false;
};

/**
 * ステージオプション申請。
 * 作成/更新は legacyPost/PatchFetcher 経由のため、値は本文ではなく
 * snake_case のクエリ文字列で届く点に注意。
 */
const stageOptionHandler: MockHandler = async ({
  route,
  pathname,
  query,
  method,
  state,
}) => {
  if (
    method === 'GET' &&
    pathname === `/stage_common_options/group/${mockGroupId}`
  ) {
    await fulfillJson(
      route,
      state.stageOption ? apiResponse(state.stageOption) : apiNotFound()
    );
    return true;
  }

  const stageOptionFromQuery = (id: number): StageOptionRecord => ({
    id,
    group_id: Number(query.get('group_id') ?? mockGroupId),
    own_equipment: query.get('own_equipment') === 'true',
    bgm: query.get('bgm') === 'true',
    camera_permission: query.get('camera_permission') === 'true',
    loud_sound: query.get('loud_sound') === 'true',
  });

  if (method === 'POST' && pathname === '/stage_common_options') {
    state.requestedUrls.push(pathname);
    state.stageOption = stageOptionFromQuery(7001);
    await fulfillJson(route, apiResponse(state.stageOption));
    return true;
  }

  if (method === 'PATCH' && /^\/stage_common_options\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    state.stageOption = stageOptionFromQuery(
      Number(pathname.split('/').at(-1))
    );
    await fulfillJson(route, apiResponse(state.stageOption));
    return true;
  }

  return false;
};

/**
 * ステージ申請(晴天/雨天)。
 * マスターデータ(開催日/晴天ステージ/雨天ステージ)は GET のみで固定。
 * 作成/更新は useApiMutations(独自実装の postData/putData)経由の生fetchで、
 * legacy 群と異なりJSONボディ(snake_case)がそのまま届く。
 * サーバ側の envelope({status,data})も付けていないが、呼び出し側(submitStageOrder)は
 * レスポンスの中身を見ないため、他群と同じ apiResponse() を使っても問題ない。
 * 晴天/雨天は同じ POST /stage_orders に is_sunny違いで2回飛んでくる。
 */
const stageOrderId = (isSunny: boolean) => (isSunny ? 13001 : 13002);

const stageOrderFromBody = (
  body: Partial<StageOrderRecord>,
  id: number
): StageOrderRecord => ({
  id,
  group_id: Number(body.group_id ?? mockGroupId),
  fes_date_id: Number(body.fes_date_id ?? 0),
  is_sunny: Boolean(body.is_sunny),
  stage_first: Number(body.stage_first ?? 0),
  stage_second: Number(body.stage_second ?? 0),
  use_time_interval: body.use_time_interval ?? '',
  prepare_time_interval: body.prepare_time_interval ?? '',
  cleanup_time_interval: body.cleanup_time_interval ?? '',
});

const upsertStageOrder = (state: ScenarioState, record: StageOrderRecord) => {
  state.stageOrders = [
    ...state.stageOrders.filter((order) => order.id !== record.id),
    record,
  ];
};

const stageOrderHandler: MockHandler = async ({
  route,
  pathname,
  method,
  state,
}) => {
  if (method === 'GET' && pathname === '/api/v1/get_current_fes_dates') {
    await fulfillJson(route, apiResponse(state.fesDates));
    return true;
  }

  if (method === 'GET' && pathname === '/sunny/stages') {
    await fulfillJson(route, apiResponse(state.sunnyStages));
    return true;
  }

  if (method === 'GET' && pathname === '/rainy/stages') {
    await fulfillJson(route, apiResponse(state.rainyStages));
    return true;
  }

  if (method === 'GET' && pathname === '/stage_orders') {
    await fulfillJson(route, apiResponse(state.stageOrders));
    return true;
  }

  if (method === 'POST' && pathname === '/stage_orders') {
    state.requestedUrls.push(pathname);
    const body = (await route
      .request()
      .postDataJSON()) as Partial<StageOrderRecord>;
    const record = stageOrderFromBody(
      body,
      stageOrderId(Boolean(body.is_sunny))
    );
    upsertStageOrder(state, record);
    await fulfillJson(route, apiResponse(record));
    return true;
  }

  if (method === 'PUT' && /^\/stage_orders\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    const id = Number(pathname.split('/').at(-1));
    const body = (await route
      .request()
      .postDataJSON()) as Partial<StageOrderRecord>;
    const record = stageOrderFromBody(body, id);
    upsertStageOrder(state, record);
    await fulfillJson(route, apiResponse(record));
    return true;
  }

  return false;
};

/**
 * 会場申請。作成/更新はステージオプションと同じく legacy フェッチャ経由で、
 * 値は snake_case のクエリ文字列で届く。
 */
const venueApplicationHandler: MockHandler = async ({
  route,
  pathname,
  query,
  method,
  state,
}) => {
  if (method === 'GET' && pathname === '/places') {
    await fulfillJson(route, apiResponse(state.places));
    return true;
  }

  if (method === 'GET' && pathname === `/place_orders/group/${mockGroupId}`) {
    await fulfillJson(
      route,
      state.placeOrder ? apiResponse(state.placeOrder) : apiNotFound()
    );
    return true;
  }

  const placeOrderFromQuery = (id: number): PlaceOrderRecord => ({
    id,
    group_id: Number(query.get('group_id') ?? mockGroupId),
    first: Number(query.get('first') ?? 0),
    second: Number(query.get('second') ?? 0),
    third: Number(query.get('third') ?? 0),
    remark: query.get('remark') ?? '',
  });

  if (method === 'POST' && pathname === '/place_orders') {
    state.requestedUrls.push(pathname);
    state.placeOrder = placeOrderFromQuery(8001);
    await fulfillJson(route, apiResponse(state.placeOrder));
    return true;
  }

  if (method === 'PATCH' && /^\/place_orders\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    state.placeOrder = placeOrderFromQuery(Number(pathname.split('/').at(-1)));
    await fulfillJson(route, apiResponse(state.placeOrder));
    return true;
  }

  return false;
};

/**
 * PR文申請。作成/更新は legacyPost/PatchFetcher 経由のため、値は本文ではなく
 * snake_case のクエリ文字列で届く(他の legacy 群と同じ)。
 */
const publicRelationHandler: MockHandler = async ({
  route,
  pathname,
  query,
  method,
  state,
}) => {
  if (
    method === 'GET' &&
    pathname === `/public_relations/group/${mockGroupId}`
  ) {
    await fulfillJson(
      route,
      state.publicRelation ? apiResponse(state.publicRelation) : apiNotFound()
    );
    return true;
  }

  const publicRelationFromQuery = (id: number): PublicRelationRecord => ({
    id,
    group_id: Number(query.get('group_id') ?? mockGroupId),
    blurb: query.get('blurb') ?? '',
    picture_name: query.get('picture_name') ?? '',
    picture_path: query.get('picture_path') ?? '',
    is_announcement_requested:
      query.get('is_announcement_requested') === 'true',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  });

  if (method === 'POST' && pathname === '/public_relations') {
    state.requestedUrls.push(pathname);
    if (state.forcePublicRelationSubmitError) {
      await route.fulfill({ status: 500, body: 'e2e forced failure' });
      return true;
    }
    state.publicRelation = publicRelationFromQuery(11001);
    await fulfillJson(route, apiResponse(state.publicRelation));
    return true;
  }

  if (method === 'PATCH' && /^\/public_relations\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    if (state.forcePublicRelationSubmitError) {
      await route.fulfill({ status: 500, body: 'e2e forced failure' });
      return true;
    }
    state.publicRelation = publicRelationFromQuery(
      Number(pathname.split('/').at(-1))
    );
    await fulfillJson(route, apiResponse(state.publicRelation));
    return true;
  }

  return false;
};

/**
 * 模擬店平面図申請。PublicRelationsのほぼクローンだが、作成/更新は
 * useAuthenticatedPost/Patch(@/hooks/useApi.ts)経由。ただし呼び出し側が
 * trigger({ query: apiData }) と `query` で渡すため、bodyではなく
 * legacy群と同じ snake_case のクエリ文字列として届く点に注意。
 */
const venueMapHandler: MockHandler = async ({
  route,
  pathname,
  query,
  method,
  state,
}) => {
  if (method === 'GET' && pathname === `/venue_maps/group/${mockGroupId}`) {
    await fulfillJson(
      route,
      state.venueMap ? apiResponse(state.venueMap) : apiNotFound()
    );
    return true;
  }

  const venueMapFromQuery = (id: number): VenueMapRecord => ({
    id,
    group_id: Number(query.get('group_id') ?? mockGroupId),
    picture_name: query.get('picture_name') ?? '',
    picture_path: query.get('picture_path') ?? '',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  });

  if (method === 'POST' && pathname === '/venue_maps') {
    state.requestedUrls.push(pathname);
    if (state.forceVenueMapSubmitError) {
      await route.fulfill({ status: 500, body: 'e2e forced failure' });
      return true;
    }
    state.venueMap = venueMapFromQuery(12001);
    await fulfillJson(route, apiResponse(state.venueMap));
    return true;
  }

  if (method === 'PATCH' && /^\/venue_maps\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    if (state.forceVenueMapSubmitError) {
      await route.fulfill({ status: 500, body: 'e2e forced failure' });
      return true;
    }
    state.venueMap = venueMapFromQuery(Number(pathname.split('/').at(-1)));
    await fulfillJson(route, apiResponse(state.venueMap));
    return true;
  }

  return false;
};

/**
 * 調理工程申請。販売品(FoodProduct)ごとに0〜1件対応する。
 * 作成/更新の区別はなく、常に POST /cooking_process_orders/upsert を
 * useAuthenticatedPost(JSONボディ、snakecase-keysで深く変換)経由で呼ぶ。
 * useGetCookingProcessOrder/useGetFoodProducts はどちらも status.code を見ず
 * data.data の中身だけで判定するため、他群のような apiNotFound() は使わない。
 */
const cookingProcessOrderHandler: MockHandler = async ({
  route,
  pathname,
  method,
  state,
}) => {
  if (method === 'GET' && pathname === `/food_products/group/${mockGroupId}`) {
    await fulfillJson(route, apiResponse(state.foodProducts));
    return true;
  }

  if (
    method === 'GET' &&
    pathname === `/cooking_process_orders/group/${mockGroupId}`
  ) {
    await fulfillJson(route, apiResponse(state.cookingProcessOrders));
    return true;
  }

  if (method === 'POST' && pathname === '/cooking_process_orders/upsert') {
    state.requestedUrls.push(pathname);
    const body = (await route.request().postDataJSON()) as {
      cooking_process_orders: Array<{
        id?: number;
        group_id?: number;
        food_product_id?: number;
        pre_open_kitchen?: boolean;
        during_open_kitchen?: boolean;
        tent?: string;
      }>;
    };

    let nextId = 14001;
    state.cookingProcessOrders = body.cooking_process_orders.map((order) => {
      const existing = order.id
        ? state.cookingProcessOrders.find((o) => o.id === order.id)
        : state.cookingProcessOrders.find(
            (o) => o.food_product_id === order.food_product_id
          );
      const id = order.id ?? existing?.id ?? nextId++;
      const record: CookingProcessOrderRecord = {
        id,
        group_id: order.group_id ?? mockGroupId,
        food_product_id: order.food_product_id ?? 0,
        pre_open_kitchen: order.pre_open_kitchen ?? false,
        during_open_kitchen: order.during_open_kitchen ?? false,
        tent: order.tent ?? '',
        tent_ja: existing?.tent_ja ?? null,
        created_at: existing?.created_at ?? '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      };
      return record;
    });
    await fulfillJson(route, apiResponse(state.cookingProcessOrders));
    return true;
  }

  return false;
};

/**
 * 販売品申請。GET /food_products/group/:id は cookingProcessOrderHandler が既に持つ
 * (調理工程の対象一覧としても使うため)。ここでは書き込み系だけを担当する。
 * 作成/更新の区別はなく、常に POST /food_products/upsert を
 * useAuthenticatedPost(JSONボディ、snakecase-keysで変換)経由で丸ごと置き換える。
 * 削除は @/hooks/useApi.ts の useApiMutations().remove 経由で
 * DELETE /food_products/:id が個別に飛ぶ(upsertの前に、消えた行の分だけ)。
 */
const foodProductHandler: MockHandler = async ({
  route,
  pathname,
  method,
  state,
}) => {
  if (method === 'POST' && pathname === '/food_products/upsert') {
    state.requestedUrls.push(pathname);
    const body = (await route.request().postDataJSON()) as {
      food_products: Array<{
        id?: number;
        group_id?: number;
        name?: string;
        is_cooking?: boolean;
        first_day_num?: number;
        second_day_num?: number;
        is_alcohol?: boolean;
      }>;
    };
    let nextId = 22101;
    state.foodProducts = body.food_products.map((product) => {
      const existing = product.id
        ? state.foodProducts.find((p) => p.id === product.id)
        : undefined;
      const id = product.id ?? nextId++;
      return foodProductFromBody(product, id, existing);
    });
    await fulfillJson(route, apiResponse(state.foodProducts));
    return true;
  }

  if (method === 'DELETE' && /^\/food_products\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    const id = Number(pathname.split('/').at(-1));
    state.foodProducts = state.foodProducts.filter(
      (product) => product.id !== id
    );
    await fulfillJson(route, apiResponse(null));
    return true;
  }

  return false;
};

/**
 * 購入品申請。販売品(FoodProduct)ごとに複数件対応し、店舗(Shop)マスタにも依存する。
 * GET は food_product_ids[] クエリで絞り込む。
 * 作成/更新/削除は @/hooks/useApi.ts の useAuthenticated* 系(JSONボディ、
 * snakecase-keysで変換)経由。usePurchaseListsForm は送信件数で作成/更新APIを
 * 切り替える(1件: POST /purchase_lists または PATCH /purchase_lists/:id、
 * 2件以上: 常に POST /purchase_lists/upsert)。
 */
const purchaseListsHandler: MockHandler = async ({
  route,
  pathname,
  query,
  method,
  state,
}) => {
  if (method === 'GET' && pathname === '/shops') {
    await fulfillJson(route, apiResponse(state.shops));
    return true;
  }

  if (method === 'GET' && pathname === '/purchase_lists/food_product') {
    const foodProductIds = query.getAll('food_product_ids[]').map(Number);
    const filtered = state.purchaseLists.filter((item) =>
      foodProductIds.includes(item.food_product_id)
    );
    await fulfillJson(route, apiResponse(filtered));
    return true;
  }

  if (method === 'POST' && pathname === '/purchase_lists') {
    state.requestedUrls.push(pathname);
    const body = (await route.request().postDataJSON()) as Parameters<
      typeof purchaseListFromBody
    >[0];
    const record = purchaseListFromBody(body, 23001);
    state.purchaseLists = [...state.purchaseLists, record];
    await fulfillJson(route, apiResponse(record));
    return true;
  }

  if (method === 'PATCH' && /^\/purchase_lists\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    const id = Number(pathname.split('/').at(-1));
    const body = (await route.request().postDataJSON()) as Parameters<
      typeof purchaseListFromBody
    >[0];
    const existing = state.purchaseLists.find((item) => item.id === id);
    const record = purchaseListFromBody(body, id, existing);
    state.purchaseLists = state.purchaseLists.map((item) =>
      item.id === id ? record : item
    );
    await fulfillJson(route, apiResponse(record));
    return true;
  }

  if (method === 'POST' && pathname === '/purchase_lists/upsert') {
    state.requestedUrls.push(pathname);
    const body = (await route.request().postDataJSON()) as {
      purchase_lists: Parameters<typeof purchaseListFromBody>[0][];
    };
    let nextId = 23101;
    const upserted = body.purchase_lists.map((item) => {
      const existing = item.id
        ? state.purchaseLists.find((p) => p.id === item.id)
        : undefined;
      const id = item.id ?? existing?.id ?? nextId++;
      return purchaseListFromBody(item, id, existing);
    });
    state.purchaseLists = [
      ...state.purchaseLists.filter(
        (item) => !upserted.some((updated) => updated.id === item.id)
      ),
      ...upserted,
    ];
    await fulfillJson(route, apiResponse(upserted));
    return true;
  }

  if (method === 'DELETE' && /^\/purchase_lists\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    const id = Number(pathname.split('/').at(-1));
    state.purchaseLists = state.purchaseLists.filter((item) => item.id !== id);
    await fulfillJson(route, apiResponse(null));
    return true;
  }

  return false;
};

/**
 * 物品申請。物品マスタは団体タイプ/会場タイプに応じて3つのエンドポイント
 * (全件/屋内/屋外)を使い分けるが、いずれも同じ state.rentableItems を
 * is_inside_shop_rentable / is_outside_shop_rentable でフィルタするだけ。
 * 作成/更新は legacyPost/PatchFetcher 経由だが、rentItemsApi.ts の呼び出し側は
 * query ではなく body だけを渡すため、他の legacy 群(stageOption 等)と異なり
 * JSONボディ(既に snake_case)がそのまま届く。削除は
 * @/hooks/useApi.ts の useApiMutations().remove(素のfetch)経由。
 * id は同時実行される複数POSTがレースしても衝突しないよう rental_item_id から
 * 決定的に導出する(items は重複IDを許さないフォームバリデーションのため一意)。
 */
const rentItemsHandler: MockHandler = async ({
  route,
  pathname,
  method,
  state,
}) => {
  if (method === 'GET' && pathname === '/api/v1/get_all_rentable_items') {
    await fulfillJson(route, apiResponse(state.rentableItems));
    return true;
  }

  if (
    method === 'GET' &&
    pathname === '/api/v1/get_inside_shop_rentable_items'
  ) {
    await fulfillJson(
      route,
      apiResponse(
        state.rentableItems.filter((item) => item.is_inside_shop_rentable)
      )
    );
    return true;
  }

  if (
    method === 'GET' &&
    pathname === '/api/v1/get_outside_shop_rentable_items'
  ) {
    await fulfillJson(
      route,
      apiResponse(
        state.rentableItems.filter((item) => item.is_outside_shop_rentable)
      )
    );
    return true;
  }

  if (method === 'GET' && pathname === `/rental_orders/group/${mockGroupId}`) {
    await fulfillJson(route, apiResponse(state.rentalOrders));
    return true;
  }

  const rentalOrderFromBody = (
    body: Partial<RentalOrderRecord>,
    id: number
  ): RentalOrderRecord => ({
    id,
    group_id: body.group_id ?? mockGroupId,
    rental_item_id: body.rental_item_id ?? 0,
    num: body.num ?? 0,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  });

  if (method === 'POST' && pathname === '/rental_orders') {
    state.requestedUrls.push(pathname);
    const body = (await route
      .request()
      .postDataJSON()) as Partial<RentalOrderRecord>;
    const record = rentalOrderFromBody(
      body,
      20100 + (body.rental_item_id ?? 0)
    );
    state.rentalOrders = [...state.rentalOrders, record];
    await fulfillJson(route, apiResponse(record));
    return true;
  }

  if (method === 'PATCH' && /^\/rental_orders\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    const id = Number(pathname.split('/').at(-1));
    const body = (await route
      .request()
      .postDataJSON()) as Partial<RentalOrderRecord>;
    const record = rentalOrderFromBody(body, id);
    state.rentalOrders = state.rentalOrders.map((order) =>
      order.id === id ? record : order
    );
    await fulfillJson(route, apiResponse(record));
    return true;
  }

  if (method === 'DELETE' && /^\/rental_orders\/\d+$/.test(pathname)) {
    state.requestedUrls.push(pathname);
    const id = Number(pathname.split('/').at(-1));
    state.rentalOrders = state.rentalOrders.filter((order) => order.id !== id);
    await fulfillJson(route, apiResponse(null));
    return true;
  }

  return false;
};

const newsHandler: MockHandler = async ({ route, url }) => {
  if (url.includes('/news')) {
    await fulfillJson(route, []);
    return true;
  }

  return false;
};

/** まだ専用ハンドラを持たない申請系GETを空配列で埋める最終フォールバック。 */
const emptyApplicationApiPaths = [
  '/groups/',
  '/rental_orders/group/',
  '/place_orders/group/',
  '/public_relations/group/',
  '/venue_maps/group/',
  '/food_products/group/',
  '/purchase_lists/food_product',
  '/cooking_process_orders/group/',
  '/employees/group/',
];

const emptyApplicationHandler: MockHandler = async ({ route, path }) => {
  if (emptyApplicationApiPaths.some((apiPath) => path.includes(apiPath))) {
    await fulfillJson(route, apiResponse([]));
    return true;
  }

  return false;
};

/**
 * 先頭から順に試され、最初に true を返したハンドラが応答する。
 * emptyApplicationHandler は他を食い潰すため必ず末尾に置くこと。
 */
const handlers: MockHandler[] = [
  imgurHandler,
  nextImageOptimizerHandler,
  authHandler,
  groupHandler,
  submissionStatusHandler,
  powerHandler,
  unregisteredGroupHandler,
  fireEquipmentHandler,
  employeesHandler,
  stageOptionHandler,
  stageOrderHandler,
  venueApplicationHandler,
  viceRepresentativeHandler,
  publicRelationHandler,
  venueMapHandler,
  cookingProcessOrderHandler,
  foodProductHandler,
  purchaseListsHandler,
  rentItemsHandler,
  newsHandler,
  emptyApplicationHandler,
];

export const mockHomePageApis = async (page: Page, state: ScenarioState) => {
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    const requestUrl = new URL(url);
    const ctx: MockContext = {
      route,
      url,
      path: `${requestUrl.pathname}${requestUrl.search}`,
      pathname: requestUrl.pathname,
      query: requestUrl.searchParams,
      method: route.request().method(),
      state,
    };

    for (const handler of handlers) {
      if (await handler(ctx)) return;
    }

    return route.continue();
  });
};
