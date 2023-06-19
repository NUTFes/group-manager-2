interface Item {
  code: number;
  message: string;
  id: number;
  name: string;
  is_inside_shop_rentable: boolean;
  is_outside_shop_rentable: boolean;
  created_at: string;
  updated_at: string;
}

export default Item;
