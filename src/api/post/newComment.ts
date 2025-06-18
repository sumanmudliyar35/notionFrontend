import { useMutation } from 'react-query';
import axiosInstance from '../../connection/axiosInstance';
import type { MutationFunction } from 'react-query';

// Mutation function to create a comment
const createComment: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, userId] = params;

  const response = await axiosInstance.post(`/comment/createComment?userId=${userId}`, body);
  return response.data;
};

// Custom hook
export const useCreateComment = () => {
  return useMutation(createComment);
};
