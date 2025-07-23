import { useQuery } from "react-query";
import type { QueryFunctionContext } from "react-query";
import axiosInstance from "../../connection/axiosInstance";

// Fetch function to get logs by table name and rowId
const fetchLogsByRow = async ({ queryKey }: QueryFunctionContext) => {
  const [, tableName, rowId] = queryKey;
  const response = await axiosInstance.get(`/logs/getLogsByTable?tableName=${tableName}&rowId=${rowId}`);
  return response.data;
};

// Custom hook
export const useGetLogsByRow = (tableName: string, rowId: string | number) => {
  return useQuery(["logsByRow", tableName, rowId], fetchLogsByRow);

};