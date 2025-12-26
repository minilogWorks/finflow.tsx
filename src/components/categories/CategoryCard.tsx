import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "../../types";
import { StorageService } from "../../services/StorageService";
import { formatCurrency } from "../../utils/formatters";
import { getCategoryIcon } from "../../utils/formatters";
import { getLucideIcon } from "../../utils/iconUtils";
import "./CategoryCard.css";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const transactions = StorageService.getTransactions().filter(
    (t) => t.categoryId === category.id
  );
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const usageCount = transactions.length;

  const iconName = getCategoryIcon(category.name);
  const Icon = getLucideIcon(iconName);

  return (
    <div className="category-card">
      <div className="card-header">
        <div
          className="category-icon"
          style={{ backgroundColor: category.color }}
        >
          <Icon size={20} />
        </div>
        <div className="category-info">
          <h4>{category.name}</h4>
          <span className={`category-type ${category.type}`}>
            {category.type}
          </span>
          {category.isCustom && <span className="custom-badge">Custom</span>}
        </div>
        <div className="category-actions">
          {category.isCustom && (
            <>
              <button className="btn-icon-small">
                <Edit size={16} />
              </button>
              <button className="btn-icon-small delete">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card-stats">
        <div className="stat">
          <span>Used</span>
          <strong>{usageCount} times</strong>
        </div>
        <div className="stat">
          <span>Total</span>
          <strong>{formatCurrency(totalSpent)}</strong>
        </div>
      </div>

     
    </div>
  );
};

export default CategoryCard;
