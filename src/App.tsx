import { useState, useEffect } from "react";
import { Plus } from "lucide-react"; // Add this import
import { StorageService } from "./services/StorageService";
import {
  initialCategories,
  sampleUser,
  sampleTransactions,
} from "./data/sampleData";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import DashboardView from "./components/dashboard/DashboardView";
import TransactionsView from "./components/transactions/TransactionsView";
import CategoriesView from "./components/categories/CategoriesView";
import ReportsView from "./components/reports/ReportsView";
import Modal from "./components/shared/Modal";
import TransactionForm from "./components/shared/TransactionForm";
import Notification from "./components/shared/Notification";
import {
  AppView,
  Transaction,
  DashboardViewData,
  TransactionsViewData,
  CategoriesViewData,
  ReportsViewData,
} from "./types";
import { formatCurrency } from "./utils/formatters";
import "./App.css";

function App() {
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

  useEffect(() => {
    initializeStorage();
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
        return { categories: StorageService.getCategories() };
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
  const stats = StorageService.calculateStats();

  return (
    <div className="app-container">
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        transactionCount={StorageService.getTransactions().length}
        categoryCount={StorageService.getCategories().length}
        user={StorageService.getUser()}
        isMobile={isMobile}
      />

      <div className="main-wrapper">
        <main className="main-content">
          <Header currentView={currentView} stats={stats} isMobile={isMobile} />

          {currentView === "dashboard" && (
            <DashboardView
              {...(viewData as DashboardViewData)}
              onViewAllTransactions={() => handleViewChange("transactions")}
            />
          )}

          {currentView === "transactions" && (
            <TransactionsView
              {...(viewData as TransactionsViewData)}
              onAddTransaction={() => openTransactionModal()}
              onEditTransaction={openTransactionModal}
              onDeleteTransaction={handleDeleteTransaction}
              isMobile={isMobile}
            />
          )}

          {currentView === "categories" && (
            <CategoriesView {...(viewData as CategoriesViewData)} />
          )}

          {currentView === "reports" && (
            <ReportsView {...(viewData as ReportsViewData)} />
          )}
        </main>

        <Footer />
      </div>

      <button
        className="fab"
        onClick={() => openTransactionModal()}
        title="Add Transaction"
      >
        <Plus size={24} />
      </button>

      <Modal
        isOpen={modalOpen}
        onClose={closeTransactionModal}
        title={
          editingTransactionId ? "Edit Transaction" : "Add New Transaction"
        }
      >
        <TransactionForm
          editingTransactionId={editingTransactionId}
          onSave={handleSaveTransaction}
          onCancel={closeTransactionModal}
        />
      </Modal>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;
