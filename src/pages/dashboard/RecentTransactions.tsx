import React from "react";
import { ChevronRight } from "lucide-react";
import { Transaction } from "../../types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getCategoryIcon, getCategoryColor } from "../../utils/formatters";
import { getLucideIcon } from "../../utils/iconUtils";
import "./RecentTransactions.css";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCategoryByIdQueryOptions } from "../../queryOptions/getCategoriesQueryOptions";
import { useAuth } from "../../context/AuthContext";

const RecentTransactionItem = ({
  transaction,
  currency,
}: {
  transaction: Transaction;
  currency: string;
}) => {
  const { data: category, isPending } = useQuery(
    getCategoryByIdQueryOptions(parseInt(transaction.category))
  );

  if (isPending) {
    return <></>;
  }

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
          {category?.name} • {formatDate(transaction.date)}
        </p>
      </div>
      <div className={`transaction-amount ${transaction.type}`}>
        {transaction.type.toLowerCase() === "income" ? "+" : "-"}
        {formatCurrency(transaction.amount, currency)}
      </div>
    </div>
  );
};

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  const { user } = useAuth();
  const currency = user?.currency || "USD";

  return (
    <div className="card">
      <div className="card-header">
        <h3>Recent Transactions</h3>
        <Link to="/transactions">
          <button className="view-all-button">
            View All <ChevronRight size={16} />
          </button>
        </Link>
      </div>
      <div className="transactions-list">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <RecentTransactionItem
              transaction={transaction}
              currency={currency}
              key={transaction.id}
            />
          ))
        ) : (
          <p className="empty-state">No transactions yet</p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
