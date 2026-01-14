import React from "react";
import { TopCategory } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import { getCategoryIcon, getCategoryColor } from "../../utils/formatters";
import { getLucideIcon } from "../../utils/iconUtils";
import { useAuth } from "../../context/AuthContext";
import "./TopCategories.css";

interface TopCategoriesProps {
  categories: TopCategory[];
}

const TopCategories: React.FC<TopCategoriesProps> = ({ categories }) => {
  const { user } = useAuth();
  const currency = user?.currency || "USD";

  if (categories.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3>Top Categories</h3>
        </div>
        <div className="empty-state">
          <p>No spending data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Top Categories</h3>
      </div>
      <div className="categories-list">
        {categories.map((item, index) => {
          const iconName = getCategoryIcon(item.category.name);
          const color =
            item.category.color || getCategoryColor(item.category.name);
          const Icon = getLucideIcon(iconName);

          return (
            <div key={item.category.id} className="category-item">
              <div className="category-rank">{index + 1}</div>
              <div className="category-icon" style={{ backgroundColor: color }}>
                <Icon size={16} />
              </div>
              <div className="category-info">
                <h4>{item.category.name}</h4>
                <p>{formatCurrency(item.amount, currency)}</p>
              </div>
              <div className="category-percentage">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span>{item.percentage.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCategories;
