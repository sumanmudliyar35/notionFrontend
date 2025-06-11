import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const DeleteComment: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, commentId] = params;

  const response = await axiosInstance.put(
    `/comment/deleteComment?commentId=${commentId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useDeleteComment = () => {
  return useMutation(DeleteComment);
};
