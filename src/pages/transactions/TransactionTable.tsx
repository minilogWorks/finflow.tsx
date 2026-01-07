import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Transaction, Category } from "../../types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getCategoryIcon, getCategoryColor } from "../../utils/formatters";
import { getLucideIcon } from "../../utils/iconUtils";
import "./TransactionTable.css";

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  isMobile: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  categories,
  onEdit,
  onDelete,
  isMobile,
}) => {
  const renderDesktopRow = (transaction: Transaction) => {
    const category = categories.find(
      (c) => c.id === parseInt(transaction.category)
    );
    const iconName = getCategoryIcon(category?.name || "default");
    const color = getCategoryColor(category?.name || "default");
    const Icon = getLucideIcon(iconName);

    return (
      <tr key={transaction.id}>
        <td>{formatDate(transaction.date)}</td>
        <td>
          <div className="transaction-details">
            <strong>{transaction.title}</strong>
            {transaction.notes && <small>{transaction.notes}</small>}
          </div>
        </td>
        <td>
          <span
            className="category-badge"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Icon size={14} />
            {category?.name || "Unknown"}
          </span>
        </td>
        <td className={`amount ${transaction.type}`}>
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </td>
        <td>
          <div className="table-actions">
            <button className="btn-icon" onClick={() => onEdit(transaction)}>
              <Edit size={16} />
            </button>
            <button
              className="btn-icon delete"
              onClick={() => onDelete(transaction.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderMobileCard = (transaction: Transaction) => {
    const category = categories.find(
      (c) => c.id === parseInt(transaction.category)
    );
    const iconName = getCategoryIcon(category?.name || "default");
    const color = getCategoryColor(category?.name || "default");
    const Icon = getLucideIcon(iconName);

    return (
      <div key={transaction.id} className="transaction-card">
        <div className="card-header">
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
        {transaction.notes && (
          <div className="card-notes">
            <p>{transaction.notes}</p>
          </div>
        )}
        <div className="card-actions">
          <button className="btn-icon" onClick={() => onEdit(transaction)}>
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            className="btn-icon delete"
            onClick={() => onDelete(transaction.id)}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className="transactions-mobile-list">
        {transactions.map(renderMobileCard)}
      </div>
    );
  }

  return (
    <div className="transactions-table-container">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map(renderDesktopRow)
          ) : (
            <tr>
              <td colSpan={5} className="empty-state">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
