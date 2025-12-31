import {
  Category,
  Transaction,
  User,
  FinancialStats,
  TopCategory,
  Tokens,
} from "../types";

const STORAGE_KEYS = {
  USER: "finflow_user_v1",
  TRANSACTIONS: "finflow_transactions_v1",
  CATEGORIES: "finflow_categories_v1",
  TOKENS: "finflow_jwt_tokens",
};

export class StorageService {
  // ========== TOKEN HANDLERS ==========
  static saveTokens(tokens: Tokens): void {
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  }

  static updateAccessToken(newAccessToken: string): void {
    const data = localStorage.getItem(STORAGE_KEYS.TOKENS);
    if (data) {
      const tokens = JSON.parse(data);
      tokens.accessToken = newAccessToken;
      console.log(tokens);
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    }
  }

  static getTokens(): Tokens | null {
    const tokens = localStorage.getItem(STORAGE_KEYS.TOKENS);
    return tokens ? JSON.parse(tokens) : null;
  }

  static deleteTokens() {
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
  }
  // ========== USER METHODS ==========
  static saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  static updateUser(updates: Partial<User>): void {
    const user = this.getUser();
    if (user) {
      this.saveUser({ ...user, ...updates });
    }
  }

  // ========== TRANSACTION METHODS ==========
  static saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions)
    );
  }

  static getTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  }

  static addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.saveTransactions(transactions);
  }

  static updateTransaction(id: string, updates: Partial<Transaction>): boolean {
    const transactions = this.getTransactions();
    const index = transactions.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      this.saveTransactions(transactions);
      return true;
    }
    return false;
  }

  static deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    if (filtered.length !== transactions.length) {
      this.saveTransactions(filtered);
      return true;
    }
    return false;
  }

  static getTransactionsByCategory(categoryId: string): Transaction[] {
    const transactions = this.getTransactions();
    return transactions.filter((t) => t.categoryId === categoryId);
  }

  static getRecentTransactions(limit: number = 5): Transaction[] {
    const transactions = this.getTransactions();
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // ========== CATEGORY METHODS ==========
  static saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  static getCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  }

  static addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  }

  static updateCategory(id: string, updates: Partial<Category>): boolean {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      this.saveCategories(categories);
      return true;
    }
    return false;
  }

  static deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length !== categories.length) {
      this.saveCategories(filtered);
      return true;
    }
    return false;
  }

  static getCategoryById(id: string): Category | undefined {
    const categories = this.getCategories();
    return categories.find((c) => c.id === id);
  }

  // ========== STATS & CALCULATIONS ==========
  static calculateStats(): FinancialStats {
    const transactions = this.getTransactions();

    // Calculate total income
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total expense
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate net balance
    const netBalance = totalIncome - totalExpense;

    // Calculate savings rate
    const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

    // Find biggest expense
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );
    const biggestExpense =
      expenseTransactions.length > 0
        ? Math.max(...expenseTransactions.map((t) => t.amount))
        : 0;

    // Calculate average daily spend
    const averageDailySpend =
      expenseTransactions.length > 0
        ? totalExpense / expenseTransactions.length
        : 0;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      biggestExpense,
      averageDailySpend,
      transactionCount: transactions.length,
    };
  }

  static getTopCategories(limit: number = 5): TopCategory[] {
    const transactions = this.getTransactions();
    const categories = this.getCategories();

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
  }

  static exportData(): string {
    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      transactions: this.getTransactions(),
      categories: this.getCategories(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (data.user) this.saveUser(data.user);
      if (data.transactions) this.saveTransactions(data.transactions);
      if (data.categories) this.saveCategories(data.categories);
      return true;
    } catch (error) {
      console.error("Import failed:", error);
      return false;
    }
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  }
}
