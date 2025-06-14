import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const updateLead: MutationFunction<any, [any, any, any]> = async (
  params: [any, any, any]
) => {
  const [body, leadId, userId] = params;

  const response = await axiosInstance.put(
    `/leads/updateLead?leadid=${leadId}&userid=${userId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateLead = () => {
  return useMutation(updateLead);
};
