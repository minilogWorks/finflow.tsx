import React, { useState, useEffect } from "react";
import { Download, Filter, Plus } from "lucide-react";
import TransactionTable from "./TransactionTable";
import FilterModal from "./FilterModal";
import "./TransactionsView.css";
import { StorageService } from "../../services/StorageService";
import { useQueries } from "@tanstack/react-query";
import { getTransactionsQueryOptions } from "../../queryOptions/getTransactionsQueryOptions";
import { getCategoriesQueryOptions } from "../../queryOptions/getCategoriesQueryOptions";
import Modal from "../../components/shared/Modal";
import TransactionForm from "../../components/shared/TransactionForm";
import { Transaction } from "../../types";

interface FilterState {
  month: string;
  year: string;
  categoryId: string;
  description: string;
}

const TransactionsView: React.FC = () => {
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    month: "",
    year: "",
    categoryId: "",
    description: "",
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const addTransaction = () => {
    setTransactionToEdit(null);
    setShowModal(true);
  };

  const editTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setShowModal(true);
  };

  const onDeleteTransaction = (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      if (StorageService.deleteTransaction(id)) {
        alert("Transaction deleted successfully!");
        window.location.reload();
      }
    }
  };

  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const [transactions, categories] = useQueries({
    queries: [getTransactionsQueryOptions(), getCategoriesQueryOptions()],
  });

  if (transactions.isPending || categories.isPending) {
    return <></>;
  }

  if (transactions.error || categories.error) {
    return (
      <>
        {transactions.error && transactions.error.message}
        {categories.error && categories.error.message}
      </>
    );
  }

  // const transactions = StorageService.getTransactions();
  // const categories = StorageService.getCategories();

  // Simple filter function - no complex code
  const filteredTransactions = transactions.data.filter((transaction) => {
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
    if (filters.categoryId && transaction.category !== filters.categoryId) {
      return false;
    }

    return true;
  });

  const hasActiveFilters =
    filters.month || filters.year || filters.categoryId || filters.description;

  return (
    <>
      <div className="transactions-view">
        <div className="view-header">
          <div>
            <h2>All Transactions</h2>
            {hasActiveFilters && (
              <div className="active-filters">
                <span className="filter-badge">
                  {filteredTransactions.length} of {transactions.data.length}{" "}
                  shown
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
                    {
                      categories.data.find(
                        (c) => c.id === parseInt(filters.categoryId)
                      )?.name
                    }
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
              <button className="btn-primary" onClick={addTransaction}>
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>

        <TransactionTable
          transactions={filteredTransactions}
          categories={categories.data}
          onEdit={editTransaction}
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
            <button className="btn-primary" onClick={addTransaction}>
              <Plus size={18} />
              Add your first transaction
            </button>
          </div>
        )}

        <FilterModal
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          categories={categories.data}
          onApplyFilters={handleApplyFilters}
        />
      </div>
      <button className="fab" onClick={addTransaction} title="Add Transaction">
        <Plus size={24} />
      </button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        title="Add New Transaction"
      >
        <TransactionForm
          transactionToEdit={transactionToEdit}
          onCancel={() => {
            setShowModal(false);
          }}
          onSave={() => {}}
          onEdit={() => {}}
        />
      </Modal>
    </>
  );
};

export default TransactionsView;
