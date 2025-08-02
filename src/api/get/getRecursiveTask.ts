import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get recursive tasks by user, date, month, year
const fetchRecursiveTasks = async ({ queryKey }: QueryFunctionContext) => {
  const [,taskId] = queryKey;
  const response = await axiosInstance.get(
    `/recursiveTask/getRecursiveTask?id=${taskId}`,
  );
  return response.data;
};

// Custom hook
export const useGetRecursiveTask = (
  taskId: number,
 
) => {
  return useQuery(
    ["recursiveTasksByUser", taskId,],
    fetchRecursiveTasks,
    { enabled: !!taskId }

      );
};