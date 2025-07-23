import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for leads by followup date
const fetchLeadByFollowup = async ({ queryKey }: QueryFunctionContext) => {
  const response = await axiosInstance.get(
    `/leads/getLeadByFollowup`
  );
  return response.data;
};

// Custom hook for fetching leads by followup date
export const useGetLeadByFollowup = () => {
  return useQuery(["leadByFollowup"], fetchLeadByFollowup);
};