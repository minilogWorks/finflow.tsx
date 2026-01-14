import React, { useState } from "react";
import {
  AddTransaction,
  EditTransaction,
  Transaction,
  TransactionType,
} from "../../types";
import "./TransactionForm.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategoriesQueryOptions } from "../../queryOptions/getCategoriesQueryOptions";
import {
  addTransactionMutationOptions,
  editTransactionMutationOptions,
} from "../../queryOptions/transactionsMutationOptions";
import { useAuth } from "../../context/AuthContext";

interface TransactionFormProps {
  transactionToEdit: Transaction | null;
  onSave: (transactionData: AddTransaction) => void;
  onEdit: (transactionToEdit: AddTransaction) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transactionToEdit,
  onSave,
  onEdit,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    mutate: addTransactionMutation,
    isPending: addTransactionPending,
    error: addTransactionError,
  } = useMutation({
    ...addTransactionMutationOptions(),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const {
    mutate: editTransactionMutation,
    isPending: editTransactionPending,
    error: editTransactionError,
  } = useMutation({
    ...editTransactionMutationOptions(),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const [formData, setFormData] = useState({
    title: transactionToEdit ? transactionToEdit.title : "",
    amount: transactionToEdit ? transactionToEdit.amount : 0,
    type: transactionToEdit
      ? transactionToEdit.type
      : ("expense" as TransactionType),
    date: transactionToEdit
      ? new Date(transactionToEdit.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    category: transactionToEdit ? transactionToEdit.category : "",
    notes: transactionToEdit ? transactionToEdit.notes : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (transactionToEdit) {
      const transactionData: EditTransaction = {
        title: formData.title.trim(),
        amount: formData.amount,
        type: formData.type.charAt(0).toUpperCase() + formData.type.slice(1),
        date: formData.date,
        category: formData.category,
        notes: formData.notes?.trim() || "",
      };

      editTransactionMutation({
        transactionId: transactionToEdit.id,
        fieldsToEdit: transactionData,
      });
      onCancel();
    } else {
      const transactionData: AddTransaction = {
        title: formData.title.trim(),
        amount: formData.amount,
        type: formData.type.charAt(0).toUpperCase() + formData.type.slice(1),
        date: formData.date,
        category: formData.category,
        notes: formData.notes?.trim() || "",
        user: user?.id.toString() ?? "",
      };

      addTransactionMutation(transactionData);
      onCancel();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as TransactionType;
    setFormData((prev) => ({ ...prev, type: newType }));
  };

  const isMutationLoading = addTransactionPending || editTransactionPending;

  const isMutationError =
    addTransactionError !== null || editTransactionError !== null;

  const {
    data: categories,
    isPending,
    error,
  } = useQuery(getCategoriesQueryOptions());

  if (isPending) {
    return <></>;
  }

  if (error) {
    return <></>;
  }

  const renderCategoryOptions = () => {
    return categories.map((category) => {
      return (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      );
    });
  };

  if (isMutationLoading) {
    return (
      <div className="loader-2-container">
        <div className="loader-2"></div>
      </div>
    );
  }

  if (isMutationError) {
    {
      /* TODO: Edit the error message when adding/editing transaction fails */
    }
    return (
      <div>
        <p>There is an error</p>
      </div>
    );
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What was this for?"
          required
          autoFocus
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <div className="amount-input">
            <span>$</span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="type">Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleTypeChange}
            className="type-select"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Category *</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {renderCategoryOptions()}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional details..."
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {transactionToEdit ? "Update" : "Add"} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
