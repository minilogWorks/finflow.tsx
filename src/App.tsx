import DashboardView from "./pages/dashboard/DashboardView";
import TransactionsView from "./pages/transactions/TransactionsView";
import CategoriesView from "./pages/categories/CategoriesView";
import ReportsView from "./pages/reports/ReportsView";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router";
import Home from "./pages/home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import UserSettingsView from "./pages/settings/UserSettingsView";

export default function App() {
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
          element: <CategoriesView />,
        },
        {
          path: "reports",
          element: <ReportsView />,
        },
        {
          path: "settings",
          element: <UserSettingsView />,
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
