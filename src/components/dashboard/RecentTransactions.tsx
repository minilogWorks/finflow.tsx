import React from "react";
import { ChevronRight } from "lucide-react";
import { Transaction } from "../../types";
import { StorageService } from "../../services/StorageService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getCategoryIcon, getCategoryColor } from "../../utils/formatters";
import { getLucideIcon } from "../../utils/iconUtils";
import "./RecentTransactions.css";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll: () => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onViewAll,
}) => {
  const renderTransactionItem = (transaction: Transaction) => {
    const category = StorageService.getCategoryById(transaction.categoryId);
    const iconName = getCategoryIcon(category?.name || "default");
    const color = getCategoryColor(category?.name || "default");
    const Icon = getLucideIcon(iconName);

    return (
      <div key={transaction.id} className="transaction-item">
        <div className="transaction-icon" style={{ backgroundColor: color }}>
          <Icon size={16} />
        </div>
        <div className="transaction-info">
          <h4>{transaction.title}</h4>
          <p>
            {category?.name || "Unknown"} • {formatDate(transaction.date)}
          </p>
        </div>
        <div className={`transaction-amount ${transaction.type}`}>
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Recent Transactions</h3>
        <button className="view-all-button" onClick={onViewAll}>
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="transactions-list">
        {transactions.length > 0 ? (
          transactions.map(renderTransactionItem)
        ) : (
          <p className="empty-state">No transactions yet</p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
