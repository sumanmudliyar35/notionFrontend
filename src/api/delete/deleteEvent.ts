import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to delete an event
const deleteEvent: MutationFunction<any, [any, any, any]> = async (
  params: [any, any, any]
) => {
  const [body, eventId, userId] = params;

  const response = await axiosInstance.put(
    `/event/updateEvent?eventId=${eventId}&userId=${userId}`,
    body
  );

  return response.data;
};

// Custom hook to use in components
export const useDeleteEvent = () => {
  return useMutation(deleteEvent);
};