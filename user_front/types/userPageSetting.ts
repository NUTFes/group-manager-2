interface UserPageSetting {
  id: number;
  is_regist_group: boolean;
  is_regist_food_product: boolean;
  is_edit_group: boolean;
  is_edit_sub_rep: boolean;
  is_edit_place: boolean;
  is_edit_power_order: boolean;
  is_edit_rental_order: boolean;
  is_edit_stage_order: boolean;
  is_edit_employee: boolean;
  is_edit_food_product: boolean;
  is_edit_purchase_list: boolean;
  add_power_order: boolean;
  add_rental_order: boolean;
  add_employee: boolean;
  add_food_product: boolean;
  add_purchase_list: boolean;
  fes_yaer_id: number;
}

export default UserPageSetting;
