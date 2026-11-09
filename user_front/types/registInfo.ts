interface RegistInfo{
  status: Status;
  data: Data[];
}

interface Status{
  code: number;
  message: string;
}

export interface Data {
  group: Group;
  group_category: string;
  sub_rep: Sub_rep;
  place_order: string;
  stage_orders: Stage_orders[];
  stage_common_option: Stage_common_option;
  power_orders: Power_orders[];
  rental_orders: Rental_orders[];
  employees: string;
  food_products: string;
}

interface Group {
  id: number;
  name: string;
  project_name: string;
  activity: string;
  user_id: number;
  group_category_id: number;
  fes_year_id: number;
  created_at: string;
  updated_at: string;
  committee: string;
}

interface Sub_rep {
  id: number;
  name: string;
  department: string;
  department_id: number;
  grade: string;
  grade_id: number;
  tel: string;
  email: string;
  student_id: number;
}

interface Stage_orders {
  stage_order: {
    stage_order: Stage_order;
  }
  is_sunny: boolean;
  year: number;
  date: string;
  day: string;
  day_num: number;
  stage_first: string;
  stage_second: string;
  use_time_interval: string;
  prepare_time_interval: string;
  cleanup_time_interval: string;
  prepare_start_time: string;
  performance_start_time: string;
  performance_end_time: string;
  cleanup_end_time: string;
}

interface Stage_order {
  id: number;
  group_id: number;
  is_sunny: boolean;
  fes_date_id: number;
  stage_first: string;
  stage_second: string;
  use_time_interval: string;
  prepare_time_interval: string;
  cleanup_time_interval: string;
  prepare_start_time: string;
  performance_start_time: string;
  performance_end_time: string;
  cleanup_end_time: string;
  created_at: string;
  updated_at: string;
}

interface Stage_common_option {
  id: number;
  own_equipment: boolean;
  bgm: boolean;
  camera_permission: boolean;
  loud_sound: boolean;
}

interface Power_orders {
  power_order: Array<{
    id: number,
    item: string,
    power: number,
    manufacturer: string,
    model: string,
    item_url: string
  }>
}

interface Rental_orders{
  rental_item: {
    rental_item: Rental_item
  }
  name: string;
  is_inside_shop_rentable: boolean;
  is_outside_shop_rentable: boolean;
  is_stage_rentable: boolean;
  num: number;
}

interface Rental_item {
  id: number;
  group_id: number;
  rental_item_id: number;
  num: number;
  created_at: string;
  updated_at: string;
}

export default RegistInfo;
