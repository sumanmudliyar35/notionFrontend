import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for task detail by taskId
const fetchTaskDetail = async ({ queryKey }: QueryFunctionContext) => {
  const [, taskId] = queryKey;
  const response = await axiosInstance.get(`/task/getTaskDetail?taskId=${taskId}`);
  return response.data;
};

// Custom hook for fetching task detail
export const useGetTaskDetail = (taskId: number | string) => {
  return useQuery(["taskDetail", taskId], fetchTaskDetail,     { enabled: !!taskId } // Only run if taskId is truthy
);
};