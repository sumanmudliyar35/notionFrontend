import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get recursive tasks by user ID
const fetchRecursiveTaskByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId, currentDate, currentMonth, currentYear] = queryKey;
  const response = await axiosInstance.get(`/recursiveTask/getRecursiveTaskByUser?userId=${userId}&currentDate=${currentDate}&currentMonth=${currentMonth}&currentYear=${currentYear}`);
  return response.data;
};

// Custom hook
export const useGetRecursiveTaskByUser = (userId: number | string, currentDate:number, currentMonth: number, currentYear: number) => {
  return useQuery(["recursiveTaskByUser", userId,currentDate, currentMonth, currentYear], fetchRecursiveTaskByUser);

};