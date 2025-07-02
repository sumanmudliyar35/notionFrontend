import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update bulk recursive tasks
const updateBulkRecursiveTask: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, userId] = params;

  const response = await axiosInstance.put(
    `/recursiveTask/updateBulkRecursiveTask?userid=${userId}`,
    body
  );

  return response.data;
};

export const useUpdateBulkRecursiveTask = () => {
  return useMutation(updateBulkRecursiveTask);
};