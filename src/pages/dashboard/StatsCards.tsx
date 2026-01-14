import React from "react";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { FinancialStats } from "../../types";
import "./StatsCards.css";
import { useAuth } from "../../context/AuthContext";

interface StatsCardsProps {
  stats: FinancialStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const { user } = useAuth();
  const currency = user?.currency || "USD";
  return (
    <div className="stats-grid">
      <div className="stat-card income">
        <div className="stat-icon">
          <ArrowDownRight size={24} />
        </div>
        <div className="stat-content">
          <h3>{formatCurrency(stats.totalIncome, currency)}</h3>
          <p>Total Income</p>
        </div>
      </div>

      <div className="stat-card expense">
        <div className="stat-icon">
          <ArrowUpRight size={24} />
        </div>
        <div className="stat-content">
          <h3>{formatCurrency(stats.totalExpense, currency)}</h3>
          <p>Total Expense</p>
        </div>
      </div>

      <div className="stat-card balance">
        <div className="stat-icon">
          <Wallet size={24} />
        </div>
        <div className="stat-content">
          <h3>{formatCurrency(stats.netBalance, currency)}</h3>
          <p>Net Balance</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
