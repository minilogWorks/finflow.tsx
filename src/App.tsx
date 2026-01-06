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

import { Category } from "./types";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router";
import Home from "./pages/home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    initializeStorage();
    setCategories(StorageService.getCategories());
  }, []);

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


  const handleCategoriesChange = (updatedCategories: Category[]) => {
    StorageService.saveCategories(updatedCategories);
    setCategories(updatedCategories);
  };

  // Get stats
  const stats = StorageService.calculateStats();

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
          element: <TransactionsView />,
        },
        {
          path: "categories",
          element: (
            <CategoriesView
              categories={categories}
              onCategoriesChange={handleCategoriesChange}
            />
          ),
        },
        {
          path: "reports",
          element: <ReportsView stats={stats} />,
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
