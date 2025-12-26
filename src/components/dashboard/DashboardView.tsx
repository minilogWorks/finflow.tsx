import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { FinancialStats, Transaction, TopCategory } from '../../types';
import { StorageService } from '../../services/StorageService';
import StatsCards from './StatsCards';
import RecentTransactions from './RecentTransactions';
import TopCategories from './TopCategories';
import SpendingChart from './SpendingChart';
import './DashboardView.css';

interface DashboardViewProps {
  onViewAllTransactions: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onViewAllTransactions }) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Get transactions for selected year
  const getYearlyTransactions = () => {
    const allTransactions = StorageService.getTransactions();
    return allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === selectedYear;
    });
  };

  // Calculate stats for selected year
  const calculateYearlyStats = (): FinancialStats => {
    const yearlyTransactions = getYearlyTransactions();
    
    const totalIncome = yearlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = yearlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

    const expenseTransactions = yearlyTransactions.filter((t) => t.type === 'expense');
    const biggestExpense = expenseTransactions.length > 0
      ? Math.max(...expenseTransactions.map((t) => t.amount))
      : 0;

    const averageDailySpend = expenseTransactions.length > 0
      ? totalExpense / expenseTransactions.length
      : 0;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      biggestExpense,
      averageDailySpend,
      transactionCount: yearlyTransactions.length,
    };
  };

  // Get recent transactions for selected year
  const getRecentYearlyTransactions = (limit: number = 5): Transaction[] => {
    const yearlyTransactions = getYearlyTransactions();
    return yearlyTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  // Get top categories for selected year
  const getYearlyTopCategories = (limit: number = 5): TopCategory[] => {
    const yearlyTransactions = getYearlyTransactions();
    const categories = StorageService.getCategories();

    const expenseTransactions = yearlyTransactions.filter((t) => t.type === 'expense');
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

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

  const stats = calculateYearlyStats();
  const recentTransactions = getRecentYearlyTransactions(5);
  const topCategories = getYearlyTopCategories(5);

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

        <RecentTransactions
          transactions={recentTransactions}
          onViewAll={onViewAllTransactions}
        />

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