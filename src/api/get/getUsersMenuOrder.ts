import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for user's menu order
const fetchUsersMenuOrder = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/usersMenuOrder/getUsersMenuOrder?userId=${userId}`);
  return response.data;
};

// Custom hook for fetching user's menu order
export const useGetUsersMenuOrder = (userId: number | string) => {
  return useQuery(["usersMenuOrder", userId], fetchUsersMenuOrder);
};