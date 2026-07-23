import { expect, request, test } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

const API_BASE_URL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://api:3000';
const LOGIN_EMAIL =
  process.env.PLAYWRIGHT_COOKING_E2E_EMAIL ?? 'nutfes-jiro@email.com';
const LOGIN_PASSWORD = process.env.PLAYWRIGHT_E2E_PASSWORD ?? 'gidaifes';

type ApiResponse<T> = {
  status: {
    code: number;
    message: string;
  };
  data: T;
};

type AuthHeaders = {
  'access-token': string;
  client: string;
  uid: string;
};

type Group = {
  id: number;
};

type FoodProduct = {
  id: number;
  group_id: number;
  name: string;
  is_cooking: boolean;
  first_day_num: number;
  second_day_num: number;
  is_alcohol: boolean;
};

type CookingProcessOrder = {
  id: number;
  group_id: number;
  food_product_id: number;
  pre_open_kitchen: boolean;
  during_open_kitchen: boolean;
  tent: string | null;
  tent_ja: string | null;
};

test.describe('cooking process order translation data', () => {
  test.describe.configure({ mode: 'serial' });

  let api: APIRequestContext;
  let authHeaders: AuthHeaders;
  let groupId: number;
  let foodProductId: number | undefined;
  let cookingProcessOrderId: number | undefined;

  test.beforeEach(async () => {
    api = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
    const auth = await signIn(api);
    authHeaders = auth.headers;
    groupId =
      Number(process.env.PLAYWRIGHT_E2E_GROUP_ID) ||
      (await getOwnedGroup(api, auth.headers, auth.userId)).id;
  });

  test.afterEach(async () => {
    try {
      if (cookingProcessOrderId !== undefined) {
        try {
          await api.delete(`/cooking_process_orders/${cookingProcessOrderId}`, {
            headers: authHeaders,
          });
        } finally {
          cookingProcessOrderId = undefined;
        }
      }
      if (foodProductId !== undefined) {
        try {
          await api.delete(`/food_products/${foodProductId}`, {
            headers: authHeaders,
          });
        } finally {
          foodProductId = undefined;
        }
      }
    } finally {
      await api.dispose();
    }
  });

  test('preserves translated Japanese text when the source tent is unchanged and stores edited Japanese text when it is provided', async () => {
    const foodProduct = await createFoodProduct(api, authHeaders, groupId);
    foodProductId = foodProduct.id;

    const createdOrder = await upsertCookingProcessOrder(
      api,
      {
        group_id: groupId,
        food_product_id: foodProduct.id,
        pre_open_kitchen: true,
        during_open_kitchen: false,
        tent: 'Boil noodles and cool them with water.',
        tent_ja: '麺をゆでて水で冷やす。',
      },
      authHeaders
    );
    cookingProcessOrderId = createdOrder.id;

    expect(createdOrder.tent).toBe('Boil noodles and cool them with water.');
    expect(createdOrder.tent_ja).toBe('麺をゆでて水で冷やす。');

    const unchangedSourceOrder = await upsertCookingProcessOrder(
      api,
      {
        id: createdOrder.id,
        group_id: groupId,
        food_product_id: foodProduct.id,
        pre_open_kitchen: false,
        during_open_kitchen: true,
        tent: 'Boil noodles and cool them with water.',
      },
      authHeaders
    );

    expect(unchangedSourceOrder.tent).toBe(
      'Boil noodles and cool them with water.'
    );
    expect(unchangedSourceOrder.tent_ja).toBe('麺をゆでて水で冷やす。');
    expect(unchangedSourceOrder.pre_open_kitchen).toBe(false);
    expect(unchangedSourceOrder.during_open_kitchen).toBe(true);

    const changedSourceOrder = await upsertCookingProcessOrder(
      api,
      {
        id: createdOrder.id,
        group_id: groupId,
        food_product_id: foodProduct.id,
        pre_open_kitchen: false,
        during_open_kitchen: true,
        tent: 'Grill the noodles on a hot plate.',
        tent_ja: '麺を鉄板で焼く。',
      },
      authHeaders
    );

    expect(changedSourceOrder.tent).toBe('Grill the noodles on a hot plate.');
    expect(changedSourceOrder.tent_ja).toBe('麺を鉄板で焼く。');
  });

  test('rejects unauthenticated food product creation', async () => {
    const response = await api.post('/food_products', {
      data: {
        group_id: groupId,
        name: `e2e-unauthenticated-food-${Date.now()}`,
        is_cooking: true,
        first_day_num: 1,
        second_day_num: 1,
        is_alcohol: false,
      },
    });

    expect(response.status()).toBe(401);
  });
});

const createFoodProduct = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  groupId: number
): Promise<FoodProduct> => {
  const response = await api.post('/food_products', {
    headers: authHeaders,
    data: {
      group_id: groupId,
      name: `e2e-cooking-process-${Date.now()}`,
      is_cooking: true,
      first_day_num: 1,
      second_day_num: 1,
      is_alcohol: false,
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<FoodProduct>;
  expect(body.status.code).toBe(201);
  expect(body.data.id).toBeGreaterThan(0);

  return body.data;
};

const upsertCookingProcessOrder = async (
  api: APIRequestContext,
  order: Partial<CookingProcessOrder>,
  authHeaders: AuthHeaders
): Promise<CookingProcessOrder> => {
  const response = await api.post('/cooking_process_orders/upsert', {
    headers: authHeaders,
    data: {
      cooking_process_orders: [order],
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<CookingProcessOrder[]>;
  expect(body.status.code).toBe(200);

  const upsertedOrder = body.data.find(
    (item) => item.food_product_id === order.food_product_id
  );
  expect(upsertedOrder).toBeDefined();
  expect(upsertedOrder?.id).toBeGreaterThan(0);

  return upsertedOrder as CookingProcessOrder;
};

const signIn = async (
  api: APIRequestContext
): Promise<{ userId: number; headers: AuthHeaders }> => {
  const response = await api.post('/api/auth/sign_in', {
    data: {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as { data: { id: number } };
  const headers = response.headers();

  return {
    userId: body.data.id,
    headers: {
      'access-token': headers['access-token'],
      client: headers.client,
      uid: headers.uid,
    },
  };
};

const getOwnedGroup = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  userId: number
): Promise<Group> => {
  const response = await api.get(`/groups/user/${userId}`, {
    headers: authHeaders,
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<Group>;
  expect(body.status.code).toBe(200);

  return body.data;
};
