import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get comments by lead ID
const fetchCommentsByLead = async ({ queryKey }: QueryFunctionContext) => {
  const [, leadId] = queryKey;
  const response = await axiosInstance.get(`/comment/getCommentsByLead?leadId=${leadId}`);
  return response.data;
};

// Custom hook
export const useGetCommentsByLead = (leadId: number | string) => {
  return useQuery(["commentsByLead", leadId], fetchCommentsByLead);
};
