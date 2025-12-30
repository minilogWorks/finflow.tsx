import React from "react";
import { Download, RefreshCw } from "lucide-react";
import { FinancialStats } from "../../types";
import "./ReportsView.css";

export interface ReportsViewProps {
  stats: FinancialStats;
}

const ReportsView: React.FC<ReportsViewProps> = ({ stats }) => {
  // Use stats to avoid unused variable and show a quick summary
  const summary = [
    { label: "Income", value: stats.totalIncome },
    { label: "Expense", value: stats.totalExpense },
    { label: "Net", value: stats.netBalance },
  ];
  return (
    <div className="reports-view">
      <div className="view-header">
        <h2>Reports & Analytics</h2>
        <div className="header-actions">
          <button className="btn-primary">
            <RefreshCw size={18} />
            Generate Report
          </button>
          <button className="btn-secondary">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Summary</h3>
          <div className="chart-placeholder">
            <ul>
              {summary.map((s) => (
                <li key={s.label}>
                  {s.label}: {s.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="report-card">
          <h3>Monthly Summary</h3>
          <div className="chart-placeholder">
            <p>📅 Monthly spending chart</p>
          </div>
        </div>
        <div className="report-card">
          <h3>Category Breakdown</h3>
          <div className="chart-placeholder">
            <p>🍕 Category pie chart</p>
          </div>
        </div>
        <div className="report-card">
          <h3>Income vs Expense</h3>
          <div className="chart-placeholder">
            <p>⚖️ Comparison chart</p>
          </div>
        </div>
        <div className="report-card">
          <h3>Budget Status</h3>
          <div className="chart-placeholder">
            <p>🎯 Budget tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
