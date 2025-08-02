import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get reminders by taskId and userId
const fetchReminderByTaskAndUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, taskId, userId] = queryKey;
  const response = await axiosInstance.get(`/reminder/getReminderByTaskAndUser?taskId=${taskId}&userId=${userId}`);
  return response.data;
};

// Custom hook with polling every minute
export const useGetReminderByTaskAndUser = (taskId: string | number, userId: string | number) => {
  return useQuery(
    ["reminderByTaskAndUser", taskId, userId],
    fetchReminderByTaskAndUser,
    
    );
};