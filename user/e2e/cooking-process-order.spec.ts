import { expect, request, test } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

const API_BASE_URL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://api:3000';
const TEST_GROUP_ID = Number(process.env.PLAYWRIGHT_E2E_GROUP_ID ?? 1);

type ApiResponse<T> = {
  status: {
    code: number;
    message: string;
  };
  data: T;
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
  let api: APIRequestContext;
  let foodProductId: number | undefined;
  let cookingProcessOrderId: number | undefined;

  test.beforeEach(async () => {
    api = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  });

  test.afterEach(async () => {
    if (cookingProcessOrderId !== undefined) {
      await api.delete(`/cooking_process_orders/${cookingProcessOrderId}`);
    }
    if (foodProductId !== undefined) {
      await api.delete(`/food_products/${foodProductId}`);
    }
    await api.dispose();
  });

  test('preserves translated Japanese text when the source tent is unchanged and updates it when the source tent changes', async () => {
    const foodProduct = await createFoodProduct(api);
    foodProductId = foodProduct.id;

    const createdOrder = await upsertCookingProcessOrder(api, {
      group_id: TEST_GROUP_ID,
      food_product_id: foodProduct.id,
      pre_open_kitchen: true,
      during_open_kitchen: false,
      tent: 'Boil noodles and cool them with water.',
      tent_ja: '麺をゆでて水で冷やす。',
    });
    cookingProcessOrderId = createdOrder.id;

    expect(createdOrder.tent).toBe('Boil noodles and cool them with water.');
    expect(createdOrder.tent_ja).toBe('麺をゆでて水で冷やす。');

    const unchangedSourceOrder = await upsertCookingProcessOrder(api, {
      id: createdOrder.id,
      group_id: TEST_GROUP_ID,
      food_product_id: foodProduct.id,
      pre_open_kitchen: false,
      during_open_kitchen: true,
      tent: 'Boil noodles and cool them with water.',
    });

    expect(unchangedSourceOrder.tent).toBe(
      'Boil noodles and cool them with water.'
    );
    expect(unchangedSourceOrder.tent_ja).toBe('麺をゆでて水で冷やす。');
    expect(unchangedSourceOrder.pre_open_kitchen).toBe(false);
    expect(unchangedSourceOrder.during_open_kitchen).toBe(true);

    const changedSourceOrder = await upsertCookingProcessOrder(api, {
      id: createdOrder.id,
      group_id: TEST_GROUP_ID,
      food_product_id: foodProduct.id,
      pre_open_kitchen: false,
      during_open_kitchen: true,
      tent: 'Grill the noodles on a hot plate.',
      tent_ja: '麺を鉄板で焼く。',
    });

    expect(changedSourceOrder.tent).toBe('Grill the noodles on a hot plate.');
    expect(changedSourceOrder.tent_ja).toBe('麺を鉄板で焼く。');
  });
});

const createFoodProduct = async (
  api: APIRequestContext
): Promise<FoodProduct> => {
  const response = await api.post('/food_products', {
    data: {
      group_id: TEST_GROUP_ID,
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
  order: Partial<CookingProcessOrder>
): Promise<CookingProcessOrder> => {
  const response = await api.post('/cooking_process_orders/upsert', {
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
