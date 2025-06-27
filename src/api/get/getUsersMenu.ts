import { useQuery } from "react-query";
import type {QueryFunctionContext} from 'react-query';
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for leads by user
const fetchUsersMenu = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/users/getUsersMenu?userId=${userId}`);
  return response.data;
};

// Custom hook for fetching users menu
export const useGetUsersMenu = (userId: number | string) => {
  return useQuery(["usersMenu", userId], fetchUsersMenu);
};
