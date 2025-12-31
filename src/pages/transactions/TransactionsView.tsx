import React, { useState } from "react";
import { Download, Filter, Plus } from "lucide-react";
import { Transaction, Category } from "../../types";
import TransactionTable from "./TransactionTable";
import FilterModal from "./FilterModal";
import "./TransactionsView.css";
import { StorageService } from "../../services/StorageService";
import TransactionForm from "../../components/shared/TransactionForm";
import Modal from "../../components/shared/Modal";

interface TransactionsViewProps {
  onAddTransaction: () => void;
  onEditTransaction: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
  isMobile: boolean;
}

interface FilterState {
  month: string;
  year: string;
  categoryId: string;
  description: string;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  isMobile,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    month: "",
    year: "",
    categoryId: "",
    description: "",
  });

  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const transactions = StorageService.getTransactions();
  const categories = StorageService.getCategories();

  // Simple filter function - no complex code
  const filteredTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    const transactionMonth = String(date.getMonth() + 1).padStart(2, "0");
    const transactionYear = String(date.getFullYear());

    // Filter by description
    if (
      filters.description &&
      !transaction.title
        .toLowerCase()
        .includes(filters.description.toLowerCase())
    ) {
      return false;
    }

    // Filter by month
    if (filters.month && transactionMonth !== filters.month) {
      return false;
    }

    // Filter by year
    if (filters.year && transactionYear !== filters.year) {
      return false;
    }

    // Filter by category
    if (filters.categoryId && transaction.categoryId !== filters.categoryId) {
      return false;
    }

    return true;
  });

  const hasActiveFilters =
    filters.month || filters.year || filters.categoryId || filters.description;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);

  const openTransactionModal = (id: string | null = null) => {
    setEditingTransactionId(id);
    setModalOpen(true);
  };

  const closeTransactionModal = () => {
    setModalOpen(false);
    setEditingTransactionId(null);
  };

  return (
    <>
      <div className="transactions-view">
        <div className="view-header">
          <div>
            <h2>All Transactions</h2>
            {hasActiveFilters && (
              <div className="active-filters">
                <span className="filter-badge">
                  {filteredTransactions.length} of {transactions.length} shown
                </span>
                {filters.description && (
                  <span className="filter-badge">
                    Search: {filters.description}
                  </span>
                )}
                {filters.month && (
                  <span className="filter-badge">
                    Month:{" "}
                    {new Date(
                      `${filters.year || new Date().getFullYear()}-${
                        filters.month
                      }-01`
                    ).toLocaleDateString("en-US", { month: "long" })}
                  </span>
                )}
                {filters.year && (
                  <span className="filter-badge">Year: {filters.year}</span>
                )}
                {filters.categoryId && (
                  <span className="filter-badge">
                    Category:{" "}
                    {categories.find((c) => c.id === filters.categoryId)?.name}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={handleExport}>
              <Download size={18} />
              {!isMobile && "Export"}
            </button>
            <button
              className={`btn-secondary ${
                hasActiveFilters ? "active-filter" : ""
              }`}
              onClick={() => setShowFilter(true)}
            >
              <Filter size={18} />
              {!isMobile && "Filter"}
              {hasActiveFilters && <span className="filter-indicator">•</span>}
            </button>
            {isMobile && (
              <button className="btn-primary" onClick={onAddTransaction}>
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>

        <TransactionTable
          transactions={filteredTransactions}
          categories={categories}
          onEdit={onEditTransaction}
          onDelete={onDeleteTransaction}
          isMobile={isMobile}
        />

        {filteredTransactions.length === 0 && !isMobile && (
          <div className="empty-state">
            <p>
              {hasActiveFilters
                ? "No transactions match your filters"
                : "No transactions yet"}
            </p>
            <button className="btn-primary" onClick={onAddTransaction}>
              <Plus size={18} />
              Add your first transaction
            </button>
          </div>
        )}

        <FilterModal
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          categories={categories}
          onApplyFilters={handleApplyFilters}
        />
      </div>
      <button
        className="fab"
        onClick={() => openTransactionModal()}
        title="Add Transaction"
      >
        <Plus size={24} />
      </button>

      <Modal
        isOpen={modalOpen}
        onClose={closeTransactionModal}
        title={
          editingTransactionId ? "Edit Transaction" : "Add New Transaction"
        }
      >
        <TransactionForm
          editingTransactionId={editingTransactionId}
          onSave={() => {}}
          onCancel={closeTransactionModal}
        />
      </Modal>
    </>
  );
};

export default TransactionsView;
