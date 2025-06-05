import { useQuery } from "react-query";
import type {QueryFunctionContext} from 'react-query';
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for leads by user
const fetchEventsByLead = async ({ queryKey }: QueryFunctionContext) => {
  const [, leadId] = queryKey;
  const response = await axiosInstance.get(`/event/getEventsByLeadId?leadId=${leadId}`);
  return response.data;
};

// Custom hook for fetching leads by user
export const useGetEventsByLead = (leadId: number | string) => {
  return useQuery(["EventsByLead", leadId], fetchEventsByLead);
};
