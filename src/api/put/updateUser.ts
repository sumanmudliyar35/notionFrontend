import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const updateUser: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, userId] = params;

  const response = await axiosInstance.put(
    `/users/updateUser?userId=${userId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateUser = () => {
  return useMutation(updateUser);
};
