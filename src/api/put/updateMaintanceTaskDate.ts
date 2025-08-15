import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update a maintenance task date
const updateMaintanceTaskDate: MutationFunction<any, [any, any, any]> = async (
  params: [any, any, any]
) => {
  const [body, maintanceTaskId, userId] = params;

  const response = await axiosInstance.put(
    `/maintance/updateMaintanceTaskDate?id=${maintanceTaskId}&userId=${userId}`,
    body
  );

  return response.data;
};

export const useUpdateMaintanceTaskDate = () => {
  return useMutation(updateMaintanceTaskDate);
};