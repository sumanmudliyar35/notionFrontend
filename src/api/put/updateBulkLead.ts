import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const updateBulkLead: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body,userId] = params;

  const response = await axiosInstance.put(
    `/leads/bulkUpdateLead?userid=${userId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateBulkLead = () => {
  return useMutation(updateBulkLead);
};
