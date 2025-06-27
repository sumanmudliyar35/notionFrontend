import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const DeleteTask: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, taskId] = params;

  const response = await axiosInstance.put(
    `/task/DeleteTask?taskId=${taskId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useDeleteTask = () => {
  return useMutation(DeleteTask);
};
