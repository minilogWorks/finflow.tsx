import React from "react";
import { Download, Filter, Plus } from "lucide-react";
import { Transaction, Category } from "../../types";
import TransactionTable from "./TransactionTable";
import "./TransactionsView.css";

interface TransactionsViewProps {
  transactions: Transaction[];
  categories: Category[];
  onAddTransaction: () => void;
  onEditTransaction: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
  isMobile: boolean;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  categories,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  isMobile,
}) => {
  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  return (
    <div className="transactions-view">
      <div className="view-header">
        <h2>All Transactions</h2>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleExport}>
            <Download size={18} />
            {!isMobile && "Export"}
          </button>
          <button
            className="btn-secondary"
            onClick={() => alert("Filter coming soon")}
          >
            <Filter size={18} />
            {!isMobile && "Filter"}
          </button>
          {isMobile && (
            <button className="btn-primary" onClick={onAddTransaction}>
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      <TransactionTable
        transactions={transactions}
        categories={categories}
        onEdit={onEditTransaction}
        onDelete={onDeleteTransaction}
        isMobile={isMobile}
      />

      {transactions.length === 0 && !isMobile && (
        <div className="empty-state">
          <p>No transactions yet</p>
          <button className="btn-primary" onClick={onAddTransaction}>
            <Plus size={18} />
            Add your first transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionsView;
