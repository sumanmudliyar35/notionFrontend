import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get maintenance task by id
const fetchMaintanceTask = async ({ queryKey }: QueryFunctionContext) => {
  const [, taskId] = queryKey;
  const response = await axiosInstance.get(
    `/maintance/getMaintance?id=${taskId}`,
  );
  return response.data;
};

// Custom hook
export const useGetMaintanceTask = (
  taskId: number,
) => {
  return useQuery(
    ["maintanceTask", taskId],
    fetchMaintanceTask,
    { enabled: !!taskId }
  );
};