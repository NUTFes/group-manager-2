import { useAuthenticatedGet, useAuthenticatedPost } from '@/hooks/useApi';

const API_ENDPOINTS = {
  USER_DETAILS: '/user_details',
  USER_DETAILS_UPDATE: '/api/v1/current_user/edit_user_info',
};

export type UserDetails = {
  id: number | null;
  tel: string | null;
  gradeId: number | null;
  departmentId: number | null;
  userId: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  studentId: number | null;
};

type User = {
  id: number;
  provider: string;
  uid: string;
  allowPasswordChange: boolean;
  name: string;
  email: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
};

export type UserInformation = {
  user: User;
  userDetail: UserDetails;
};

export const useGetUserDetails = (userId: number) => {
  const endpoint = `${API_ENDPOINTS.USER_DETAILS}?user_id=${userId}`;

  const { data, error, isLoading } = useAuthenticatedGet<{ data: UserDetails }>(
    endpoint
  );

  return {
    userDetails: data?.data,
    isLoading,
    hasError: !!error,
  };
};

export const useMutateUserDetails = () => {
  const endpoint = API_ENDPOINTS.USER_DETAILS_UPDATE;
  return useAuthenticatedPost(endpoint);
};

export const useGetCurrentUserInformation = () => {
  const endpoint = '/api/v1/current_user';
  const { data, error, isLoading, mutate } = useAuthenticatedGet<{
    data: UserInformation;
  }>(endpoint);

  return {
    userInformation: data?.data,
    isLoading,
    hasError: !!error,
    mutate,
  };
};
