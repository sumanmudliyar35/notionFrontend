import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get access by owner
const fetchAccessByOwner = async ({ queryKey }: QueryFunctionContext) => {
  const [, ownerId] = queryKey;
  const response = await axiosInstance.get(`/usersAccess/getAccessByOwner?userId=${ownerId}`);
  return response.data;
};

// Custom hook
export const useGetAccessByOwner = (ownerId: number | string) => {
  return useQuery(["accessByOwner", ownerId], fetchAccessByOwner);
};