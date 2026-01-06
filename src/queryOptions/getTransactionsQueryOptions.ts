import { queryOptions } from "@tanstack/react-query";
import { getAllTransactions } from "../api/transactions";

export const getTransactionsQueryOptions = () => {
  return queryOptions({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
  });
};
