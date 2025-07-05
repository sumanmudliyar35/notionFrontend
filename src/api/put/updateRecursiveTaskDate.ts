import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update a recursive task date
const updateRecursiveTaskDate: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, taskId] = params;

  const response = await axiosInstance.put(
    `/recursiveTask/updateRecursiveTaskDate?taskId=${taskId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateRecursiveTaskDate = () => {
  return useMutation(updateRecursiveTaskDate);
};