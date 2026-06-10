import { useAuthenticatedGet } from '@/hooks/useApi';

const API_ENDPOINTS = {
  USER_PAGE_SETTINGS: '/user_page_settings',
};

export type UserPageSettings = {
  id: number;
  isRegistGroup: boolean;
  isRegistFoodProduct: boolean;
  isEditGroup: boolean;
  isEditSubRep: boolean;
  isEditPlace: boolean;
  isEditPowerOrder: boolean;
  isEditRentalOrder: boolean;
  isEditStageOrder: boolean;
  isEditEmployee: boolean;
  isEditFoodProduct: boolean;
  isEditPurchaseList: boolean;
  createdAt: string;
  updatedAt: string;
  addPowerOrder: boolean;
  addRentalOrder: boolean;
  addEmployee: boolean;
  addFoodProduct: boolean;
  addPurchaseList: boolean;
  fesYearId: number;
  isEditAnnouncement: boolean;
  addAnnouncement: boolean;
  isEditUser: boolean;
  isEditStageCommonOption: boolean;
  isEditPublicRelation: boolean;
  isEditVenueMap: boolean;
  isEditCookingProcess: boolean;
  addFireEquipmentOrder: boolean;
  isEditFireEquipmentOrder: boolean;
  addStageOrder: boolean;
};

export const useGetUserPageSettings = () => {
  const endpoint = `${API_ENDPOINTS.USER_PAGE_SETTINGS}`;

  const { data, error, isLoading } = useAuthenticatedGet<{
    data: UserPageSettings;
  }>(endpoint);

  return {
    userPageSettings: data?.data,
    isLoading,
    hasError: !!error,
  };
};
