import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update a temporary user
const updateTemporaryUser: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, userId] = params;

  const response = await axiosInstance.put(
    `/temporaryUser/updateTemporaryUser?userId=${userId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateTemporaryUser = () => {
  return useMutation(updateTemporaryUser);
};