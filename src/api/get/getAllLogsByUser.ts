import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get all logs by userId
const fetchAllLogsByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/logs/changedby?userId=${userId}`);
  return response.data;
};

// Custom hook
export const useGetAllLogsByUser = (userId: string | number) => {
  return useQuery(["allLogsByUser", userId], fetchAllLogsByUser, {
    enabled: !!userId,
  });
};