import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get table preferences by user ID
const fetchRecursiveTaskTablePreference = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/tablePreference/getRecursiveTaskTablePreferenceByUser?userId=${userId}`);
  return response.data;
};

// Custom hook
export const useGetRecursiveTaskTablePreference = (userId: any) => {
  return useQuery(["recursiveTaskTablePreference", userId], fetchRecursiveTaskTablePreference);
};