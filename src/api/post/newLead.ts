import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const createLead: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, userId] = params;

  const response = await axiosInstance.post(
    `/leads/createLead`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useCreateLead = () => {
  return useMutation(createLead);
};
