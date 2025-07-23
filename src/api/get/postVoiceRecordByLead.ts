import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to get voice record by task ID
const postGetVoiceRecordByLead: MutationFunction<any, [any]> = async (
  params: [any]
) => {
  const [leadId] = params;

  const response = await axiosInstance.get(
    `/leads/getVoiceRecordsByLead?leadId=${leadId}`,
  );

  return response.data;
};

// Custom hook to use in components
export const usePostGetVoiceRecordByLead = () => {
  return useMutation(postGetVoiceRecordByLead);

};