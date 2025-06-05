import { useQuery } from 'react-query';
import axiosInstance from '../../connection/axiosInstance'; // your axios setup

// Fetch function to get all users
const fetchAllUsers = async () => {
  const response = await axiosInstance.get('/users/getAllUsers');
  return response.data;  // assuming response.data contains the user list
};

// Custom hook to use in components
export const useGetAllUsers = () => {
  return useQuery('allUsers', fetchAllUsers);
};
