import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { FinancialStats } from "../../types";
import "./Header.css";
import { useLocation } from "react-router";

interface HeaderProps {
  stats: FinancialStats;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ stats, isMobile }) => {
  const { pathname } = useLocation();

  const getViewTitle = (): string => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/transactions":
        return "Transactions";
      case "/categories":
        return "Categories";
      case "/reports":
        return "Reports";
      default:
        return "FinFlow";
    }
  };

  const getViewDescription = (): string => {
    switch (pathname) {
      case "/":
        return "Overview of your finances";
      case "/transactions":
        return "Manage your income and expenses";
      case "/categories":
        return "Organize your custom categories";
      case "/reports":
        return "Generate detailed reports";
      default:
        return "Personal Finance Manager";
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <h2>{getViewTitle()}</h2>
        <p>{getViewDescription()}</p>
      </div>

      {!isMobile && (
        <div className="header-right">
          <div className="quick-stats">
            <div className="stat">
              <span>Income</span>
              <strong style={{ color: "#00B894" }}>
                {formatCurrency(stats.totalIncome)}
              </strong>
            </div>
            <div className="stat">
              <span>Expenses</span>
              <strong style={{ color: "#FF6B6B" }}>
                {formatCurrency(stats.totalExpense)}
              </strong>
            </div>
            <div className="stat">
              <span>Balance</span>
              <strong
                style={{ color: stats.netBalance >= 0 ? "#4CAF50" : "#f72585" }}
              >
                {formatCurrency(stats.netBalance)}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
