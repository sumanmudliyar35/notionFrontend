import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update a maintenance record
const updateMaintance: MutationFunction<any, [any, any, any]> = async (
  params: [any, any, any]
) => {
  const [body, maintanceId, userId] = params;

  const response = await axiosInstance.put(
    `/maintance/updateMaintance?maintanceId=${maintanceId}&userId=${userId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateMaintance = () => {
  return useMutation(updateMaintance);
};