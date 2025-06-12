import { useQuery } from 'react-query';
import axiosInstance from '../../connection/axiosInstance'; // your axios setup

// Fetch function to get all users
const fetchAllEventList = async () => {
  const response = await axiosInstance.get('/eventList/getEventList');
  return response.data;  // assuming response.data contains the event list
};

// Custom hook to use in components
export const useGetAllEventList = () => {
  return useQuery('allEvents', fetchAllEventList);
};
