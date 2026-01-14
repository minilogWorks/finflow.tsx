import { AddTransaction, EditTransaction, Transaction } from "../types";
import api from "../utils/api";

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get("api/transactions/");
  return response.data.map((transaction: any) => ({
    ...transaction,
    type: transaction.type.toLowerCase(),
    amount: parseInt(transaction.amount),
  }));
};

export const addNewTransaction = async (
  transaction: AddTransaction
): Promise<Transaction> => {
  const response = await api.post("api/transactions/", transaction);
  return response.data;
};

export const editTransaction = async ({
  transactionId,
  fieldsToEdit,
}: {
  transactionId: string;
  fieldsToEdit: EditTransaction;
}): Promise<Transaction> => {
  const response = await api.patch(
    `api/transactions/${transactionId}/`,
    fieldsToEdit
  );
  return response.data;
};

export const deleteTransaction = async (transactionId: string) => {
  const response = await api.delete(`api/transactions/${transactionId}/`);
  return response.data;
};
