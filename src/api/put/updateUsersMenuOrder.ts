import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update user's menu order
const updateUsersMenuOrder: MutationFunction<any, [any,any ]> = async (
  params
) => {
  const [body, userId ] = params;
  const response = await axiosInstance.put(
    `/usersMenuOrder/updateUsersMenuOrder?userId=${userId}`,
    body
  );
  return response.data;
};

// Custom hook to use in components
export const useUpdateUsersMenuOrder = () => {
  return useMutation(updateUsersMenuOrder);

};