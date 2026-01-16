import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "../../types";
import { StorageService } from "../../services/StorageService";
import { formatCurrency } from "../../utils/formatters";
import { categoryIcons } from "../../utils/categoryIcons"; // Import icon list
import { useAuth } from "../../context/AuthContext";
import "./CategoryCard.css";

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  console.log({ category });
  const { user } = useAuth();
  const currency = user?.currency || "USD";
  const transactions = StorageService.getTransactions().filter(
    (t) => parseInt(t.category) === category.id
  );
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const usageCount = transactions.length;

  // Find the icon component based on category.icon
  const iconConfig =
    categoryIcons.find((icon) => icon.name === category.icon) ||
    categoryIcons[0];
  const IconComponent = iconConfig.component;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(category);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(category.id.toString());
    }
  };

  return (
    <div className="category-card">
      <div className="card-header">
        <div
          className="category-icon"
          style={{ backgroundColor: category.color }}
        >
          <IconComponent size={20} /> {/* Use selected icon */}
        </div>
        <div className="category-info">
          <h4>{category.name}</h4>
          {category.isCustom && <span className="custom-badge">Custom</span>}
        </div>
        <div className="category-actions">
          {category.isCustom && (
            <>
              <button className="btn-icon-small" onClick={handleEdit}>
                <Edit size={16} />
              </button>
              <button className="btn-icon-small delete" onClick={handleDelete}>
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
          <strong>{formatCurrency(totalSpent, currency)}</strong>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
