import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get recursive tasks by user ID
const fetchRecursiveTaskByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId, currentDate, currentMonth, currentYear, type , startDate, endDate] = queryKey;
  const response = await axiosInstance.get(`/recursiveTask/getRecursiveTaskByUser?userId=${userId}&currentDate=${currentDate}&currentMonth=${currentMonth}&currentYear=${currentYear}&type=${type}&startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

// Custom hook
export const useGetRecursiveTaskByUser = (userId: number | string, currentDate:number, currentMonth: number, currentYear: number, type: string, startDate: string, endDate: string, shouldFetchRecursiveTasks: boolean) => {
  return useQuery(["recursiveTaskByUser", userId,currentDate, currentMonth, currentYear, type, startDate, endDate], fetchRecursiveTaskByUser, {
    enabled: shouldFetchRecursiveTasks
  });

};