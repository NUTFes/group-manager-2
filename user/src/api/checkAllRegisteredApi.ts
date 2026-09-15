import { useAuthenticatedGet } from '@/hooks/useApi';

// openapiの型定義に変えたい
export type RegistrationStatus = {
  group: boolean;
  subRep: boolean;
  rentalItem: boolean;
  placeOrder: boolean;
  stageOrder: boolean;
  stageOption: boolean;
  powerOrder: boolean;
  employee: boolean;
  venueMap: boolean;
  foodProduct: boolean;
  purchaseList: boolean;
  cookingProcessOrder: boolean;
  fireEquipmentOrder: boolean;
  publicRelation: boolean;
};

export type ApiStatus = {
  code: number;
  message: string;
};

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
};

const API_ENDPOINTS = {
  CHECK_ALL_REGISTERED: '/check_all_registered',
};

export const useGetCheckAllRegisteredGroups = (groupId: number | undefined) => {
  const endpoint =
    groupId && groupId > 0
      ? `${API_ENDPOINTS.CHECK_ALL_REGISTERED}/${groupId}`
      : null;

  const { data, error, isLoading, mutate } =
    useAuthenticatedGet<ApiResponse<RegistrationStatus>>(endpoint);

  const checkAllRegisteredGroups = data?.data ?? undefined;

  return {
    checkAllRegisteredGroups,
    isLoading,
    error,
    mutateCheckAllRegisteredGroups: mutate,
  };
};
