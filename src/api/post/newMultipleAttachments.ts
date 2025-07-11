import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to upload multiple attachment files
const createMultipleAttachments: MutationFunction<any, [FormData, any]> = async (
  params: [FormData, any]
) => {
  const [formData, userId] = params;

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axiosInstance.post(
    `/attachments/createMultipleAttachments`,
    formData,
    config
  );

  return response.data;
};

// Custom hook to use in components
export const useCreateMultipleAttachments = () => {
  return useMutation(createMultipleAttachments);

};