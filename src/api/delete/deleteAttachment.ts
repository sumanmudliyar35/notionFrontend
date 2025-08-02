import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to delete an attachment
const DeleteAttachment: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [attachmentId, userId] = params;

  const response = await axiosInstance.delete(
    `/attachments/deleteAttachment?attachmentId=${attachmentId}&userId=${userId}`
  );

  return response.data;
};

export const useDeleteAttachment = () => {
  return useMutation(DeleteAttachment);
};