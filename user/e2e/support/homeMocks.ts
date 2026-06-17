import type { Page, Route } from '@playwright/test';

export const GROUP_ID = 1;
export const USER_ID = 1;

export const GROUP_CATEGORY = {
  FOOD_SALES: 1,
  GOODS_SALES: 2,
  STAGE: 3,
  EXHIBITION: 4,
  RESEARCH_LAB: 5,
  COMMITTEE: 6,
} as const;

export type UserPageSettings = Record<string, boolean | number>;
export type RegistrationStatus = Record<string, boolean>;

export const baseSettings: UserPageSettings = {
  id: 1,
  isRegistGroup: true,
  isRegistFoodProduct: true,
  isEditGroup: true,
  isEditSubRep: true,
  isEditPlace: true,
  isEditPowerOrder: true,
  isEditRentalOrder: true,
  isEditStageOrder: true,
  isEditEmployee: true,
  isEditFoodProduct: true,
  isEditPurchaseList: true,
  addPowerOrder: true,
  addRentalOrder: true,
  addEmployee: true,
  addFoodProduct: true,
  addPurchaseList: true,
  fesYearId: 1,
  isEditAnnouncement: true,
  addAnnouncement: true,
  isEditUser: true,
  isEditStageCommonOption: true,
  isEditPublicRelation: true,
  isEditVenueMap: true,
  isEditCookingProcess: true,
  addStageOrder: true,
  addFireEquipmentOrder: true,
  isEditFireEquipmentOrder: true,
};

export const unregisteredStatus: RegistrationStatus = {
  group: true,
  subRep: false,
  rentalItem: false,
  placeOrder: false,
  stageOrder: false,
  stageOption: false,
  powerOrder: false,
  employee: false,
  venueMap: false,
  foodProduct: false,
  purchaseList: false,
  cookingProcessOrder: false,
  fireEquipmentOrder: false,
  publicRelation: false,
};

export const registeredStatus: RegistrationStatus = Object.fromEntries(
  Object.keys(unregisteredStatus).map((key) => [key, true])
);

export const groupCategories = [
  { id: GROUP_CATEGORY.FOOD_SALES, name: '食品販売', nameEn: 'Food sales' },
  { id: GROUP_CATEGORY.GOODS_SALES, name: '物品販売', nameEn: 'Goods sales' },
  { id: GROUP_CATEGORY.STAGE, name: 'ステージ', nameEn: 'Stage' },
  { id: GROUP_CATEGORY.EXHIBITION, name: '展示・体験', nameEn: 'Exhibition' },
  {
    id: GROUP_CATEGORY.RESEARCH_LAB,
    name: '研究室公開',
    nameEn: 'Research lab',
  },
  { id: GROUP_CATEGORY.COMMITTEE, name: '実行委員会', nameEn: 'Committee' },
];

export const apiResponse = (data: unknown, code = 200) => ({
  status: { code, message: code === 200 ? 'OK' : 'Error' },
  data,
});

type HomeApiMockOptions = {
  page: Page;
  userPageSettings?: UserPageSettings;
  registrationStatus?: RegistrationStatus;
  groupCategoryId?: number;
  groupRegistered?: boolean;
};

export const setupHomeApiMocks = async ({
  page,
  userPageSettings = baseSettings,
  registrationStatus = registeredStatus,
  groupCategoryId = GROUP_CATEGORY.FOOD_SALES,
  groupRegistered = true,
}: HomeApiMockOptions) => {
  await page.unroute('**/*');

  const effectiveRegistrationStatus: RegistrationStatus = {
    ...registrationStatus,
    group: groupRegistered,
  };

  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = normalizeApiPath(url.pathname);

    if (request.method() !== 'GET') {
      await route.fallback();
      return;
    }

    if (path === '/api/auth/session') {
      await fulfillJson(route, {
        user: { name: 'E2E User', email: 'e2e@example.com' },
        expires: '2999-12-31T00:00:00.000Z',
        accessToken: 'token',
        client: 'client',
        uid: 'e2e@example.com',
      });
      return;
    }

    if (path === '/api/getUser') {
      await fulfillJson(route, {
        id: String(USER_ID),
        name: 'E2E User',
        email: 'e2e@example.com',
      });
      return;
    }

    if (path === '/news') {
      await fulfillJson(route, []);
      return;
    }

    if (path === '/user_page_settings') {
      await fulfillJson(route, apiResponse(userPageSettings));
      return;
    }

    if (path === `/groups/user/${USER_ID}`) {
      if (!groupRegistered) {
        await fulfillJson(route, apiResponse(null, 404));
        return;
      }

      await fulfillJson(
        route,
        apiResponse({
          id: GROUP_ID,
          userId: USER_ID,
          groupCategoryId,
        })
      );
      return;
    }

    if (path === `/check_all_registered/${GROUP_ID}`) {
      await fulfillJson(route, apiResponse(effectiveRegistrationStatus));
      return;
    }

    if (path === `/groups/${GROUP_ID}`) {
      await fulfillJson(route, apiResponse(groupResponse(groupCategoryId)));
      return;
    }

    if (path === '/group_categories') {
      await fulfillJson(route, apiResponse(groupCategories));
      return;
    }

    if (path === '/api/v1/get_current_fes_dates') {
      await fulfillJson(route, apiResponse([fesDate()]));
      return;
    }

    if (path === '/sunny/stages' || path === '/rainy/stages') {
      await fulfillJson(route, apiResponse([stageOption(path)]));
      return;
    }

    if (path === '/shops') {
      await fulfillJson(route, apiResponse([shop()]));
      return;
    }

    if (path === '/places') {
      await fulfillJson(route, {
        data: [
          place(1, '第1体育館'),
          place(2, '講義棟前'),
          place(3, '学生食堂前'),
        ],
      });
      return;
    }

    if (path === `/rental_orders/group/${GROUP_ID}`) {
      await fulfillJson(
        route,
        apiResponse(
          effectiveRegistrationStatus.rentalItem ? [rentalOrder()] : []
        )
      );
      return;
    }

    if (path === `/power_orders/group/${GROUP_ID}`) {
      await fulfillJson(
        route,
        apiResponse(
          effectiveRegistrationStatus.powerOrder ? [powerOrder()] : []
        )
      );
      return;
    }

    if (path === `/employees/group/${GROUP_ID}`) {
      await fulfillJson(
        route,
        apiResponse(effectiveRegistrationStatus.employee ? [employee()] : [])
      );
      return;
    }

    if (path === `/food_products/group/${GROUP_ID}`) {
      await fulfillJson(
        route,
        apiResponse(
          effectiveRegistrationStatus.foodProduct ||
            effectiveRegistrationStatus.purchaseList
            ? [foodProduct()]
            : []
        )
      );
      return;
    }

    if (path === '/purchase_lists/food_product') {
      await fulfillJson(
        route,
        apiResponse(
          effectiveRegistrationStatus.purchaseList ? [purchaseList()] : []
        )
      );
      return;
    }

    if (path === '/stage_orders') {
      await fulfillJson(
        route,
        apiResponse(effectiveRegistrationStatus.stageOrder ? stageOrders() : [])
      );
      return;
    }

    if (path.startsWith('/place_orders/group/')) {
      await fulfillJson(route, apiResponse(null));
      return;
    }

    if (path.startsWith('/fire_equipment_orders/group/')) {
      await fulfillJson(
        route,
        apiResponse(
          effectiveRegistrationStatus.fireEquipmentOrder
            ? {
                id: 1,
                group_id: GROUP_ID,
                name: 'E2E コンロ',
                quantity: 1,
                fuel: 'gas_bottle',
                usage: '湯煎',
                is_takeaway: true,
                remark: '',
              }
            : null
        )
      );
      return;
    }

    if (path.startsWith('/un_registered_groups/group')) {
      await fulfillJson(route, { data: [] });
      return;
    }

    if (path.startsWith('/api/v1/get_')) {
      await fulfillJson(route, apiResponse([]));
      return;
    }

    if (isApplicationDataEndpoint(path)) {
      await fulfillJson(route, apiResponse([]));
      return;
    }

    await route.fallback();
  });
};

