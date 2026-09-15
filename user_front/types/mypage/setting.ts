interface Setting{
  status : Status
  data : Data[]
}

interface Status{
  code : number
  message : string
}

interface Data{
  add_employee: boolean
  add_food_product: boolean
  add_power_order: boolean
  add_purchase_list: boolean
  add_rental_order: boolean
  created_at: string
  fes_year_id: number
  id: number
  is_edit_employee: boolean
  is_edit_food_product: boolean
  is_edit_group: boolean
  is_edit_user: boolean
  is_edit_place: boolean
  is_edit_power_order: boolean
  is_edit_purchase_list: boolean
  is_edit_rental_order: boolean
  is_edit_stage_order: boolean
  is_edit_stage_common_option: boolean
  is_edit_sub_rep: boolean
  is_regist_food_product: boolean
  is_regist_group: boolean
  is_edit_public_relation: boolean
  is_edit_venue_map: boolean | undefined
  is_edit_cooking_process: boolean | undefined
  updated_at: string
}

export default Setting
