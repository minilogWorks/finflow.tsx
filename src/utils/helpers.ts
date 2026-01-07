import { Category, FinancialStats, TopCategory, Transaction } from "../types";

// utils/helpers.ts
export const generateId = (): string => {
  return "cat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};

export const calculateYearlyStats = (
  transactions: Transaction[]
): FinancialStats => {
  const totalIncome = transactions
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

  const expenseTransactions = transactions.filter(
    (t) => t.type.toLowerCase() === "expense"
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

  return financialStats;
};

export const getRecentYearlyTransactions = (
  transactions: Transaction[],
  limit: number = 5
): Transaction[] => {
  return transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const getYearlyTopCategories = (
  expenseTransactions: Transaction[],
  categories: Category[],
  limit: number = 5
): TopCategory[] => {
  const totalExpense = expenseTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const categoryMap = new Map<string, number>();
  expenseTransactions.forEach((transaction) => {
    const current = categoryMap.get(transaction.category) || 0;
    categoryMap.set(transaction.category, current + transaction.amount);
  });

  return Array.from(categoryMap.entries())
    .map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === parseInt(categoryId));
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
