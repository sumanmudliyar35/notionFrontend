import { useQuery } from "react-query";
import type {QueryFunctionContext} from 'react-query';
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for leads by user
const fetchLeadsByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId, offset, filters, limit] = queryKey;
  const response = await axiosInstance.get(`/leads/getLeadsByUser?userid=${userId}&offset=${offset}&filters=${JSON.stringify(filters)}&limit=${limit}`);
  return response.data;
};

// Custom hook for fetching leads by user
export const useGetLeadsByUser = (userId: number | string, offset: number, filters: any, limit: number) => {
  return useQuery(["leadsByUser", userId], fetchLeadsByUser);
};
