import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const updateBulkUsersTablePreference: MutationFunction<any, [any, any, any]> = async (
  params: [any, any, any]
) => {
  const [body, type, userId] = params;

  const response = await axiosInstance.put(
    `/tablePreference/bulkUpdate?userId=${userId}&type=${type}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateBulkUsersTablePreference = () => {
  return useMutation(updateBulkUsersTablePreference);
};
