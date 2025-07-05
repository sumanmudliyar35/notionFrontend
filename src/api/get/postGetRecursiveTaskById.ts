import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to get a recursive task by ID
const postGetRecursiveTaskById: MutationFunction<any, [any]> = async (
  params: [any]
) => {
  const [taskId] = params;

  const response = await axiosInstance.get(
    `/recursiveTask/getRecursiveTaskById?id=${taskId}`,
  );

  return response.data;
};

// Custom hook to use in components
export const usePostGetRecursiveTaskById = () => {
  return useMutation(postGetRecursiveTaskById);

};