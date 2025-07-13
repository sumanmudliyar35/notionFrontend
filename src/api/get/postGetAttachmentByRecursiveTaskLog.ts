import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to get a recursive task by ID
const postGetRecursiveTaskLogsAttachmentByTask: MutationFunction<any, [any]> = async (
  params: [any]
) => {
  const [taskId] = params;

  const response = await axiosInstance.get(
    `/recursiveTaskLogs/getAttachmentsByRecursiveTaskLogId?recursiveTaskLogId=${taskId}`,
  );

  return response.data;
};

// Custom hook to use in components
export const usepostGetRecursiveTaskLogsAttachmentByTask = () => {
  return useMutation(postGetRecursiveTaskLogsAttachmentByTask);

};