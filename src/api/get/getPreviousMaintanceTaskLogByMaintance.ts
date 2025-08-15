import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get previous maintenance task logs by maintanceId
const fetchPreviousMaintanceTaskLogsByMaintance = async ({ queryKey }: QueryFunctionContext) => {
  const [, maintanceId] = queryKey;
  const response = await axiosInstance.get(`/maintanceTaskLogs/getPreviousRecursiveTaskLogsByMaintanceId?id=${maintanceId}`);
  return response.data;
};

// Custom hook
export const useGetPreviousMaintanceTaskLogsByMaintance = (maintanceId: number | string) => {
  return useQuery(
    ["previousMaintanceTaskLogsByMaintance", maintanceId],
    fetchPreviousMaintanceTaskLogsByMaintance,
    { enabled: !!maintanceId }
  );
};