import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to upload an attachment file
const createProfilePicture: MutationFunction<any, [FormData, any]> = async (
  params: [FormData, any]
) => {
  const [formData, userId] = params;
  
  // Special configuration for file uploads
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axiosInstance.post(
    `/users/uploadProfilePicture`,
    formData,
    config
  );

  return response.data;
};

// Custom hook to use in components
export const usecreateProfilePicture = () => {
  return useMutation(createProfilePicture);
};