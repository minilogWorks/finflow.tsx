import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { StorageService } from '../../services/StorageService';
import './SpendingChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type ChartPeriod = 'month' | 'quarter' | 'year';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointBorderWidth: number;
    pointRadius: number;
    pointHoverRadius: number;
    fill: boolean;
    tension: number;
  }[];
}

interface SpendingChartProps {
  selectedYear?: number;
  onYearChange?: (year: number) => void;
}

const SpendingChart: React.FC<SpendingChartProps> = ({ 
  selectedYear: initialYear, 
  onYearChange 
}) => {
  // Use provided year or default to current year
  const [selectedYear, setSelectedYear] = useState<number>(
    initialYear || new Date().getFullYear()
  );
  const [period, setPeriod] = useState<ChartPeriod>('month');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    if (initialYear && initialYear !== selectedYear) {
      setSelectedYear(initialYear);
    }
  }, [initialYear]);

  // Initialize available years from transaction data
  useEffect(() => {
    const transactions = StorageService.getTransactions();
    const years = new Set<number>();
    
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const transactionDate = new Date(transaction.date);
        years.add(transactionDate.getFullYear());
      }
    });
    
    // Always include current year even if no data
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    setAvailableYears(sortedYears);
    
    // Set selected year if not already set
    if (!selectedYear) {
      setSelectedYear(currentYear);
    }
  }, []);

  // Calculate daily expenses for a specific month/year
  const getMonthlyExpensesByDay = (year: number, month: number) => {
    const transactions = StorageService.getTransactions();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dailyExpenses = new Array(daysInMonth).fill(0);
    
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const transactionDate = new Date(transaction.date);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth();
        const transactionDay = transactionDate.getDate() - 1;
        
        if (transactionYear === year && transactionMonth === month) {
          if (transactionDay >= 0 && transactionDay < daysInMonth) {
            dailyExpenses[transactionDay] += transaction.amount;
          }
        }
      }
    });
    
    return dailyExpenses;
  };

  // Get days in a specific month/year
  const getDaysInMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return `${month + 1}/${day}`;
    });
  };

  // Get monthly names
  const getMonthNames = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(selectedYear, i, 1);
      return date.toLocaleDateString('en-US', { month: 'short' });
    });
  };

  // Get quarter names
  const getQuarterNames = () => {
    return ['Q1', 'Q2', 'Q3', 'Q4'];
  };

  // Calculate quarterly expenses
  const getQuarterlyExpenses = () => {
    const transactions = StorageService.getTransactions();
    const quarterlyData = [0, 0, 0, 0];
    
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const transactionDate = new Date(transaction.date);
        const transactionYear = transactionDate.getFullYear();
        
        if (transactionYear === selectedYear) {
          const month = transactionDate.getMonth();
          const quarter = Math.floor(month / 3);
          quarterlyData[quarter] += transaction.amount;
        }
      }
    });
    
    return quarterlyData;
  };

  // Calculate yearly expenses
  const getYearlyExpenses = () => {
    const transactions = StorageService.getTransactions();
    const monthlyData = new Array(12).fill(0);
    
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const transactionDate = new Date(transaction.date);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth();
        
        if (transactionYear === selectedYear) {
          monthlyData[transactionMonth] += transaction.amount;
        }
      }
    });
    
    return monthlyData;
  };

  // Navigate to previous year
  const goToPreviousYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex < availableYears.length - 1) {
      const newYear = availableYears[currentIndex + 1];
      updateSelectedYear(newYear);
    }
  };

  // Navigate to next year
  const goToNextYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex > 0) {
      const newYear = availableYears[currentIndex - 1];
      updateSelectedYear(newYear);
    }
  };

  // Update year and notify parent
  const updateSelectedYear = (year: number) => {
    setSelectedYear(year);
    if (onYearChange) {
      onYearChange(year);
    }
  };

  // Handle year picker selection
  const handleYearChange = (year: number) => {
    updateSelectedYear(year);
    setIsYearPickerOpen(false);
  };

  // Update chart data when period or year changes
  useEffect(() => {
    let labels: string[] = [];
    let data: number[] = [];
    const currentMonth = new Date().getMonth();
    const isCurrentYear = selectedYear === new Date().getFullYear();

    switch (period) {
      case 'month':
        if (isCurrentYear) {
          // Show current month for current year
          labels = getDaysInMonth(selectedYear, currentMonth);
          data = getMonthlyExpensesByDay(selectedYear, currentMonth);
        } else {
          // Show January for past years
          labels = getDaysInMonth(selectedYear, 0);
          data = getMonthlyExpensesByDay(selectedYear, 0);
        }
        break;
      
      case 'quarter':
        labels = getQuarterNames();
        data = getQuarterlyExpenses();
        break;
      
      case 'year':
        labels = getMonthNames();
        data = getYearlyExpenses();
        break;
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Expense',
          data,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: period === 'month' ? 4 : 6,
          pointHoverRadius: period === 'month' ? 6 : 8,
          fill: true,
          tension: period === 'month' ? 0.3 : 0.4,
        },
      ],
    });
  }, [period, selectedYear]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value as ChartPeriod);
  };

  const getCurrentStats = () => {
    let total = 0;
    let avg = 0;
    let peak = 0;

    switch (period) {
      case 'month':
        const currentMonth = new Date().getMonth();
        const isCurrentYear = selectedYear === new Date().getFullYear();
        const monthToShow = isCurrentYear ? currentMonth : 0;
        const monthData = getMonthlyExpensesByDay(selectedYear, monthToShow);
        
        total = monthData.reduce((sum, amount) => sum + amount, 0);
        avg = total / monthData.length;
        peak = Math.max(...monthData);
        break;
      
      case 'quarter':
        const quarterData = getQuarterlyExpenses();
        total = quarterData.reduce((sum, amount) => sum + amount, 0);
        avg = total / quarterData.length;
        peak = Math.max(...quarterData);
        break;
      
      case 'year':
        const yearData = getYearlyExpenses();
        total = yearData.reduce((sum, amount) => sum + amount, 0);
        const monthsWithData = yearData.filter(amount => amount > 0).length;
        avg = monthsWithData > 0 ? total / monthsWithData : 0;
        peak = Math.max(...yearData);
        break;
    }

    return { total, avg, peak };
  };

  const stats = getCurrentStats();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            return `$${context.parsed.y.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: period !== 'month',
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6c757d',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6c757d',
          callback: function (value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  const formatPeriodLabel = () => {
    const now = new Date();
    
    switch (period) {
      case 'month':
        if (selectedYear === now.getFullYear()) {
          const monthName = now.toLocaleDateString('en-US', { month: 'long' });
          return `${monthName} ${selectedYear}`;
        }
        return `January ${selectedYear}`;
      case 'quarter':
        return `Quarterly View - ${selectedYear}`;
      case 'year':
        return `Annual View - ${selectedYear}`;
    }
  };

  return (
    <div className="spending-chart-container">
      <div className="chart-header">
        <div>
          <h3>Spending Overview</h3>
          <p className="chart-period-label">{formatPeriodLabel()}</p>
        </div>
        
        <div className="chart-controls">
          <div className="year-navigation">
            <button 
              className="nav-button" 
              onClick={goToPreviousYear}
              disabled={availableYears.indexOf(selectedYear) >= availableYears.length - 1}
              title="Previous Year"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="year-picker-container">
              <button 
                className="year-display"
                onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
              >
                <Calendar size={16} />
                <span>{selectedYear}</span>
              </button>
              
              {isYearPickerOpen && (
                <div className="year-picker-dropdown">
                  {availableYears.map(year => (
                    <button
                      key={year}
                      className={`year-option ${selectedYear === year ? 'active' : ''}`}
                      onClick={() => handleYearChange(year)}
                    >
                      {year}
                      {year === new Date().getFullYear() && <span className="current-badge">Current</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              className="nav-button" 
              onClick={goToNextYear}
              disabled={availableYears.indexOf(selectedYear) <= 0}
              title="Next Year"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          
          <select className="chart-period" value={period} onChange={handlePeriodChange}>
            <option value="month">Daily View</option>
            <option value="quarter">Quarterly View</option>
            <option value="year">Monthly View</option>
          </select>
        </div>
      </div>
      
      <div className="chart-wrapper">
        {chartData.labels.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="chart-placeholder">
            <p>No spending data for {selectedYear}</p>
          </div>
        )}
      </div>
      
      <div className="chart-footer">
        <div className="chart-stats">
          <div className="stat">
            <span className="label">
              {period === 'month' ? 'Month Total' : period === 'quarter' ? 'Quarter Total' : 'Year Total'}
            </span>
            <span className="value">${stats.total.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}</span>
          </div>
          <div className="stat">
            <span className="label">
              {period === 'month' ? 'Daily Avg' : period === 'quarter' ? 'Quarterly Avg' : 'Monthly Avg'}
            </span>
            <span className="value">${stats.avg.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}</span>
          </div>
          <div className="stat">
            <span className="label">Peak {period === 'month' ? 'Day' : period === 'quarter' ? 'Quarter' : 'Month'}</span>
            <span className="value">${stats.peak.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;