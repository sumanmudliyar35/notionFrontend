import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for lead detail by leadId
const fetchLeadsDetail = async ({ queryKey }: QueryFunctionContext) => {
  const [, leadId] = queryKey;
  const response = await axiosInstance.get(`/leads/getLeadsDetails?leadId=${leadId}`);
  return response.data;
};

// Custom hook for fetching lead detail
export const useGetLeadsDetail = (leadId: number | string | undefined | null) => {
  return useQuery(
    ["leadsDetail", leadId],
    fetchLeadsDetail,
    { enabled: !!leadId } // Only run if leadId is truthy
  );
};