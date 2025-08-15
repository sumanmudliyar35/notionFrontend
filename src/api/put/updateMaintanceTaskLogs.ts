import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update maintenance task logs
const updateMaintanceTaskLogs: MutationFunction<any, [any, any, any]> = async (
  params: [any, any, any]
) => {
  const [body, taskLogId, userId] = params;

  const response = await axiosInstance.put(
    `/maintanceTaskLogs/updateMaintanceTaskLogs?id=${taskLogId}&userId=${userId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateMaintanceTaskLogs = () => {
  return useMutation(updateMaintanceTaskLogs);
};