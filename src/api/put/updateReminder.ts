import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update a reminder
const updateReminder: MutationFunction<any, [any, number]> = async (
  params: [any, number]
) => {
  const [body, id] = params;

  const response = await axiosInstance.put(
    `/reminder/updateReminder?id=${id}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateReminder = () => {
  return useMutation(updateReminder);
  };