import { useQuery } from 'react-query';
import axiosInstance from '../../connection/axiosInstance';

// Fetch function to get data by reference
const fetchDataByReference = async (referenceId: string | number) => {
  const response = await axiosInstance.get(`/reference/getDataByReference/${referenceId}`);
  return response.data;
};

// Custom hook to use in components
export const useGetDataByReference = (referenceId: string | number) => {
  return useQuery(['dataByReference', referenceId], () => fetchDataByReference(referenceId), {
    enabled: !!referenceId,
  });
};