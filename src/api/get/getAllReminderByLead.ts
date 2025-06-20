import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get reminders by lead ID
const fetchRemindersByLead = async ({ queryKey }: QueryFunctionContext) => {
  const [, leadId] = queryKey;
  const response = await axiosInstance.get(`/reminder/getAllReminderByLead?leadId=${leadId}`);
  return response.data;
};

// Custom hook
export const useGetRemindersByLead = (leadId: number | string) => {
  return useQuery(["remindersByLead", leadId], fetchRemindersByLead);

};
