import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update user access
const updateUserAccess: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, accessId] = params;

  const response = await axiosInstance.put(
    `/usersAccess/updateUserAccess?accessId=${accessId}`,
    body
  );

  return response.data;
};

export const useUpdateUserAccess = () => {
  return useMutation(updateUserAccess);
};