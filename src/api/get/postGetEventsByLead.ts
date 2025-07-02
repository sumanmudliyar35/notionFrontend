import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to create a recursive task
const postGetEventByLead: MutationFunction<any, [any]> = async (
  params: [any,]
) => {
  const [ leadId] = params;

  const response = await axiosInstance.get(
    `/event/getEventsByLeadId?leadId=${leadId}`,
  );

  return response.data;
};

// Custom hook to use in components
export const usePostGetEventByLead = () => {
  return useMutation(postGetEventByLead);

};