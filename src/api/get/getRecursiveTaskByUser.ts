import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get recursive tasks by user ID
const fetchRecursiveTaskByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId, currentMonth, currentYear] = queryKey;
  const response = await axiosInstance.get(`/recursiveTask/getRecursiveTaskByUser?userId=${userId}&currentMonth=${currentMonth}&currentYear=${currentYear}`);
  return response.data;
};

// Custom hook
export const useGetRecursiveTaskByUser = (userId: number | string, currentMonth: number, currentYear: number) => {
  return useQuery(["recursiveTaskByUser", userId, currentMonth, currentYear], fetchRecursiveTaskByUser);

};