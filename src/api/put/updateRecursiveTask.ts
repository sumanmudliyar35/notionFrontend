import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update a recursive task
const updateRecursiveTask: MutationFunction<any, [any, number]> = async (
  params: [any, number]
) => {
  const [body, taskId] = params;

  const response = await axiosInstance.put(
    `/recursiveTask/updateRecursiveTask?id=${taskId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateRecursiveTask = () => {
  return useMutation(updateRecursiveTask);
};