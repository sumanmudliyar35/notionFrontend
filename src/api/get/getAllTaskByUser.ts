import { useQuery } from "react-query";
import type {QueryFunctionContext} from 'react-query';
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for leads by user
const fetchTasksByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/task/getAllTaskByUser?userId=${userId}`);
  return response.data;
};

// Custom hook for fetching tasks by user
export const useGetTasksByUser = (userId: number | string) => {
  return useQuery(["tasksByUser", userId], fetchTasksByUser);
};
