import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update a recursive task
const updateRecursiveTask: MutationFunction<any, [any, number, any]> = async (
  params: [any, number, any]
) => {
  const [body, taskId, userId] = params;

  const response = await axiosInstance.put(
    `/recursiveTask/updateRecursiveTask?id=${taskId}&userId=${userId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateRecursiveTask = () => {
  return useMutation(updateRecursiveTask);
};