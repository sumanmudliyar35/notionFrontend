import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to delete a reminder
const deleteReminder: MutationFunction<any,  [any, any]> = async (params: [any, any]) => {
  const [reminderId, body] = params;
  const response = await axiosInstance.put(`/reminder/updateReminder?reminderId=${reminderId}`, body);
  return response.data;
};

// Custom hook to use in components
export const useDeleteReminder = () => {
  return useMutation(deleteReminder);
};