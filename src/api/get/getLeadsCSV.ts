import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to create a mention
const downloadLeadsCSV: MutationFunction<any> = async (
) => {

  const response = await axiosInstance.get(
    `/leads/downloadLeads`,
  );

  return response.data;
};

// Custom hook to use in components
export const useDownloadLeadsCSV = () => {
  return useMutation(downloadLeadsCSV);
};