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
  type PowerOrder,
  type ScenarioState,
  type StageOptionRecord,
  type SubmissionApplicationType,
  type SubmissionStatusValue,
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

const groupHandler: MockHandler = async ({ route, path, state }) => {
  if (path === `/groups/user/${mockUser.id}`) {
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
    await fulfillJson(route, apiResponse(checkAllRegistered(state)));
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

const unregisteredGroupHandler: MockHandler = async ({
  route,
  path,
  method,
  state,
}) => {
  if (
    method === 'GET' &&
    path === `/un_registered_groups/group?group_id=${mockGroupId}&order_type=1`
  ) {
    await fulfillJson(route, apiResponse([]));
    return true;
  }

  if (
    method === 'GET' &&
    path === `/un_registered_groups/group?group_id=${mockGroupId}&order_type=4`
  ) {
    await fulfillJson(
      route,
      apiResponse(
        state.hasUnregisteredFireEquipment
          ? [
              {
                id: 6001,
                group_id: mockGroupId,
                order_type: 'fire_equipment_order',
                created_at: '2026-01-01T00:00:00.000Z',
                updated_at: '2026-01-01T00:00:00.000Z',
              },
            ]
          : []
      )
    );
    return true;
  }

  if (
    (method === 'DELETE' || method === 'POST') &&
    path === '/un_registered_groups'
  ) {
    state.requestedUrls.push(path);
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
