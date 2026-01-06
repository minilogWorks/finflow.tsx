import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Category } from "../../types";
import CategoryCard from "./CategoryCard";
import AddCategoryModal from "./AddCategoryModal";
import { StorageService } from "../../services/StorageService";
import { generateId } from "../../utils/helpers";
import "./CategoriesView.css";

interface CategoriesViewProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onCategoriesChange,
}) => {
  const [activeTab, setActiveTab] = useState<
    "all" | "expense" | "income" | "custom"
  >("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");
  const customCategories = categories.filter((c) => c.isCustom);

  const getFilteredCategories = () => {
    switch (activeTab) {
      case "expense":
        return expenseCategories;
      case "income":
        return incomeCategories;
      case "custom":
        return customCategories;
      default:
        return categories;
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? This will also delete all transactions in this category."
      )
    ) {
      return;
    }

    // Delete category from categories
    const updatedCategories = categories.filter((c) => c.id !== categoryId);

    // Delete transactions associated with this category
    const transactions = StorageService.getTransactions();
    const updatedTransactions = transactions.filter(
      (t) => t.category !== categoryId
    );

    // Update storage
    StorageService.saveTransactions(updatedTransactions);
    onCategoriesChange(updatedCategories);
  };

  const handleSaveCategory = (categoryData: Omit<Category, "id">) => {
    let updatedCategories: Category[];

    if (editingCategory) {
      // Update existing category
      updatedCategories = categories.map((c) =>
        c.id === editingCategory.id
          ? { ...categoryData, id: editingCategory.id }
          : c
      );
    } else {
      // Add new category
      const newCategory: Category = {
        ...categoryData,
        id: generateId(),
      };
      updatedCategories = [...categories, newCategory];
    }

    onCategoriesChange(updatedCategories);
  };

  return (
    <div className="categories-view">
      <div className="view-header">
        <h2>Categories</h2>
        <button className="btn-primary" onClick={handleAddCategory}>
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="category-tabs">
        {(["all", "expense", "income", "custom"] as const).map((tab) => (
          <button
            key={tab}
            className={`category-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "all" && "All Categories"}
            {tab === "expense" && `Expenses (${expenseCategories.length})`}
            {tab === "income" && `Income (${incomeCategories.length})`}
            {tab === "custom" && `Custom (${customCategories.length})`}
          </button>
        ))}
      </div>

      <div className="categories-grid">
        {getFilteredCategories().map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default CategoriesView;
