import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to create or update user access
const createUserAccess: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, userId] = params;

  const response = await axiosInstance.post(
    `/usersAccess/createAccess`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useCreateUserAccess = () => {
  return useMutation(createUserAccess);
};