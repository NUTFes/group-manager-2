// モックレスポンスの組み立て。
// Rails 側の実装に合わせ、封筒は { status, data }・キーは snake_case で返す
// (src/api/api.ts の request() が camelcase-keys で変換するため)。
import type { Route } from '@playwright/test';
import {
  type FireEquipmentBody,
  type FireEquipmentOrder,
  ORDER_TYPES,
  type PowerOrder,
  type ScenarioState,
  type SubmissionApplicationType,
  type SubmissionStatusValue,
  mockGroupId,
} from './scenarioState';

export const apiResponse = <T>(data: T) => ({
  status: { code: 200, message: 'Success' },
  data,
});

/**
 * 未登録を表す封筒。HTTPは200のまま status.code だけ404にする。
 * 取得系フックが `status.code === 200` を見て undefined に落とす経路を再現するため。
 */
export const apiNotFound = () => ({
  status: { code: 404, message: 'Not Found' },
  data: null,
});

export const fulfillJson = (route: Route, body: unknown) =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });

export const submission = (
  applicationType: SubmissionApplicationType,
  id: number,
  status: SubmissionStatusValue
) => ({
  id,
  application_type: applicationType,
  status,
  comments: [],
  detail: null,
});

export const checkAllRegistered = (state: ScenarioState) => ({
  group: state.group !== null,
  // 「申請しない」を登録した場合も回答済みとみなす(バックエンドと同じ扱い)。
  sub_rep:
    state.viceRepresentative !== null ||
    state.unregisteredOrderTypes.includes(ORDER_TYPES.subRep),
  rental_item: true,
  place_order: state.placeOrder !== null,
  stage_order: state.stageOrders.length > 0,
  stage_option: state.stageOption !== null,
  power_order: state.powerOrders.length > 0,
  employee: false,
  venue_map: state.venueMap !== null,
  food_product: false,
  purchase_list: false,
  cooking_process_order: state.cookingProcessOrders.length > 0,
  fire_equipment_order: state.fireEquipmentOrders.length > 0,
  public_relation: state.publicRelation !== null,
});

export const userPageSettings = (state: ScenarioState) => {
  const canEdit = state.pageMode === 'registration';

  return {
    id: 1,
    is_regist_group: true,
    is_regist_food_product: false,
    is_edit_group: canEdit,
    is_edit_sub_rep: canEdit,
    is_edit_place: canEdit,
    is_edit_power_order: canEdit,
    is_edit_rental_order: canEdit,
    is_edit_stage_order: canEdit,
    is_edit_employee: canEdit,
    is_edit_food_product: canEdit,
    is_edit_purchase_list: canEdit,
    add_power_order: canEdit,
    add_rental_order: canEdit,
    add_employee: canEdit,
    add_food_product: canEdit,
    add_purchase_list: canEdit,
    fes_year_id: 1,
    is_edit_announcement: false,
    add_announcement: false,
    is_edit_user: false,
    is_edit_stage_common_option: canEdit,
    is_edit_public_relation: canEdit,
    is_edit_venue_map: canEdit,
    is_edit_cooking_process: canEdit,
    add_fire_equipment_order: state.fireEquipmentPermissions.canAdd,
    is_edit_fire_equipment_order: state.fireEquipmentPermissions.canEdit,
    add_stage_order: canEdit,
  };
};

export const powerOrderFromBody = (
  body: Partial<PowerOrder>,
  id: number
): PowerOrder => ({
  id,
  group_id: body.group_id ?? mockGroupId,
  item: body.item ?? '',
  power: body.power ?? 0,
  manufacturer: body.manufacturer ?? '',
  model: body.model ?? '',
  item_url: body.item_url ?? '',
});

export const fuelToApiValue = (
  fuel: number | FireEquipmentOrder['fuel']
): FireEquipmentOrder['fuel'] => {
  if (typeof fuel === 'string') return fuel;
  if (fuel === 2) return 'lp_gas';
  if (fuel === 3) return 'charcoal';
  return 'gas_bottle';
};

export const fireEquipmentFromBody = (
  body: FireEquipmentBody,
  id: number
): FireEquipmentOrder => ({
  id,
  group_id: body.group_id ?? mockGroupId,
  name: body.name ?? '',
  quantity: body.quantity ?? 0,
  fuel: fuelToApiValue(body.fuel ?? 'gas_bottle'),
  usage: body.usage ?? '',
  is_takeaway: body.is_takeaway ?? true,
  remark: body.remark ?? '',
});
