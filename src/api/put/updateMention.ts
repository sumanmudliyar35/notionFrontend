import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const updateMention: MutationFunction<any, [any, any, any, any]> = async (
  params: [any, any, any, any]
) => {
  const [body, userId, leadId, type] = params;

  const response = await axiosInstance.put(
    `/mention/updateMention?userId=${userId}&leadId=${leadId}&type=${type}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateMention = () => {
  return useMutation(updateMention);
};
