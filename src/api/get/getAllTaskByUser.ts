import { useQuery } from "react-query";
import type {QueryFunctionContext} from 'react-query';
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for leads by user
const fetchTasksByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId, offset] = queryKey;
  const response = await axiosInstance.get(`/task/getAllTaskByUser?userId=${userId}&offset=${offset}`);
  return response.data;
};

// Custom hook for fetching tasks by user
export const useGetTasksByUser = (userId: number | string, offset: number) => {
  return useQuery(["tasksByUser", userId, offset], fetchTasksByUser);
};
