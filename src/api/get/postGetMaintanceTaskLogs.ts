import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to get maintenance task logs by taskId
const getMaintanceTaskLogs: MutationFunction<any, [any]> = async (
  params: [any]
) => {
  const [taskId] = params;

  const response = await axiosInstance.get(
    `/maintanceTaskLogs/getMaintanceTaskLogs?id=${taskId}`,
  );

  return response.data;
};

export const useGetMaintanceTaskLogs = () => {
  return useMutation(getMaintanceTaskLogs);
};