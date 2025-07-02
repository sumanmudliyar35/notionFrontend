import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to create a recursive task
const createRecursiveTask: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, userId] = params;

  const response = await axiosInstance.post(
    `/recursiveTask/createRecursiveTask`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useCreateRecursiveTask = () => {
  return useMutation(createRecursiveTask);

};