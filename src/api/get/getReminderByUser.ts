import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get reminders by userId
const fetchReminderByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/reminder/getReminderByUserId?userId=${userId}`);
  return response.data;
};

// Custom hook with polling every minute
export const useGetReminderByUser = (userId: string | number) => {
  return useQuery(
    ["reminderByUser", userId],
    fetchReminderByUser,
    {
      refetchInterval: 60000, // Poll every 60 seconds
      enabled: !!userId,
    }
  );
};