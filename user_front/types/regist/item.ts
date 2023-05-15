export interface Item {
  status: Status;
  data: ItemList[];
}

interface Status {
  code: number;
  message: string;
}

export interface ItemList {
  created_at: string;
  id: number;
  is_inside_shop_rentable: boolean;
  is_outside_shop_rentable: boolean;
  is_stage_rentable: boolean;
  name: string;
  updated_at: string;
}
