import { useQuery } from 'react-query';
import axiosInstance from '../../connection/axiosInstance';

// Fetch function to get mentions by user
const fetchMentionByUser = async (userId: number) => {
  const response = await axiosInstance.get(`/mention/mentionByUser?userId=${userId}`);
  return response.data;
};

// Custom hook to use in components
export const useGetMentionByUser = (userId: number) => {
  return useQuery(['mentionByUser', userId], () => fetchMentionByUser(userId));
};