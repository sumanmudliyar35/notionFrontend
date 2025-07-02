import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to create a recursive task
const postGetCommentByTask: MutationFunction<any, [any]> = async (
  params: [any,]
) => {
  const [ taskId] = params;

  const response = await axiosInstance.get(
    `/task/getCommentByTask?taskId=${taskId}`,
  );

  return response.data;
};

// Custom hook to use in components
export const usePostGetByTask = () => {
  return useMutation(postGetCommentByTask);

};