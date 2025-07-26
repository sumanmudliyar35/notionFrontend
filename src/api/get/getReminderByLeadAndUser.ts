import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get reminders by leadId and userId
const fetchReminderByLeadAndUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, leadId, userId] = queryKey;
  const response = await axiosInstance.get(`/reminder/getReminderByLeadAndUser?leadId=${leadId}&userId=${userId}`);
  return response.data;
};

// Custom hook with polling every minute
export const useGetReminderByLeadAndUser = (leadId: string | number, userId: string | number) => {
  return useQuery(
    ["reminderByLeadAndUser", leadId, userId],
    fetchReminderByLeadAndUser,
    // {
    //   enabled: !!leadId && !!userId,
    // }

    );
};