import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Category } from "../../types";
import CategoryCard from "./CategoryCard";
import AddCategoryModal from "./AddCategoryModal";
import "./CategoriesView.css";
import { getCategoriesQueryOptions } from "../../queryOptions/getCategoriesQueryOptions";
import { useQueries } from "@tanstack/react-query";
import { getTransactionsQueryOptions } from "../../queryOptions/getTransactionsQueryOptions";
import Loader from "../../components/shared/Loader";

const CategoriesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "custom">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();

  const [transactions, categories] = useQueries({
    queries: [getTransactionsQueryOptions(), getCategoriesQueryOptions()],
  });

  // TODO: Clean up isPending and error states
  if (transactions.isPending || categories.isPending) {
    return <Loader />;
  }

  if (transactions.error || categories.error) {
    return (
      <>
        {transactions.error && transactions.error.message}
        {categories.error && categories.error.message}
      </>
    );
  }
  const customCategories = categories.data.filter((c) => c.isCustom);

  const getFilteredCategories = () => {
    switch (activeTab) {
      case "custom":
        return customCategories;
      default:
        return categories.data;
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

  // const handleDeleteCategory = (categoryId: string) => {
  //   if (
  //     !window.confirm(
  //       "Are you sure you want to delete this category? This will also delete all transactions in this category."
  //     )
  //   ) {
  //     return;
  //   }
  // };

  // const handleSaveCategory = (categoryData: Omit<Category, "id">) => {

  // };

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
        {["all", "custom"].map((tab) => (
          <button
            key={tab}
            className={`category-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab as "all" | "custom")}
          >
            {tab === "all" && "All Categories"}
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
            onDelete={() => {}}
          />
        ))}
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {}}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default CategoriesView;
