import { useQuery } from "react-query";
import type {QueryFunctionContext} from 'react-query';
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for leads by user
const fetchLeadsByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(`/leads/getLeadsByUser?userid=${userId}`);
  return response.data;
};

// Custom hook for fetching leads by user
export const useGetLeadsByUser = (userId: number | string) => {
  return useQuery(["leadsByUser", userId], fetchLeadsByUser);
};
