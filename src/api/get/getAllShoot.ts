import { useQuery } from 'react-query';
import axiosInstance from '../../connection/axiosInstance';

// Fetch function to get all shoots
const fetchAllShoots = async () => {
  const response = await axiosInstance.get('/shoot/getAllShoot');
  return response.data; // assuming response.data contains the shoot list
};

// Custom hook to use in components
export const useGetAllShoots = () => {
  return useQuery('allShoots', fetchAllShoots);
};