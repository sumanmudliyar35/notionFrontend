import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update bulk maintenance records
const updateBulkMaintance: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, userId] = params;

  const response = await axiosInstance.put(
    `/maintance/bulkUpdateMaintance?userId=${userId}`,
    body
  );

  return response.data;
};


export const useUpdateBulkMaintance = () => {
  return useMutation(updateBulkMaintance);
};