export interface IUser {
  id: number;
  username: string;
  email: string;
  isStaff: boolean;
  name?: string;
  currency?: string;
}

export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  subcategoryId?: string;
  date: string;
  notes?: string;
  tags?: string[];
  recurring?: boolean;
  recurringInterval?: "daily" | "weekly" | "monthly" | "yearly";
  createdAt: string;
}

export type AddTransaction = Partial<Omit<Transaction, "type">> & {
  user: string;
  type: string;
};

export type EditTransaction = Partial<Omit<Transaction, "type">> & {
  type: string;
};

export type CategoryType = "expense" | "income";

export interface Category {
  id: number;
  name: string;
  isCustom: boolean;
  icon: string;
  color: string;
}

export type AddCategory = {
  name: string;
  icon: string;
  color: string;
};

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

export interface Tokens {
  accessToken: string;
  refreshToken: string;
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
