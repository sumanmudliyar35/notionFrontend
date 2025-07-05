import { useQuery } from 'react-query';
import axiosInstance from '../../connection/axiosInstance';

// Fetch function to get data by reference
const fetchChartDataByReference = async (referenceId: string | number) => {
  const response = await axiosInstance.get(`/dashboard/getDataByReference`);
  return response.data;
};

// Custom hook to use in components
export const useGetChartDataByReference = (referenceId: string | number) => {
  return useQuery(['chartDataByReference', referenceId], () => fetchChartDataByReference(referenceId), {
    enabled: !!referenceId,
  });
};