import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to create a mention
const createReminder: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, leadId] = params;

  const response = await axiosInstance.post(
    `/reminder/createReminder`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useCreateReminder = () => {
  return useMutation(createReminder);
};