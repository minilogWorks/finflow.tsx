import React from "react";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { FinancialStats } from "../../types";
import "./StatsCards.css";

interface StatsCardsProps {
  stats: FinancialStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card income">
        <div className="stat-icon">
          <ArrowDownRight size={24} />
        </div>
        <div className="stat-content">
          <h3>{formatCurrency(stats.totalIncome)}</h3>
          <p>Total Income</p>
        </div>
      </div>

      <div className="stat-card expense">
        <div className="stat-icon">
          <ArrowUpRight size={24} />
        </div>
        <div className="stat-content">
          <h3>{formatCurrency(stats.totalExpense)}</h3>
          <p>Total Expense</p>
        </div>
      </div>

      <div className="stat-card balance">
        <div className="stat-icon">
          <Wallet size={24} />
        </div>
        <div className="stat-content">
          <h3>{formatCurrency(stats.netBalance)}</h3>
          <p>Net Balance</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
