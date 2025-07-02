import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get recursive tasks by user ID
const fetchRecursiveTaskByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/recursiveTask/getRecursiveTaskByUser?userId=${userId}`);
  return response.data;
};

// Custom hook
export const useGetRecursiveTaskByUser = (userId: number | string) => {
  return useQuery(["recursiveTaskByUser", userId], fetchRecursiveTaskByUser);

};