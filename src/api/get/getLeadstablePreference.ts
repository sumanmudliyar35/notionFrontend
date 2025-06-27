import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get table preferences by user ID
const fetchLeadsTablePreference = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/tablePreference/getLeadTablePreferenceByUser?userId=${userId}`);
  return response.data;
};

// Custom hook
export const useGetLeadsTablePreference = (userId: any) => {
  return useQuery(["leadsTablePreference", userId], fetchLeadsTablePreference);
};