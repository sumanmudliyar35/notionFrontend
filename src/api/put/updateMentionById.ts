import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to update mentions by ID
const updateMentionById: MutationFunction<any, [any, any]> = async (
  params: [any, any]
) => {
  const [data, id] = params;
  
  const response = await axiosInstance.put(
    `/mention/updateMentionById?id=${id}`,
    data
  );

  return response.data;
};

// Custom hook to use in components
export const useUpdateMentionById = () => {
  const queryClient = useQueryClient();
  
  return useMutation(updateMentionById, {
    onSuccess: (data, variables) => {
      // Get the userId from the second parameter of the variables array
      
      // Invalidate unseenNotificationCount query to trigger a refetch
      queryClient.invalidateQueries(["unseenNotificationCount"]);
      
      // You can also invalidate any other related queries
      // queryClient.invalidateQueries(["mentions", userId]);
    }
  });
};