export const normalizeApiPath = (pathname: string) => pathname;

export const fulfillJson = async (route: Route, body: unknown) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
};

const isApplicationDataEndpoint = (path: string) =>
  [
    '/rental_orders',
    '/power_orders',
    '/public_relations',
    '/employees',
    '/venue_maps',
    '/food_products',
    '/purchase_lists',
    '/cooking_process_orders',
    '/stage_orders',
    '/stage_common_options',
  ].some((endpoint) => path === endpoint || path.startsWith(`${endpoint}/`));

const groupResponse = (groupCategoryId: number) => ({
  id: GROUP_ID,
  name: 'E2E group',
  projectName: 'E2E project',
  activity: 'E2E activity',
  userId: USER_ID,
  groupCategoryId,
  fesYearId: 1,
  isInternational: false,
  committee: groupCategoryId === GROUP_CATEGORY.COMMITTEE,
  isExternal: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

const place = (id: number, name: string) => ({
  id,
  name,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
});

const rentalOrder = () => ({
  id: 1,
  groupId: GROUP_ID,
  rentalItemId: 1,
  num: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

const powerOrder = () => ({
  id: 1,
  groupId: GROUP_ID,
  item: 'E2E IHヒーター',
  power: 1000,
  manufacturer: 'E2E maker',
  model: 'E2E model',
  itemUrl: 'https://example.com/power',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

const employee = () => ({
  id: 1,
  groupId: GROUP_ID,
  name: 'E2E employee',
  studentId: '12345678',
  stoolTestId: '1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

const foodProduct = () => ({
  id: 1,
  groupId: GROUP_ID,
  name: 'E2E food',
  isCooking: true,
  firstDayNum: 10,
  secondDayNum: 10,
  isAlcohol: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

const purchaseList = () => ({
  id: 1,
  foodProductId: 1,
  shopId: 1,
  fesDateId: 1,
  items: 'E2E ingredient',
  isFresh: false,
  purchaseDate: '2026-06-01',
  url: null,
  remark: 'E2E remark',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

const shop = () => ({
  id: 1,
  name: 'E2E shop',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

const fesDate = () => ({
  id: 1,
  daysNum: 1,
  date: '2026-06-01',
  day: '月',
});

const stageOption = (path: string) => ({
  id: path === '/sunny/stages' ? 1 : 2,
  name: path === '/sunny/stages' ? 'E2E 晴れステージ' : 'E2E 雨ステージ',
});

const stageOrders = () => [
  {
    id: 1,
    groupId: GROUP_ID,
    fesDateId: 1,
    isSunny: true,
    stageFirst: 1,
    stageSecond: 1,
    useTimeInterval: '30',
    prepareTimeInterval: '10',
    cleanupTimeInterval: '10',
    prepareStartTime: null,
    performanceStartTime: null,
    performanceEndTime: null,
    cleanupEndTime: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    groupId: GROUP_ID,
    fesDateId: 1,
    isSunny: false,
    stageFirst: 2,
    stageSecond: 2,
    useTimeInterval: '30',
    prepareTimeInterval: '10',
    cleanupTimeInterval: '10',
    prepareStartTime: null,
    performanceStartTime: null,
    performanceEndTime: null,
    cleanupEndTime: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];
