import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { FinancialStats, Transaction, TopCategory } from "../../types";
import { StorageService } from "../../services/StorageService";
import StatsCards from "./StatsCards";
import RecentTransactions from "./RecentTransactions";
import TopCategories from "./TopCategories";
import SpendingChart from "./SpendingChart";
import "./DashboardView.css";
import { AxiosError } from "axios";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/shared/Loader";
import api from "../../utils/api";

const DashboardView = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const { tokens } = useAuth();

  const calculateYearlyStats = (): FinancialStats => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );
    const biggestExpense =
      expenseTransactions.length > 0
        ? Math.max(...expenseTransactions.map((t) => t.amount))
        : 0;

    const averageDailySpend =
      expenseTransactions.length > 0
        ? totalExpense / expenseTransactions.length
        : 0;

    const financialStats: FinancialStats = {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      biggestExpense,
      averageDailySpend,
      transactionCount: transactions.length, // This should also use yearlyTransactions
    };

    console.log(financialStats);
    return financialStats;
  };

  // Get recent transactions for selected year
  // TODO: This should be an API call
  const getRecentYearlyTransactions = (limit: number = 5): Transaction[] => {
    // const yearlyTransactions = getYearlyTransactions();
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  // Get top categories for selected year
  const getYearlyTopCategories = (limit: number = 5): TopCategory[] => {
    // const yearlyTransactions = getYearlyTransactions();
    const categories = StorageService.getCategories();

    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );
    const totalExpense = expenseTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const categoryMap = new Map<string, number>();
    expenseTransactions.forEach((transaction) => {
      const current = categoryMap.get(transaction.categoryId) || 0;
      categoryMap.set(transaction.categoryId, current + transaction.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId);
        if (!category) return null;

        return {
          category,
          amount,
          percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        };
      })
      .filter((item): item is TopCategory => item !== null)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  };

  useEffect(() => {
    // Check if guest mode (guest tokens)
    const isGuest = tokens?.accessToken === 'guest-token';
    
    if (isGuest) {
      // Use local storage for guest users
      const localTransactions = StorageService.getTransactions();
      setTransactions(localTransactions);
      setTransactionsLoading(false);
    } else {
      // Use API for authenticated users
      getYearlyTransactionsAPI();
      getTransactionsSummaryAPI();
    }
  }, [tokens]);

  const getYearlyTransactionsAPI = async () => {
    if (!tokens) {
      console.error("Tokens are not available");
      return;
    }

    try {
      const res = await api.get("api/transactions/");
      if (res.status === 200) {
        const transactions = res.data;
        console.log(transactions);
        setTransactions(transactions);
      }
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response?.data
        ? (error.response.data as { detail: string }).detail
        : "";

      console.error("Get Transactions API Error\n", errorMessage);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const getTransactionsSummaryAPI = async () => {
    try {
      const res = await api.get("api/transactions/summary/");
      if (res.status === 200) {
        const summary = res.data;
        console.log(summary);
      }
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response?.data
        ? (error.response.data as { detail: string }).detail
        : "";

      console.error("Get Transactions Summary API Error\n", errorMessage);
    }
  };

  const stats = calculateYearlyStats();
  const recentTransactions = getRecentYearlyTransactions(5);
  const topCategories = getYearlyTopCategories(5);

  if (transactionsLoading) {
    return <Loader />;
  }

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
