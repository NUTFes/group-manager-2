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
  fireEquipmentFromBody,
  fulfillJson,
  powerOrderFromBody,
  submission,
  userPageSettings,
} from './fixtures';
import {
  type FireEquipmentBody,
  type GroupRecord,
  type PlaceOrderRecord,
  type PowerOrder,
  type ScenarioState,
  type StageOptionRecord,
  type SubmissionApplicationType,
  type SubmissionStatusValue,
  type ViceRepresentativeRecord,
  mockGroupId,
  mockUser,
  submissionApplicationTypes,
} from './scenarioState';

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
    const body = (await route.request().postDataJSON()) as {
      order_type?: number;
    };
    const orderType = Number(body?.order_type ?? -1);
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
  authHandler,
  groupHandler,
  submissionStatusHandler,
  powerHandler,
  unregisteredGroupHandler,
  fireEquipmentHandler,
  stageOptionHandler,
  venueApplicationHandler,
  viceRepresentativeHandler,
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
