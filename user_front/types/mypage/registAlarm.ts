interface RegistInfo{
  status: Status
  data: Data[]
}

interface Status{
  code: number
  message: string
}

interface Data{
  employees: Employee[]
  food_products: FoodProducts[]
  group: Group
  group_category: string
  place_order: PlaceOrders
  power_orders: PowerOrders[]
  rental_orders: RentalOrders[]
  stage_common_option: StageCommonOption
  stage_orders: StageOrders[]
  sub_rep: SubRep
}

export interface Employee{
  name: string
  stool_test: string
  student_id: number
}

export interface FoodProducts{
  food_product: FoodProduct
  purchase_lists: PurchaseLists[]
}

export interface FoodProduct {
  id: number;
  group_id: number;
  name: string;
  is_cooking: boolean;
  first_day_num: number;
  second_day_num: number;
  created_at: string;
  updated_at: string;
}

export interface PurchaseLists{
  purchase_list: PurchaseList
}

interface PurchaseList{
  date: string
  day: string
  days_num: number
  food_product: string
  is_fresh: boolean
  items: string
  shop: string
  year: number
  url: string
}

export interface Group{
  activity: string
  committee: string
  created_at: string
  fes_year_id: number
  group_category_id: number
  id: number
  name: string
  project_name: string
  updated_at: string
  user_id: number
  is_external: boolean
}


export interface PlaceOrders{
  first: string
  place_order: PlaceOrder
  remark: string
  second: string
  third: string
}

export interface Date {
  id: number;
  days_num: number;
  date: string;
  day: string;
  fes_year_id: number;
  created_at: string;
  updated_at: string;
}

interface FesYear {
  id: number;
  year_num: number;
  created_at: string;
  updated_at: string;
}

export interface FesDate {
  fes_date: Date;
  fes_year: FesYear;
}

interface PlaceOrder{
  created_at: string
  first: number
  group_id: number
  id: number
  remark: string
  second: number
  third: number
  updated_at: string
}

export interface PowerOrders{
  power_order: PowerOrder
}

interface PowerOrder{
  id: number
  item: string
  item_url: string
  manufacturer: string
  model: string
  power: number
}

export interface RentalOrders{}
export interface StageCommonOption{}
export interface StageOrders{}
export interface SubRep{}

export interface StateRegistAlarm{
  employees : Employee[]
  foodProducts : FoodProducts[]
  group : Group
  groupCategory : string
  groupId : number
  groupCategoryId: number
  groupName: string
  placeOrders : PlaceOrders[]
  powerOrders : PowerOrders[]
  purchaseLists : PurchaseLists[]
  rentalOrders : RentalOrders[]
  stageCommonOption : StageCommonOption
  stageOrders : StageOrders
  subRep : SubRep
  isRegistGroup : boolean
  isEditGroup: boolean
  addEmployee: boolean,
  addFoodProduct: boolean,
  addPurchaseList: boolean,
  addPowerOrder: boolean,
  addRentalOrder: boolean,
}


export default RegistInfo


