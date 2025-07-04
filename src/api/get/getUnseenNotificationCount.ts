import { useQuery } from "react-query";
import type {QueryFunctionContext} from 'react-query';
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for unseen notifications count
const fetchUnseenNotificationCount = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/mention/countUnseenNotification?userId=${userId}`);
  return response.data;
};

// Custom hook for fetching unseen notification count
export const useGetUnseenNotificationCount = (userId: number | string) => {
  return useQuery(["unseenNotificationCount", userId], fetchUnseenNotificationCount);
};
