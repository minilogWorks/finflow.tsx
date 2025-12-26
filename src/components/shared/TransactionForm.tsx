import React, { useState, useEffect } from "react";
import { StorageService } from "../../services/StorageService";
import { Transaction, TransactionType } from "../../types";
import "./TransactionForm.css";

interface TransactionFormProps {
  editingTransactionId: string | null;
  onSave: (transactionData: Partial<Transaction>) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  editingTransactionId,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense" as TransactionType,
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    notes: "",
  });

  const categories = StorageService.getCategories();

  // Get categories filtered by selected type
  const getFilteredCategories = () => {
    return categories.filter((c) => c.type === formData.type);
  };

  // Get default category for the selected type
  const getDefaultCategory = () => {
    const filtered = getFilteredCategories();
    return filtered.length > 0 ? filtered[0].id : "";
  };

  useEffect(() => {
    if (editingTransactionId) {
      // Editing existing transaction
      const transaction = StorageService.getTransactions().find(
        (t) => t.id === editingTransactionId
      );

      if (transaction) {
        setFormData({
          title: transaction.title,
          amount: transaction.amount.toString(),
          type: transaction.type,
          date: transaction.date,
          categoryId: transaction.categoryId,
          notes: transaction.notes || "",
        });
      }
    } else {
      // New transaction - set default category for expense type
      const defaultCategory = getDefaultCategory();
      setFormData((prev) => ({
        ...prev,
        categoryId: defaultCategory,
      }));
    }
  }, [editingTransactionId]);

  // Update category when transaction type changes
  useEffect(() => {
    if (!editingTransactionId) {
      const defaultCategory = getDefaultCategory();
      setFormData((prev) => ({
        ...prev,
        categoryId: defaultCategory,
      }));
    }
  }, [formData.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData: Partial<Transaction> = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: formData.date,
      categoryId: formData.categoryId,
      notes: formData.notes.trim() || undefined,
    };

    if (
      !transactionData.title ||
      !transactionData.amount ||
      !transactionData.categoryId
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (transactionData.amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    onSave(transactionData);
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

  const renderCategoryOptions = () => {
    const filteredCategories = getFilteredCategories();

    return filteredCategories.map((category) => {
      return (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      );
    });
  };

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
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
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
          {editingTransactionId ? "Update" : "Add"} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
