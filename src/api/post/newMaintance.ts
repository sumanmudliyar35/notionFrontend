import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to create a maintenance record
const createMaintance: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [body, userId] = params;

  const response = await axiosInstance.post(
    `/maintance/createMaintance?userId=${userId}`,
    body
  );

  return response.data;
};

export const useCreateMaintance = () => {
  return useMutation(createMaintance);
};