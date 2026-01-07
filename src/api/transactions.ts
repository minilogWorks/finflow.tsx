import { Transaction } from "../types";
import api from "../utils/api";

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get("api/transactions/");
  return response.data.map((transaction: any) => ({
    ...transaction,
    type: transaction.type.toLowerCase(),
    amount: parseInt(transaction.amount),
  }));
};
