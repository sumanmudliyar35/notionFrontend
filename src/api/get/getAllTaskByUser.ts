import { useQuery } from "react-query";
import type {QueryFunctionContext} from 'react-query';
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for leads by user
const fetchTasksByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId, offset, filters, enabledFilters,] = queryKey;
  const response = await axiosInstance.get(`/task/getAllTaskByUser?userId=${userId}&offset=${offset}&filters=${JSON.stringify(filters)}&enabledFilters=${JSON.stringify(enabledFilters)}`);
  return response.data;
};

// Custom hook for fetching tasks by user
export const useGetTasksByUser = (userId: number | string, offset: number, filters: Record<string, string | string[]>, enabledFilters: Record<string, boolean>) => {
  return useQuery(["tasksByUser", userId, offset, filters, enabledFilters], fetchTasksByUser);
};
