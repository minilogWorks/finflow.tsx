import { useState } from "react";
import { Info } from "lucide-react";
import StatsCards from "./StatsCards";
import RecentTransactions from "./RecentTransactions";
import TopCategories from "./TopCategories";
import SpendingChart from "./SpendingChart";
import "./DashboardView.css";
import Loader from "../../components/shared/Loader";
import { useQueries } from "@tanstack/react-query";
import {
  calculateYearlyStats,
  getRecentYearlyTransactions,
  getYearlyTopCategories,
} from "../../utils/helpers";
import { getTransactionsQueryOptions } from "../../queryOptions/getTransactionsQueryOptions";
import { getCategoriesQueryOptions } from "../../queryOptions/getCategoriesQueryOptions";

const DashboardView = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const [transactions, categories] = useQueries({
    queries: [getTransactionsQueryOptions(), getCategoriesQueryOptions()],
  });

  // TODO: Clean up isPending and error states
  if (transactions.isPending || categories.isPending) {
    return <Loader />;
  }

  if (transactions.error || categories.error) {
    return (
      <>
        {transactions.error && transactions.error.message}
        {categories.error && categories.error.message}
      </>
    );
  }

  const stats = calculateYearlyStats(transactions.data);
  const recentTransactions = getRecentYearlyTransactions(transactions.data, 5);
  const topCategories = getYearlyTopCategories(
    transactions.data.filter(
      (transaction) => transaction.type.toLowerCase() === "expense"
    ),
    categories.data,
    5
  );

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="year-badge">
          <span className="year-label">Viewing:</span>
          <span className="year-value">{selectedYear}</span>
        </div>
      </div>

      {/* Stats Cards moved back to original position */}
      <StatsCards stats={stats} />

      <div className="content-grid">
        <SpendingChart onYearChange={setSelectedYear} />

        <RecentTransactions transactions={recentTransactions} />

        <TopCategories categories={topCategories} />

        <div className="card quick-stats-section">
          <div className="card-header">
            <h3>Quick Stats ({selectedYear})</h3>
            <Info size={18} />
          </div>
          <div className="stats-list">
            <div className="stat-item">
              <span>Avg. Daily Spend</span>
              <strong>${stats.averageDailySpend.toFixed(2)}</strong>
            </div>
            <div className="stat-item">
              <span>Transactions Count</span>
              <strong>{stats.transactionCount}</strong>
            </div>
            <div className="stat-item">
              <span>Biggest Expense</span>
              <strong>${stats.biggestExpense.toFixed(2)}</strong>
            </div>
            <div className="stat-item">
              <span>Savings Rate</span>
              <strong>{stats.savingsRate.toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
