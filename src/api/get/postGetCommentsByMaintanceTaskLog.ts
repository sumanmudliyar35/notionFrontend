import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to get comments by recursive task log ID
const getCommentByMaintanceTaskLogId: MutationFunction<any, [any]> = async (
  params: [any]
) => {
  const [id] = params;

  const response = await axiosInstance.get(
    `/comment/getCommentByMaintanceLog?id=${id}`,
  );

  return response.data;
};

// Custom hook to use in components
export const useGetCommentByMaintanceTaskLogId = () => {
  return useMutation(getCommentByMaintanceTaskLogId);
};