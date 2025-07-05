import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to get comments by recursive task log ID
const getCommentByRecursiveTaskLogId: MutationFunction<any, [any]> = async (
  params: [any]
) => {
  const [recursiveTaskLogId] = params;

  const response = await axiosInstance.get(
    `/recursiveTaskLogs/getCommentByRecursiveTaskLogId?recursiveTaskLogId=${recursiveTaskLogId}`,
  );

  return response.data;
};

// Custom hook to use in components
export const useGetCommentByRecursiveTaskLogId = () => {
  return useMutation(getCommentByRecursiveTaskLogId);
};