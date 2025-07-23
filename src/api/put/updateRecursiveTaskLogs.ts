import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update a recursive task log
const updateRecursiveTaskLog: MutationFunction<any, [any, any, any, any]> = async (
  params: [any, any, any, any]
) => {
  const [body, onDate, logId, userId] = params;

  const response = await axiosInstance.put(
    `/recursiveTaskLogs/updateRecursiveTaskLog?onStartDate=${onDate}&taskId=${logId}&userId=${userId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateRecursiveTaskLog = () => {
     return useMutation(updateRecursiveTaskLog);
};