import { Transaction } from "../types";
import api from "../utils/api";

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get("api/transactions/");
  return response.data;
};
