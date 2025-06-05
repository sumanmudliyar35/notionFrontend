import { useMutation } from 'react-query';
import axiosInstance from '../../connection/axiosInstance';
import type { MutationFunction } from 'react-query';

// Mutation function to login
const loginUser: MutationFunction<any, any> = async (body: any) => {
  const response = await axiosInstance.post(`/users/login`, body);
  return response.data;
};

// Custom hook
export const useLogin = () => {
  return useMutation(loginUser);
};