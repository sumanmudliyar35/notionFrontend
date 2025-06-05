import { useQuery } from 'react-query';
import axiosInstance from '../../connection/axiosInstance';

// Fetch function to get all references
const fetchAllReferences = async () => {
  const response = await axiosInstance.get('/reference/getAllReference');
  return response.data; // assuming response.data contains the reference list
};

// Custom hook to use in components
export const useGetAllReferences = () => {
  return useQuery('allReferences', fetchAllReferences);
};