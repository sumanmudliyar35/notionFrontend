import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get previous recursive task logs by recursiveTaskLogId
const fetchPreviousRecursiveTaskLogsByRecursiveId = async ({ queryKey }: QueryFunctionContext) => {
  const [, recursiveTaskLogId] = queryKey;
  const response = await axiosInstance.get(`/recursiveTaskLogs/getPreviousRecursiveTaskLogsByRecursiveId?id=${recursiveTaskLogId}`);
  return response.data;
};

// Custom hook
export const useGetPreviousRecursiveTaskLogsByRecursiveId = (recursiveTaskLogId: number | string) => {
  return useQuery(
    ["previousRecursiveTaskLogsByRecursiveId", recursiveTaskLogId],
    fetchPreviousRecursiveTaskLogsByRecursiveId,
    { enabled: !!recursiveTaskLogId }
  );
};