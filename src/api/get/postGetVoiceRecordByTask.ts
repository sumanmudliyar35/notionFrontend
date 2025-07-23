import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to get voice record by task ID
const postGetVoiceRecordByTask: MutationFunction<any, [any]> = async (
  params: [any]
) => {
  const [taskId] = params;

  const response = await axiosInstance.get(
    `/task/getVoiceRecordsByTaskId?taskId=${taskId}`,
  );

  return response.data;
};

// Custom hook to use in components
export const usePostGetVoiceRecordByTask = () => {
  return useMutation(postGetVoiceRecordByTask);

};