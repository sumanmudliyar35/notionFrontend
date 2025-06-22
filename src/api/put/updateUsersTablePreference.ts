import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type {MutationFunction} from "react-query";

// Mutation function to create a lead
const updateUsersTablePreference: MutationFunction<any, [any, any, any, any]> = async (
  params: [any, any, any, any]
) => {
  const [body, columnName, type, userId] = params;

  const response = await axiosInstance.put(
    `/tablePreference/updateUsersTablePreference?userId=${userId}&type=${type}&columnName=${columnName}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateUsersTablePreference = () => {
  return useMutation(updateUsersTablePreference);
};
