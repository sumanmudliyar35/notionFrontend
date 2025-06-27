import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get table preferences by user ID
const fetchTaskTablePreference = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/tablePreference/getTaskTablePreferenceByUser?userId=${userId}`);
  return response.data;
};

// Custom hook
export const useGetTaskTablePreference = (userId: any) => {
  return useQuery(["taskTablePreference", userId], fetchTaskTablePreference);
};