import React, { useState, useMemo } from "react";
import { Download, RefreshCw, ChevronDown, Calendar } from "lucide-react";
import { FinancialStats } from "../../types";
import { StorageService } from "../../services/StorageService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import "./ReportsView.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface ReportsViewProps {
  stats: FinancialStats;
}

const ReportsView: React.FC<ReportsViewProps> = ({ stats }) => {
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "quarter" | "year">("month");

  const transactions = StorageService.getTransactions();
  const categories = StorageService.getCategories();

  // Process data for charts
  const chartData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get transactions for the selected period
    const filterTransactionsByPeriod = () => {
      return transactions.filter((t) => {
        const tDate = new Date(t.date);
        const tYear = tDate.getFullYear();
        const tMonth = tDate.getMonth();

        if (selectedPeriod === "month") {
          return tYear === currentYear && tMonth === currentMonth;
        } else if (selectedPeriod === "quarter") {
          const currentQuarter = Math.floor(currentMonth / 3);
          const tQuarter = Math.floor(tMonth / 3);
          return tYear === currentYear && tQuarter === currentQuarter;
        } else {
          return tYear === currentYear;
        }
      });
    };

    const periodTransactions = filterTransactionsByPeriod();

    // Monthly spending trend (last 6 months)
    const monthlyData = [];
    const monthLabels = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      monthLabels.push(date.toLocaleDateString("en-US", { month: "short" }));

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
      });

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({ income, expense, month: monthLabels[monthLabels.length - 1] });
    }

    // Category breakdown
    const categoryMap = new Map<string, number>();
    periodTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryMap.get(t.categoryId) || 0;
        categoryMap.set(t.categoryId, current + t.amount);
      });

    const categoryData = Array.from(categoryMap.entries())
      .map(([catId, amount]) => {
        const cat = categories.find((c) => c.id === catId);
        return { name: cat?.name || "Unknown", amount, color: cat?.color || "#999" };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    return { monthlyData, categoryData };
  }, [transactions, categories, selectedPeriod]);

  // Summary data
  const summary = [
    { label: "Income", value: stats.totalIncome, fmt: "currency" as const },
    { label: "Expense", value: stats.totalExpense, fmt: "currency" as const },
    { label: "Net", value: stats.netBalance, fmt: "currency" as const },
    { label: "Savings Rate", value: stats.savingsRate, fmt: "percent" as const },
    { label: "Avg Daily Spend", value: stats.averageDailySpend, fmt: "currency" as const },
    { label: "Biggest Expense", value: stats.biggestExpense, fmt: "currency" as const },
    { label: "Transactions", value: stats.transactionCount, fmt: "number" as const },
  ];

  const formatValue = (v: number, fmt: "currency" | "percent" | "number") => {
    if (fmt === "currency") return `$${v.toFixed(2)}`;
    if (fmt === "percent") return `${v.toFixed(1)}%`;
    return v.toString();
  };

  const handleGenerate = () => {
    setGeneratedAt(new Date());
  };

  const buildJsonPayload = () => {
    return {
      meta: {
        generatedAt: generatedAt ? generatedAt.toISOString() : null,
        period: selectedPeriod,
        version: 1,
      },
      summary: summary.map((s) => ({ label: s.label, value: s.value })),
      monthlyData: chartData.monthlyData,
      categoryData: chartData.categoryData,
    };
  };

  const download = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const payload = buildJsonPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    download(blob, `report-${Date.now()}.json`);
    setExportOpen(false);
  };

  const handleExportCSV = () => {
    const lines = ["label,value"];
    lines.push(...summary.map((s) => `${s.label},${s.value}`));
    const meta = generatedAt ? `generatedAt,${generatedAt.toISOString()}` : "generatedAt,";
    const period = `period,${selectedPeriod}`;
    const csv = [meta, period, "", ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    download(blob, `report-${Date.now()}.csv`);
    setExportOpen(false);
  };

  // Chart configurations
  const monthlyChartData = {
    labels: chartData.monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Income",
        data: chartData.monthlyData.map((d) => d.income),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Expense",
        data: chartData.monthlyData.map((d) => d.expense),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryChartData = {
    labels: chartData.categoryData.map((d) => d.name),
    datasets: [
      {
        data: chartData.categoryData.map((d) => d.amount),
        backgroundColor: chartData.categoryData.map((d) => d.color),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const incomeExpenseChartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [stats.totalIncome, stats.totalExpense],
        backgroundColor: ["#10b981", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            label += "$" + context.parsed.y.toFixed(2);
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "$" + value;
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            return "$" + context.parsed.y.toFixed(2);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "$" + value;
          },
        },
      },
    },
  };

  return (
    <div className="reports-view">
      <div className="view-header">
        <h2>Reports & Analytics</h2>
        <div className="header-actions" style={{ position: "relative" }}>
          <div className="period-selector">
            <Calendar size={18} />
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="period-select"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleGenerate}>
            <RefreshCw size={18} />
            Generate Report
          </button>
          <button
            className="btn-secondary"
            onClick={() => setExportOpen((v) => !v)}
            aria-expanded={exportOpen}
            aria-haspopup="menu"
          >
            <Download size={18} />
            Export
            <ChevronDown size={16} style={{ marginLeft: 4 }} />
          </button>
          {exportOpen && (
            <div role="menu" className="export-menu">
              <button role="menuitem" className="export-menu-item" onClick={handleExportJSON}>
                Export JSON
              </button>
              <button role="menuitem" className="export-menu-item" onClick={handleExportCSV}>
                Export CSV
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card summary-card">
          <h3>
            Summary{" "}
            {generatedAt && (
              <span className="generated-time">
                (Generated {generatedAt.toLocaleString()})
              </span>
            )}
          </h3>
          <div className="summary-grid">
            {summary.map((s) => (
              <React.Fragment key={s.label}>
                <div className="label">{s.label}</div>
                <div
                  className={`value-badge ${
                    s.fmt === "currency" && s.label === "Net"
                      ? s.value >= 0
                        ? "positive"
                        : "negative"
                      : ""
                  }`}
                >
                  {formatValue(s.value, s.fmt)}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="report-card chart-card">
          <h3>Monthly Trend</h3>
          <div className="chart-container">
            <Line data={monthlyChartData} options={chartOptions} />
          </div>
        </div>

        <div className="report-card chart-card">
          <h3>Category Breakdown</h3>
          <div className="chart-container">
            {chartData.categoryData.length > 0 ? (
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            ) : (
              <div className="chart-placeholder">
                <p>No expense data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="report-card chart-card">
          <h3>Income vs Expense</h3>
          <div className="chart-container">
            <Bar data={incomeExpenseChartData} options={barOptions} />
          </div>
        </div>

        <div className="report-card">
          <h3>Budget Status</h3>
          <div className="budget-status">
            <div className="budget-item">
              <div className="budget-label">
                <span>Spending</span>
                <span className="budget-amount">${stats.totalExpense.toFixed(2)}</span>
              </div>
              <div className="budget-bar">
                <div
                  className="budget-bar-fill expense"
                  style={{
                    width: `${Math.min(
                      (stats.totalExpense / (stats.totalIncome || 1)) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="budget-item">
              <div className="budget-label">
                <span>Savings</span>
                <span className="budget-amount">${stats.netBalance.toFixed(2)}</span>
              </div>
              <div className="budget-bar">
                <div
                  className="budget-bar-fill savings"
                  style={{
                    width: `${Math.min(stats.savingsRate, 100)}%`,
                  }}
                ></div>
              </div>
              <div className="budget-percentage">{stats.savingsRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;