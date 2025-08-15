import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get all maintenance records by userId
const fetchAllMaintanceByUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, userId, currentDate, currentMonth, currentYear, type , startDate, endDate] = queryKey;
  const response = await axiosInstance.get(`/maintance/getAllMaintance?userId=${userId}&currentDate=${currentDate}&currentMonth=${currentMonth}&currentYear=${currentYear}&type=${type}&startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

export const useGetAllMaintanceByUser = (userId: number, currentDate: number, currentMonth: number, currentYear: number, type: string, startDate: string, endDate: string, shouldFetchMaintance: boolean) => {
  return useQuery(["allMaintanceByUser", userId, currentDate, currentMonth, currentYear, type, startDate, endDate], fetchAllMaintanceByUser, {
    enabled: shouldFetchMaintance
  });
};