import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const createTask: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, userId] = params;

  const response = await axiosInstance.post(
    `/task/createTask`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useCreateTask = () => {
  return useMutation(createTask);
};
