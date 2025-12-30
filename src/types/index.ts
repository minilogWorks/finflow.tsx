export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  subcategoryId?: string;
  date: string;
  notes?: string;
  tags?: string[];
  recurring?: boolean;
  recurringInterval?: "daily" | "weekly" | "monthly" | "yearly";
  createdAt: string;
}

export type CategoryType = "expense" | "income";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string; // Add this line
  isCustom: boolean;
}
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isCustom: boolean;
  parentId?: string;
  subcategories?: Category[];
  isFavorite?: boolean;
  // Removed: budget?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currency: string;
  locale: string;
  defaultCategories: Category[];
  tier: "Free" | "Premium" | "Business";
  // Removed: monthlyBudget?: number;
}

export interface FinancialStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  // Removed: monthlyBudget: number;
  savingsRate: number;
  biggestExpense: number;
  averageDailySpend: number;
  transactionCount: number;
}
// Add these interfaces

export interface DashboardViewData {
  stats: FinancialStats;
  recentTransactions: Transaction[];
  topCategories: TopCategory[];
}

export interface TransactionsViewData {
  transactions: Transaction[];
  categories: Category[];
}

export interface CategoriesViewData {
  categories: Category[];
}

export interface ReportsViewData {
  stats: FinancialStats;
}
export interface TopCategory {
  category: Category;
  amount: number;
  percentage: number;
}

export type AppView = "dashboard" | "transactions" | "categories" | "reports";
