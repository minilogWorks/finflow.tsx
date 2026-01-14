import { mutationOptions } from "@tanstack/react-query";
import {
  addNewTransaction,
  deleteTransaction,
  editTransaction,
} from "../api/transactions";

export const addTransactionMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["add-transaction"],
    mutationFn: addNewTransaction,
  });
};

export const editTransactionMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["edit-transaction"],
    mutationFn: editTransaction,
  });
};

export const deleteTransactionMutationOptions = () => {
  return mutationOptions({
    mutationKey: ["delete-transaction"],
    mutationFn: deleteTransaction,
  });
};
