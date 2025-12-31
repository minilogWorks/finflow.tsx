import { useState, useEffect } from "react";
import { StorageService } from "./services/StorageService";
import {
  initialCategories,
  sampleUser,
  sampleTransactions,
} from "./data/sampleData";

import DashboardView from "./pages/dashboard/DashboardView";
import TransactionsView from "./pages/transactions/TransactionsView";
import CategoriesView from "./pages/categories/CategoriesView";
import ReportsView from "./pages/reports/ReportsView";

import {
  AppView,
  Transaction,
  Category,
  DashboardViewData,
  TransactionsViewData,
  CategoriesViewData,
  ReportsViewData,
} from "./types";
import { formatCurrency } from "./utils/formatters";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router";
import Home from "./pages/home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    initializeStorage();
    setCategories(StorageService.getCategories());
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const checkMobile = () => setIsMobile(window.innerWidth <= 768);

  const initializeStorage = () => {
    if (!StorageService.getUser()) {
      StorageService.saveUser(sampleUser);
    }
    if (StorageService.getCategories().length === 0) {
      StorageService.saveCategories(initialCategories);
    }
    if (StorageService.getTransactions().length === 0) {
      StorageService.saveTransactions(sampleTransactions);
    }
  };

  const handleViewChange = (view: AppView) => setCurrentView(view);
  const openTransactionModal = (id: string | null = null) => {
    setEditingTransactionId(id);
    setModalOpen(true);
  };
  const closeTransactionModal = () => {
    setModalOpen(false);
    setEditingTransactionId(null);
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveTransaction = (transactionData: Partial<Transaction>) => {
    if (editingTransactionId) {
      if (
        StorageService.updateTransaction(editingTransactionId, transactionData)
      ) {
        const action = transactionData.type === "income" ? "Income" : "Expense";
        showNotification(`${action} updated successfully!`, "success");
      }
    } else {
      const newTransaction: Transaction = {
        id: `trans_${Date.now()}`,
        title: transactionData.title!,
        amount: transactionData.amount!,
        type: transactionData.type!, // This should be 'income' or 'expense'
        categoryId: transactionData.categoryId!,
        date: transactionData.date!,
        notes: transactionData.notes,
        createdAt: new Date().toISOString(),
      };

      StorageService.addTransaction(newTransaction);
      const action = transactionData.type === "income" ? "Income" : "Expense";
      showNotification(
        `${action} of ${formatCurrency(
          transactionData.amount!
        )} added successfully!`,
        "success"
      );
    }
    closeTransactionModal();
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      if (StorageService.deleteTransaction(id)) {
        showNotification("Transaction deleted successfully!", "success");
      }
    }
  };

  // Get typed view data
  const getViewData = ():
    | DashboardViewData
    | TransactionsViewData
    | CategoriesViewData
    | ReportsViewData => {
    const stats = StorageService.calculateStats();

    switch (currentView) {
      case "dashboard":
        return {
          stats,
          recentTransactions: StorageService.getRecentTransactions(5),
          topCategories: StorageService.getTopCategories(5),
        };
      case "transactions":
        return {
          transactions: StorageService.getTransactions(),
          categories: StorageService.getCategories(),
        };
      case "categories":
        return { categories };
      case "reports":
        return { stats };
      default:
        // Fallback to dashboard
        return {
          stats,
          recentTransactions: StorageService.getRecentTransactions(5),
          topCategories: StorageService.getTopCategories(5),
        };
    }
  };

  const viewData = getViewData();

  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <DashboardView />,
        },
        {
          path: "transactions",
          element: (
            <TransactionsView
              {...(viewData as TransactionsViewData)}
              onAddTransaction={() => openTransactionModal()}
              onEditTransaction={openTransactionModal}
              onDeleteTransaction={handleDeleteTransaction}
              isMobile={isMobile}
            />
          ),
        },
        {
          path: "categories",
          element: <CategoriesView {...(viewData as CategoriesViewData)} />,
        },
        {
          path: "reports",
          element: <ReportsView {...(viewData as ReportsViewData)} />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={browserRouter} />
    </AuthProvider>
  );
}
