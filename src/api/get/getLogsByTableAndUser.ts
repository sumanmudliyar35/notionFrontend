import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get logs by table name and rowId
const fetchLogsByTableAndUser = async ({ queryKey }: QueryFunctionContext) => {
  const [, tableName, userId, offSet] = queryKey;
  const response = await axiosInstance.get(`/logs/getLogsByTableAndUserId?tableName=${tableName}&userId=${userId}&offSet=${offSet}`);
  return response.data;
};

// Custom hook
export const useGetLogsTableAndUser = (tableName: string,userId: number, offSet: number) => {
  return useQuery(["logsByRow", tableName, userId, offSet], fetchLogsByTableAndUser);

};