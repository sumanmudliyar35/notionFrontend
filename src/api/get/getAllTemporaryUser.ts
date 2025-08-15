import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function for all temporary users by user
const fetchAllTemporaryUsers = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId] = queryKey;
  const response = await axiosInstance.get(
    `/temporaryUser/getAllTemporaryUsers?userId=${userId}`
  );
  return response.data;
};

export const useGetAllTemporaryUsers = (
  userId: number | string,
  
) => {
  return useQuery(
    ["allTemporaryUsers", userId],
    fetchAllTemporaryUsers
  );
};