import { useApiGet } from '@/hooks/useApi';

const API_ENDPOINTS = {
  STAGE_OPTIONS: '/user_page_settings',
};

export type UserPageSettings = {
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
  created_at: string;
  updated_at: string;
  add_power_order: boolean;
  add_rental_order: boolean;
  add_employee: boolean;
  add_food_product: boolean;
  add_purchase_list: boolean;
  fes_year_id: number;
  is_edit_announcement: boolean;
  add_announcement: boolean;
  is_edit_user: boolean;
  is_edit_stage_common_option: boolean;
  is_edit_public_relation: boolean;
  is_edit_venue_map: boolean;
  is_edit_cooking_process: boolean;
  add_stage_order: boolean;
};

export const useGetUserPageSettings = () => {
  const endpoint = `${API_ENDPOINTS.STAGE_OPTIONS}`;

  const { data, error, isLoading } = useApiGet<{
    data: UserPageSettings;
  }>(endpoint);

  return {
    userPageSettings: data?.data,
    isLoading,
    hasError: !!error,
  };
};
