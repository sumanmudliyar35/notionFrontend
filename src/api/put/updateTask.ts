import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const updateTask: MutationFunction<any, [any, any, any]> = async (
  params: [any, any, any]
) => {
  const [body, taskId, userId] = params;

  const response = await axiosInstance.put(
    `/task/updateTask?taskId=${taskId}&userid=${userId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateTask = () => {
  return useMutation(updateTask);
};
